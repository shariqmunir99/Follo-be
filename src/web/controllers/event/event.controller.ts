import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleDriveService } from 'nestjs-googledrive-upload';
import {
  CreateEventDto,
  DeleteEventDto,
  EditEventDto,
  GetEventDto,
  InteractionDto,
} from 'src/app/dtos/event.dto';
import { CustomUploadFileTypeValidator } from 'src/app/validators/file.valdator';
import { EventWorkflows } from 'src/app/workflows/event.workflow';
import { Role } from 'src/domain/enum';
import { Public } from 'src/web/filters/Decorators/public.decorator';
import { Roles } from 'src/web/filters/Decorators/roles.decorator';

const MAX_PROFILE_PICTURE_SIZE_IN_BYTES = 2 * 1024 * 1024;
const VALID_UPLOADS_MIME_TYPES = ['image/jpeg', 'image/png'];

@Controller('api/event')
export class EventController {
  constructor(
    private readonly wfs: EventWorkflows,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async test(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidator({
            fileType: VALID_UPLOADS_MIME_TYPES,
          }),
        )
        .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file,
    @Body() Body: CreateEventDto,
  ) {
    try {
      // do something with the link, e.g., save it to the database
      return { Body, file };
    } catch (e) {
      throw new Error(e);
    }
  }

  @Roles(Role.Organizer)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload')
  async create(
    @Body() body: CreateEventDto,
    @Req() req,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidator({
            fileType: VALID_UPLOADS_MIME_TYPES,
          }),
        )
        .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file,
  ) {
    return await this.wfs.createEvent(body, req.user, file);
  }

  @Roles(Role.Organizer)
  @Put('/edit')
  async edit(@Body() body: EditEventDto) {
    return await this.wfs.editEvent(body);
  }

  @Roles(Role.Organizer)
  @Delete('/delete')
  async delete(@Body() body: DeleteEventDto) {
    return await this.wfs.deleteEvent(body);
  }

  @Get('/details')
  async getDetails(@Query() body: GetEventDto) {
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
  async fetchInterestedBy(@Query() body: InteractionDto, @Req() req) {
    return await this.wfs.fetchInterestedByListOfEvent(body, req.user);
  }

  //To remove a user from an event's interstedBy List.
  //Only a user can access this route.
  @Roles(Role.User)
  @Delete('/interested-by')
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
  async fetchFavoritedBy(@Query() body: InteractionDto) {
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
