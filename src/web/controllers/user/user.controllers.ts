import {
  Body,
  Controller,
  Delete,
  Get,
  Injectable,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { EditProfileDto, FollowDto } from 'src/app/dtos/user.dto';
import { UserWorkflows } from 'src/app/workflows/user.workflow';
import { Role } from 'src/domain/enum';
import { Roles } from 'src/web/filters/Decorators/roles.decorator';

@Injectable()
@Controller('api/user')
export class UserController {
  constructor(private readonly wfs: UserWorkflows) {}

  @Put('/edit')
  async editProfile(@Body() body: EditProfileDto, @Req() req) {
    return await this.wfs.editProfile(body, req.user);
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
  @Get('/organizer-dashboard')
  async organizerDashboard(@Req() req) {
    return await this.wfs.organizerDashboard(req.user);
  }

  @Delete('/delete')
  async deleteUser(@Req() req) {
    return await this.wfs.delete(req.user);
  }
}
