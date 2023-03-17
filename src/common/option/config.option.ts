import { configScheme } from '@common/scheme/config.scheme';
import { ConfigModuleOptions } from '@nestjs/config';
export const configOption: ConfigModuleOptions = {
  envFilePath: [`${__dirname}/config/env/.${process.env.NODE_ENV}.env`],

  validationSchema: configScheme,
  validationOptions: {
    allowUnknown: true,
    abortEarly: true,
  },
  isGlobal: true,
};
