import { baseApiResponeStatus } from '@common/response/baseApiResponeStatus';
import { BaseApiResponse } from '@common/response/BaseApiResponse';
import { applyDecorators } from '@nestjs/common';
import { ApiResponse, getSchemaPath } from '@nestjs/swagger';

export function SwaggerResponse<T>(
  statusCode: number,
  resultType: any,
  isArray: boolean,
  description: string,
  state: BaseApiResponse<any> = baseApiResponeStatus.SUCCESS,
  result?: T,
) {
  return applyDecorators(
    ApiResponse({
      status: statusCode,

      description: description,
      schema: {
        example: {
          status_code: Math.floor(statusCode),
          ...new BaseApiResponse(state, result),
        },
        // $ref: getSchemaPath(BaseApiResponse),
        properties: {
          is_success: {
            description: '성공 여부',
            type: 'boolean',
          },
          status_code: {
            description: 'status_code',
            type: 'number',
          },
          message: {
            description: '추가 메세지',
            type: 'string',
          },
          result: resultType
            ? {
                type: isArray ? 'array' : undefined,
                $ref: !isArray ? getSchemaPath(resultType) : undefined,
                items: isArray
                  ? { $ref: getSchemaPath(resultType) }
                  : undefined,
              }
            : undefined,
        },
      },
    }),
  );
}
