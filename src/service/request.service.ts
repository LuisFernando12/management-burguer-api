import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { RequestDTO, ResponseRequestDTO } from 'src/dto/request.dto';

@Injectable()
export class RequestService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(request: RequestDTO): Promise<string> {
    request['status'] = 'PENDING';
    const { productIds, ...data } = request;
    try {
      await this.prismaService.$transaction(async (trx) => {
        const requestDB = await trx.request.create({
          data: data,
        });
        for (const productId of productIds) {
          await trx.productOnRequests.create({
            data: { productId: productId, requestId: requestDB.id },
          });
        }
      });
      return 'Request received';
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async find(): Promise<ResponseRequestDTO[]> {
    try {
      const requestDB = await this.prismaService.request.findMany({
        include: {
          products: { include: { product: true } },
          employee: true,
          client: true,
        },
      });
      return requestDB.map((request) => {
        const { products, ...requestDB } = request;
        return {
          ...requestDB,
          products: products.map(({ product }) => product),
        };
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async findByClient(clientId: number): Promise<ResponseRequestDTO[]> {
    try {
      const requestDB = await this.prismaService.request.findMany({
        include: { products: { include: { product: true } } },
        where: { clientId: clientId },
      });
      return requestDB.map((request) => {
        const { products, ...requestDB } = request;
        return {
          ...requestDB,
          products: products.map(({ product }) => product),
        };
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async get(id: number): Promise<ResponseRequestDTO> {
    try {
      const requestDB = await this.prismaService.request.findUnique({
        where: { id: id },
        include: { products: { include: { product: true } } },
      });
      const { products, ...request } = requestDB;
      return { ...request, products: products.map(({ product }) => product) };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async update(
    request: Partial<Omit<RequestDTO, 'productIds'>>,
    id: number,
  ): Promise<ResponseRequestDTO> {
    try {
      const requestDB = await this.prismaService.request.update({
        data: request,
        where: { id: id },
        include: {
          products: {
            include: {
              product: true,
            },
          },
        },
      });
      const { products, ...data } = requestDB;
      return { ...data, products: products.map(({ product }) => product) };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async delete(id: number): Promise<string> {
    try {
      await this.prismaService.request.delete({ where: { id: id } });
      return 'ok';
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
