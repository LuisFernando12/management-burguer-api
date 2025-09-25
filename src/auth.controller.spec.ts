import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { LoginDTO } from './dto/auth.dto';
import { UnauthorizedException } from '@nestjs/common';
import { RefreshTokenDTO } from './dto/refreshToken.dto';
import { ClientTokenDTO } from './dto/clientToken.dto';
const fail = (message: string) => {
  throw new Error(message);
};
describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const tokenObject = {
    access_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsIm5hbWUiOiJKYWlsc29uIiwidXNlcm5hbWUiOiJqYWlsc29uQHRlc3RlLmNvbSIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcyMzQ5MTgwMSwiZXhwIjoxNzIzNDkxODYxfQ.t6c_jcLan_0esRyZoicXv49OPL3KfoQLECB9z0bUGDM',
  };
  const mockAuthService = {
    login: jest.fn(),
    refreshToken: jest.fn(),
    clientToken: jest.fn(),
  };
  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
    expect(authService).toBeDefined();
  });

  describe('doLogin', () => {
    let inputLogin: LoginDTO;
    beforeEach(() => {
      inputLogin = {
        documentNumber: '123456789',
        password: 'password',
      };
    });
    it('should call authService.login', async () => {
      await authController.doLogin(inputLogin);
      expect(authService.login).toBeCalledWith(inputLogin);
    });

    it('should throw an error if documentNumber or password are missing', async () => {
      delete inputLogin.password;
      try {
        await authController.doLogin(inputLogin);
        fail('Expected an error  UnauthorizedException');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid params');
      }
    });

    it('should call doLogin with success', async () => {
      await authController.doLogin(inputLogin);
      expect(mockAuthService.login).toHaveBeenCalledTimes(1);
      expect(mockAuthService.login).toHaveBeenCalledWith(inputLogin);
    });
  });

  describe('refreshToken', () => {
    let inputRefreshToken: RefreshTokenDTO;
    beforeEach(() => {
      inputRefreshToken = {
        oldToken: tokenObject.access_token,
      };
    });

    it('should call authService.refreashToken', async () => {
      await authController.refreshToken(inputRefreshToken);
      expect(authService.refreshToken).toBeCalledWith(inputRefreshToken);
    });

    it('should return token object', async () => {
      await authController.refreshToken(inputRefreshToken);
      expect(mockAuthService.refreshToken).toHaveBeenCalledTimes(1);
      expect(mockAuthService.refreshToken).toHaveBeenCalledWith(
        inputRefreshToken,
      );
    });
    it('should throw an error if oldToken is missing', async () => {
      delete inputRefreshToken.oldToken;
      try {
        await authController.refreshToken(inputRefreshToken);
        fail('Expected an error UnauthorizedException');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid old token');
      }
    });
  });
  describe('clientToken', () => {
    let clientToken: ClientTokenDTO;
    beforeEach(() => {
      clientToken = {
        token: tokenObject.access_token,
      };
    });

    it('should call authService.clientToken', async () => {
      await authController.clientToken(clientToken);
      expect(authService.clientToken).toBeCalledWith(clientToken.token);
    });

    it('should return Unauthorized Error', async () => {
      try {
        const clientToken: ClientTokenDTO = {
          token: '',
        };
        await authController.clientToken(clientToken);
        fail('Expected an error UnauthorizedException');
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toEqual('Invalid token');
      }
    });

    it('should call authController.clientToken with success', async () => {
      await authController.clientToken(clientToken);
      expect(mockAuthService.clientToken).toHaveBeenCalledTimes(1);
      expect(mockAuthService.clientToken).toHaveBeenCalledWith(
        clientToken.token,
      );
    });
  });
});
