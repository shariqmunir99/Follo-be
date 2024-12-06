import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Injectable,
  ParseFilePipeBuilder,
  Post,
  Put,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EditProfileDto, FollowDto, VerifyDto } from 'src/app/dtos/user.dto';
import {
  CustomUploadFileTypeValidator,
  MAX_PROFILE_PICTURE_SIZE_IN_BYTES,
  VALID_UPLOADS_MIME_TYPES,
} from 'src/app/validators/file.valdator';
import { UserWorkflows } from 'src/app/workflows/user.workflow';
import { Role } from 'src/domain/enum';
import { Roles } from 'src/web/filters/Decorators/roles.decorator';

@Injectable()
@Controller('api/user')
export class UserController {
  constructor(private readonly wfs: UserWorkflows) {}

  @Put('/edit')
  @UseInterceptors(FileInterceptor('file'))
  async editProfile(
    @Body() body: EditProfileDto,
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
    return await this.wfs.editProfile(body, req.user, file);
  }

  @Get('/details')
  async getProfile(@Req() req) {
    return await this.wfs.getProfile(req.user);
  }

  @Roles(Role.User)
  @Post('/follow')
  async addFollow(@Body() body: FollowDto, @Req() req) {
    return await this.wfs.addFollow(body, req.user);
  }

  @Roles(Role.User)
  @Delete('/follow')
  async deleteFollow(@Body() body: FollowDto, @Req() req) {
    return await this.wfs.removeFollow(body, req.user);
  }

  @Roles(Role.User)
  @Get('/interested-events')
  async fetchInterestedEvents(@Req() req) {
    return await this.wfs.fetchInterestedEvents(req.user);
  }

  @Roles(Role.User)
  @Get('/favorited-events')
  async fetchFavoritedEvents(@Req() req) {
    return await this.wfs.fetchFavoritedEvents(req.user);
  }

  @Roles(Role.Organizer)
  @Get('/dashboard')
  async organizerDashboard(@Req() req) {
    return await this.wfs.organizerDashboard(req.user);
  }

  @Delete('/delete')
  async deleteUser(@Req() req) {
    return await this.wfs.delete(req.user);
  }

  @Post('/verify')
  async verifyAccount(@Body() body: VerifyDto, @Req() req) {
    return await this.wfs.verifyAccount(body, req.user);
  }
}
