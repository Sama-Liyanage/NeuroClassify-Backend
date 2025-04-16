import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPort,
  IsString,
} from 'class-validator';
import { NodeEnvironment } from './env';

export class EnvironmentConfig {
  @IsOptional()
  @IsPort()
  PORT = `5000`;

  @IsOptional()
  @IsEnum(NodeEnvironment)
  NODE_ENV: NodeEnvironment = NodeEnvironment.DEV;

  @IsNotEmpty()
  @IsString()
  MS_AUTH_BASE_URL: string;

  @IsNotEmpty()
  @IsString()
  MS_CLINIC_BASE_URL: string;

  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;
}
