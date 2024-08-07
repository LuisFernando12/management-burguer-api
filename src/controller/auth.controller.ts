import { IClientToken } from './../interface/clientToken.interface';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ILogin } from 'src/interface/auth.interface';
import { IRefreshToken } from 'src/interface/token.interface';
import { AuthService } from 'src/service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async doLogin(@Body() { documentNumber, password }: ILogin) {
    if (!documentNumber || !password) {
      throw new UnauthorizedException('Invalid params');
    }
    return await this.authService.login({ documentNumber, password });
  }

  @Post('/token/refresh-token')
  async refreshToken(@Body() { oldToken }: IRefreshToken) {
    if (!oldToken) {
      throw new UnauthorizedException('Invalid old token');
    }
    return await this.authService.refreashToken({ oldToken });
  }

  @Post('/token/client')
  async clientToken(@Body() { token }: IClientToken) {
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    return await this.authService.clientToken(token);
  }
}
