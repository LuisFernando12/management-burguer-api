import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MinioModule } from 'nestjs-minio-client';
import { MinioController } from 'src/controller/minio.controller';
import { MinioClientService } from 'src/service/minio.client.service';

@Module({
  imports: [
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          endPoint: config.get('MINIO_ENDPOINT'),
          port: Number(config.get('MINIO_PORT')),
          accessKey: config.get('MINIO_ACCESS_KEY'),
          secretKey: config.get('MINIO_SECRET_KEY'),
          useSSL: false,
        };
      },
    }),
  ],
  providers: [MinioClientService, ConfigService],
  controllers: [MinioController],
})
export class MinioClientModule {}
