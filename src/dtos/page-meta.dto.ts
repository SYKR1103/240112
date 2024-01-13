import { ApiProperty } from '@nestjs/swagger';
import { PageMetaInterface } from '../interfaces/pageMeta.interface';

export class PageMetaDto {
  @ApiProperty()
  readonly take: number;

  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPrevious: boolean;

  @ApiProperty()
  readonly hasNext: boolean;

  constructor({ pageOptionDto, itemCount }: PageMetaInterface) {
    this.take = pageOptionDto.take;
    this.page = pageOptionDto.page;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.take);
    this.hasNext = this.page < this.pageCount;
    this.hasPrevious = this.page > 1;
  }
}
