import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { EventWorkflows } from 'src/app/workflows/event.workflow';
import { Public } from 'src/web/filters/Decorators/public.decorator';

@Public()
@Controller('event')
export class EventController {
  constructor(private readonly wfs: EventWorkflows) {}

  @Get('')
  demo() {
    return this.wfs.demo();
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
    return 'Delete Event';
  }

  @Post('/interested-by')
  addToInterestedBy(@Body() body: unknown) {
    return 'Add to interestedBY';
  }

  @Get('/interested-by')
  FetchInterestedBy(@Body() body: unknown) {
    return 'Fetch InterestedBy for an event.';
  }

  @Post('/favorited-by')
  addToFavoritedBy(@Body() body: unknown) {
    return 'Add to favoritedBY';
  }

  @Get('/favorited-by')
  FetchFavoritedBy(@Body() body: unknown) {
    return 'Fetch InterestedBy for an event.';
  }
}
