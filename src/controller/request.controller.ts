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
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { RequestDTO, ResponseRequestDTO } from '../dto/request.dto';
import { AuthGuard } from '../guard/auth.guard';
import { RequestService } from '../service/request.service';

@Controller('/request')
@ApiTags('Request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}
  @Post('/')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: String })
  async create(@Body() request: RequestDTO): Promise<string> {
    return await this.requestService.create(request);
  }
  @Get('/')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: [ResponseRequestDTO] })
  async findAll(): Promise<ResponseRequestDTO[]> {
    return await this.requestService.find();
  }
  @Get('client/:clientId')
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({ type: [ResponseRequestDTO] })
  async findAllByClient(
    @Param('clientId') clientId: number,
  ): Promise<ResponseRequestDTO[]> {
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
  @ApiCreatedResponse({ type: ResponseRequestDTO })
  async getRequest(@Param('id') id: number): Promise<ResponseRequestDTO> {
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
  @ApiCreatedResponse({ type: ResponseRequestDTO })
  async update(
    @Body() request: Partial<RequestDTO>,
    @Param('id') id: number,
  ): Promise<ResponseRequestDTO> {
    if (id) {
      return await this.requestService.update(request, Number(id));
    }
    throw new BadRequestException();
  }
}
