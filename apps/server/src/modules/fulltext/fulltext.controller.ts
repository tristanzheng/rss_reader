import { Controller, Param, Post } from '@nestjs/common';
import { FulltextService } from './fulltext.service';

@Controller('fulltext')
export class FulltextController {
  constructor(private readonly service: FulltextService) {}

  @Post(':id/fetch')
  fetch(@Param('id') id: string) {
    return this.service.fetch(id);
  }
}
