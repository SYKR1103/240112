import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';

@Module({
  imports: [HttpModule, ConfigModule, TypeOrmModule.forFeature([Movie])],
  controllers: [MovieController],

  providers: [MovieService],
})
export class MovieModule {}
