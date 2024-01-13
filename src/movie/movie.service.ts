import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { Column, Repository } from 'typeorm';
import { PageOptionsDto } from '../dtos/page-options.dto';
import { PageDto } from '../dtos/page.dto';
import { PageMetaDto } from '../dtos/page-meta.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepo: Repository<Movie>,

    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async createMovies() {
    const { data, status } = await this.httpService
      .get(this.configService.get('TMDB_URL'), {
        headers: { Authorization: this.configService.get('TMDB_KEY') },
      })
      .toPromise();

    const datas = data.results;
    const moviedata = [];

    if (status === 200) {
      datas?.map((data) =>
        moviedata.push({
          title: data['title'],

          overview: data['overview'],

          release_date: data['release_date'],

          adult: data['adult'],

          vote_average: data['vote_average'],
        }),
      );
    }
    await this.movieRepo.save(moviedata);
  }

  async getAllMovies(pageOptionDto: PageOptionsDto) {
    const queryBuilder = await this.movieRepo.createQueryBuilder('movie');

    await queryBuilder
      .orderBy('movie.createdAt', pageOptionDto.order)
      .skip(pageOptionDto.skip)
      .take(pageOptionDto.take);

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    const pageMeta = new PageMetaDto({ pageOptionDto, itemCount });
    return new PageDto(entities, pageMeta);
  }
}
