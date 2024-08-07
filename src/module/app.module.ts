import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product.module';
import { IngredientModule } from './ingredient.module';
import { ResquestModule } from './request.module';
import { JwtModule } from '@nestjs/jwt';
import { EmployeeModule } from './employee.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    ProductModule,
    IngredientModule,
    ResquestModule,
    EmployeeModule,
    AuthModule,
  ],
})
export class AppModule {}
