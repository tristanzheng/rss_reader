import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUserId } from '../../common/user-context.decorator';
import { OpmlService } from './opml.service';

interface ImportBody {
  text: string;
}

@Controller('opml')
export class OpmlController {
  constructor(private readonly service: OpmlService) {}

  @Post('import')
  import(@CurrentUserId() userId: string, @Body() body: ImportBody) {
    return this.service.import({ userId, text: body.text });
  }

  @Get('export')
  export(@CurrentUserId() userId: string) {
    return this.service.export(userId);
  }
}
