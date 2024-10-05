import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MinioClientService } from 'src/service/minio.client.service';

@Controller('minio')
export class MinioController {
  constructor(private readonly minioClientService: MinioClientService) {}
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException();
    return await this.minioClientService.uploadFile(file);
  }
}
