import { Body, Controller, Delete, Get, Post, Put, Req } from '@nestjs/common';
import {
  CreateEventDto,
  DeleteEventDto,
  EditEventDto,
  GetEventDto,
  InteractionDto,
} from 'src/app/dtos/event.dto';
import { EventWorkflows } from 'src/app/workflows/event.workflow';
import { Role } from 'src/domain/enum';
import { Roles } from 'src/web/filters/Decorators/roles.decorator';

@Controller('api/event')
export class EventController {
  constructor(private readonly wfs: EventWorkflows) {}

  @Roles(Role.Organizer)
  @Post('/upload')
  async create(@Body() body: CreateEventDto, @Req() req) {
    return await this.wfs.createEvent(body, req.user);
  }

  @Roles(Role.Organizer)
  @Put('/edit')
  async edit(@Body() body: EditEventDto) {
    console.log('function k andar');
    return await this.wfs.editEvent(body);
  }

  @Roles(Role.Organizer)
  @Delete('/delete')
  async delete(@Body() body: DeleteEventDto) {
    return await this.wfs.deleteEvent(body);
  }

  @Get('/details')
  async getDetails(@Body() body: GetEventDto) {
    return await this.wfs.getEvent(body);
  }

  //Add user to an event's interestedBy List.
  //Only a user can access this route.
  @Roles(Role.User)
  @Post('/interested-by')
  async addToInterestedBy(@Body() body: InteractionDto, @Req() req) {
    return await this.wfs.addToInterestedByListOfEvent(body, req.user);
  }

  //Fetch an event's interstedBy List.
  //Only an organizer can access this route.
  @Roles(Role.Organizer)
  @Get('/interested-by')
  async fetchInterestedBy(@Body() body: InteractionDto, @Req() req) {
    return await this.wfs.fetchInterestedByListOfEvent(body, req.user);
  }

  //To remove a user from an event's interstedBy List.
  //Only a user can access this route.
  @Roles(Role.User)
  @Delete('interested-by')
  async deleteInterestedBy(@Body() body: InteractionDto, @Req() req) {
    return await this.wfs.deletefromInterestedByListOfEvent(body, req.user);
  }

  //Add user to an event's favoritedBy List.
  //Only a user can access this route.
  @Roles(Role.User)
  @Post('/favorited-by')
  async addToFavoritedBy(@Body() body: InteractionDto, @Req() req) {
    return await this.wfs.addToFavoritedByListOfEvent(body, req.user);
  }

  //Fetch an event's favoritedBy List.
  //Only an organizer can access this route.
  @Roles(Role.Organizer)
  @Get('/favorited-by')
  async fetchFavoritedBy(@Body() body: InteractionDto) {
    return await this.wfs.fetchFavoritedByListOfEvent(body);
  }

  //To remove a user from an event's favoritedBy List.
  //Only a user can access this route.
  @Roles(Role.User)
  @Delete('/favorited-by')
  async deleteFavoritedBy(@Body() body: InteractionDto, @Req() req) {
    return await this.wfs.deletefromFavoritedByListOfEvent(body, req.user);
  }
}
