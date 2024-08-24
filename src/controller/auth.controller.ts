import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ClientTokenDTO } from './../dto/clientToken.dto';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDTO } from '../dto/auth.dto';
import { AuthService } from '../service/auth.service';
import { RefreshTokenDTO } from '../dto/refreshToken.dto';
import { TokenDTO } from '../dto/token.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  @ApiCreatedResponse({ type: TokenDTO })
  async doLogin(@Body() body: LoginDTO): Promise<Omit<TokenDTO, 'employeeId'>> {
    if (!body.documentNumber || !body.password) {
      throw new UnauthorizedException('Invalid params');
    }
    return await this.authService.login(body);
  }

  @Post('/token/refresh-token')
  @ApiCreatedResponse({ type: TokenDTO })
  async refreshToken(
    @Body() { oldToken }: RefreshTokenDTO,
  ): Promise<Omit<TokenDTO, 'employeeId'>> {
    if (!oldToken) {
      throw new UnauthorizedException('Invalid old token');
    }
    return await this.authService.refreshToken({ oldToken });
  }

  @Post('/token/client')
  @ApiCreatedResponse({ type: TokenDTO })
  async clientToken(
    @Body() { token }: ClientTokenDTO,
  ): Promise<Omit<TokenDTO, 'employeeId'>> {
    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }
    return await this.authService.clientToken(token);
  }
}
