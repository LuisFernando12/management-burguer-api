import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './service/auth.service';
import { PrismaService } from './service/prisma.service';
import { TokenService } from './service/token.service';
import { LoginDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDTO } from './dto/refreshToken.dto';
const fail = (message: string) => {
  throw new Error(message);
};
function encryptPassword(password: string): string {
  const salt: number = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}
describe('Auth Service', () => {
  let authService: AuthService;
  const tokenObject = {
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJKYWlsc29uIiwidXNlcm5hbWUiOiJqYWlsc29uQHRlc3RlLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcyMzQ5MTgwMSwiZXhwIjoxNzIzNDkxODYxfQ.t6c_jcLan_0esRyZoicXv49OPL3KfoQLECB9z0bUGDM',
    expireIn: 1221,
  };

  const mockEmployeeDB = {
    id: 1,
    name: 'Teste',
    documentNumber: '123456789',
    email: 'teste@teste.com',
    password: encryptPassword('password'),
    createdAt: '2024-08-13T02:01:48.661Z',
    updateAt: '2024-08-13T02:01:48.661Z',
    active: true,
    role: 'ADMIN',
  };

  const mockPrismaService = {
    employee: { findUnique: jest.fn().mockResolvedValue(mockEmployeeDB) },
  };

  const mockTokenService = {
    saveToken: jest.fn().mockResolvedValue(tokenObject),
    generateTokenToClient: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: TokenService, useValue: mockTokenService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
  describe('Login', () => {
    let inputLogin: LoginDTO;
    let prismaLoginWhere;
    beforeEach(async () => {
      inputLogin = {
        documentNumber: '123456789',
        password: 'password',
      };
      prismaLoginWhere = {
        where: { documentNumber: inputLogin.documentNumber },
      };
    });
    it('should call prismaService.findUnique', async () => {
      await authService.login(inputLogin);
      expect(mockPrismaService.employee.findUnique).toHaveBeenCalledTimes(1);
      expect(mockPrismaService.employee.findUnique).toHaveBeenCalledWith(
        prismaLoginWhere,
      );
    });

    it('should return access_token object ', async () => {
      const result = await authService.login(inputLogin);
      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('expireIn');
      expect(typeof result.access_token).toEqual('string');
      expect(typeof result.expireIn).toEqual('number');
    });

    it('should be return error invalid credentials', async () => {
      delete inputLogin.password;
      try {
        await authService.login(inputLogin);
        fail('Expected an error');
      } catch (error) {
        expect(error.message).toBe('Invalid credentials');
        expect(error).toBeInstanceOf(UnauthorizedException);
      }
    });
  });
  describe('RefreshToken', () => {
    let inputRefreshToken: RefreshTokenDTO;
    beforeEach(() => {
      inputRefreshToken = {
        oldToken: tokenObject.access_token,
      };
    });
    it('should call refreshToken', async () => {
      await authService.refreshToken(inputRefreshToken);
      expect(mockTokenService.saveToken).toHaveBeenCalledTimes(1);
      expect(mockTokenService.saveToken).toHaveBeenCalledWith({
        token: inputRefreshToken.oldToken,
      });
    });
  });
  describe('ClientToken', () => {
    it('should call generateTokenToClient', async () => {
      await authService.clientToken(tokenObject.access_token);
      expect(mockTokenService.generateTokenToClient).toHaveBeenCalledTimes(1);
      expect(mockTokenService.generateTokenToClient).toHaveBeenCalledWith(
        tokenObject.access_token,
      );
    });
  });
});
