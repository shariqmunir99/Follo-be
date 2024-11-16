import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { EventWorkflows } from 'src/app/workflows/event.workflow';
import { Public } from 'src/web/filters/Decorators/public.decorator';

@Public()
@Controller('event')
export class EventController {
  constructor(private readonly wfs: EventWorkflows) {}

  @Get('')
  demo() {
    return this.wfs.demoCreate();
  }
  @Post('/upload')
  create(@Body() body: unknown) {
    return 'Create Event';
  }

  @Put('/edit')
  edit(@Body() body: unknown) {
    return 'Edit Event details';
  }

  @Get('/details')
  getDetails(@Body() body: unknown) {
    return 'Get Event Details';
  }

  @Delete()
  delete(@Body() body: unknown) {
    return this.wfs.demoDelete('effbc9e2-9287-4f57-8667-b6b100b82469');
  }

  @Post('/interested-by')
  addToInterestedBy(@Body() body: unknown) {
    return this.wfs.demoCreateInterestedBy(
      'b80fa63f-4d82-49f6-a09f-df24bf517ccc',
      '0a049db2-de21-4666-8ce1-b0808d4037ae',
    );
  }

  @Get('/interested-by')
  fetchInterestedBy(@Body() body: unknown) {
    return this.wfs.demoDeleteInterestedBy(
      '0b823b2f-7570-4519-ab06-04a01030648c',
    );
  }

  @Delete('/interested-by')
  deleteInterestedBy(@Body() body: unknown) {
    return this.wfs.demoDeleteInterestedBy(
      '0b823b2f-7570-4519-ab06-04a01030648c',
    );
  }

  @Post('/favorited-by')
  addToFavoritedBy(@Body() body: unknown) {
    return this.wfs.demoCreateFavoritedBy(
      'b80fa63f-4d82-49f6-a09f-df24bf517ccc',
      '0a049db2-de21-4666-8ce1-b0808d4037ae',
    );
  }

  @Get('/favorited-by')
  fetchFavoritedBy(@Body() body: unknown) {
    return this.wfs.demoFetchFavoritedByUser(
      'b80fa63f-4d82-49f6-a09f-df24bf517ccc',
    );
  }
}
