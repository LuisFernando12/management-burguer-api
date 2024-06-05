import {
  BadRequestException,
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateRequestDTO, RequestDTO } from 'src/dto/request.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { RequestService } from 'src/service/request.service';

@Controller('/request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}
  @Post('/')
  @UseGuards(AuthGuard)
  async create(@Body() request: CreateRequestDTO): Promise<CreateRequestDTO> {
    if (request) {
      return await this.requestService.create(request);
    } else {
      throw new BadRequestException();
    }
  }
  @Get('/')
  @UseGuards(AuthGuard)
  async findAll(): Promise<RequestDTO[]> {
    return await this.requestService.find();
  }
  @Get('client/:clientId')
  @UseGuards(AuthGuard)
  async findAllByClient(
    @Param('clientId') clientId: number,
  ): Promise<RequestDTO[]> {
    if (clientId) {
      try {
        return await this.requestService.findByClient(Number(clientId));
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }
    throw new BadRequestException();
  }
  @Get('/:id')
  @UseGuards(AuthGuard)
  async getRequest(@Param('id') id: number): Promise<RequestDTO> {
    if (id) {
      try {
        return await this.requestService.get(Number(id));
      } catch (error) {
        throw new NotFoundException(error);
      }
    }
    throw new BadRequestException();
  }
  @Put('/:id')
  async update(
    @Body() request: Partial<RequestDTO>,
    @Param('id') id: number,
  ): Promise<RequestDTO> {
    if (id && request) {
      return await this.requestService.update(request, Number(id));
    }
    throw new BadRequestException();
  }
}
