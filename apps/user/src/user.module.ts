import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { DatabaseModule } from 'database/database';
import { RmqModule } from '@rmq/rmq';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { GoogleStrategy } from './auth/utils/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { SessionSerializer } from './auth/utils/Serializer';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/utils/jwt.strategy';
import { FacebookStrategy } from './auth/utils/facebook.strategy';

@Module({
  imports: [
    PassportModule.register({ session: true, defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGOODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        CLIENTID: Joi.string().required(),
        CLIENTSECRET: Joi.string().required(),
      }),
      envFilePath: './apps/user/.env',
    }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // RmqModule.register({name: }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    GoogleStrategy,
    SessionSerializer,
    UserService,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },

    JwtStrategy,
    FacebookStrategy,
  ],
  exports: [UserService],
})
export class UserModule {}
