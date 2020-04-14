import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoutesController } from './routes.controller';
import { RoutesService } from './routes.service';
import { RouteSchema } from './schemas/routes.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Route', schema: RouteSchema }]),
  ],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
