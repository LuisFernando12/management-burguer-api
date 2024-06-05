import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateRequestDTO, RequestDTO } from 'src/dto/request.dto';

@Injectable()
export class RequestService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(request: CreateRequestDTO): Promise<any> {
    request['status'] = 'PENDING';
    const { productIds, ...data } = request;
    try {
      const requestDB = await this.prismaService.request.create({
        data: data,
      });
      productIds.forEach(async (productId) => {
        await this.prismaService.productOnRequests.create({
          data: { productId: productId, requestId: requestDB.id },
        });
      });
      return { ...requestDB, productIds };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async find(): Promise<RequestDTO[]> {
    try {
      const requestDB = await this.prismaService.request.findMany({
        include: { products: { include: { product: true } } },
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
  async findByClient(clientId: number): Promise<RequestDTO[]> {
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
  async get(id: number): Promise<RequestDTO> {
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
    request: Partial<Omit<RequestDTO, 'products'>>,
    id: number,
  ): Promise<RequestDTO> {
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
