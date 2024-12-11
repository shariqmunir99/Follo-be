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
import {
  CreateEventDto,
  DeleteEventDto,
  EditEventDto,
  GetEventDto,
  InteractionDto,
} from 'src/app/dtos/event.dto';
import {
  CustomUploadFileTypeValidator,
  MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
  VALID_UPLOADS_MIME_TYPES,
} from 'src/app/validators/file.valdator';
import { EventWorkflows } from 'src/app/workflows/event.workflow';
import { Role } from 'src/domain/enum';
import { Roles } from 'src/web/filters/Decorators/roles.decorator';
import { OptionalFileValidationPipe } from 'src/web/filters/Pipes/file.pipes';

@Controller('api/event')
export class EventController {
  constructor(private readonly wfs: EventWorkflows) {}

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
  @UseInterceptors(FileInterceptor('file'))
  async editProfile(
    @Body() body: EditEventDto,
    @UploadedFile(
      new OptionalFileValidationPipe(
        new ParseFilePipeBuilder()
          .addValidator(
            new CustomUploadFileTypeValidator({
              fileType: VALID_UPLOADS_MIME_TYPES,
            }),
          )
          .addMaxSizeValidator({ maxSize: MAX_PROFILE_PICTURE_SIZE_IN_BYTES }),
      ),
    )
    file: Express.Multer.File | undefined,
  ) {
    return await this.wfs.editEvent(body, file);
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
  async deleteInterestedBy(@Query() body: InteractionDto, @Req() req) {
    console.log('Here');
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
  async deleteFavoritedBy(@Query() body: InteractionDto, @Req() req) {
    return await this.wfs.deletefromFavoritedByListOfEvent(body, req.user);
  }
}
