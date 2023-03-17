import { winstonOption } from '@common/option/winston.option';
import { WinstonModule } from 'nest-winston';

export const winstonLogger = WinstonModule.createLogger(winstonOption);
