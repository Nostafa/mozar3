import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiTags('Findall users')
  @Get('users')
  async findall() {
    return this.userService.findAll();
  }
}
