import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginUserDto } from './dto/login_user.dto';
import { FindeUserDto } from './dto/find-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'register users' })
  @ApiResponse({
    status: 201,
    description: 'The signup created.',
  })
  @Post('signup')
  create(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.usersService.registration(createUserDto, res);
  }
// console.log('dadad);
  @Post('find')
  findUser(@Body() finduserDto: FindeUserDto) {
    return this.usersService.findUser(finduserDto);
  }

  @Get('activate/:link')
  activate(@Param('link') link: string) {
    return this.usersService.activate(link);
  }

  @ApiOperation({ summary: 'getALL users' })
  @ApiResponse({
    status: 200,
    description: 'get ALL users.',
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'get ById users' })
  @ApiResponse({
    status: 200,
    description: 'get byId user',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiOperation({ summary: 'patch  user' })
  @ApiResponse({
    status: 200,
    description: 'patch user',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'delete  user' })
  @ApiResponse({
    status: 200,
    description: 'delete user',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
