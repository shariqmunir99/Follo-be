import { Body, Controller, Injectable, Put, Req } from '@nestjs/common';
import { EditProfileDto } from 'src/app/dtos/user.dto';
import { UserWorkflows } from 'src/app/workflows/user.workflow';

@Injectable()
@Controller('user')
export class UserController {
  constructor(private readonly wfs: UserWorkflows) {}
  @Put('/edit')
  async editProfile(@Body() body: EditProfileDto, @Req() req) {
    return await this.wfs.editProfile(body, req.user);
  }
}
