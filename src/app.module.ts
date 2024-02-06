import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";
import * as Joi from 'joi';


@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: "postgres",
        host: "localhost",
        port: configService.get("POSTGRES_DB_PORT"),
        username: configService.get("POSTGRES_DB_USER"),
        password: configService.get("POSTGRES_DB_PASS"),
        database: configService.get("POSTGRES_DB_NAME"),
        autoLoadModels: true,
        synchronize: true
      }),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_DB_PASS: Joi.string().required(),
        POSTGRES_DB_USER: Joi.string().required(),
        POSTGRES_DB_NAME: Joi.string().required(),
        POSTGRES_DB_PORT: Joi.number().required()
      })
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {
}
