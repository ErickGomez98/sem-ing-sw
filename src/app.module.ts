import { RoutesModule } from './routes/routes.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    RoutesModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`${process.env.DB_CONNECTION}`),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
