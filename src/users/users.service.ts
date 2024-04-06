import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { JwtService } from '@nestjs/jwt';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { Response } from 'express';
import { LoginUserDto } from './dto/login_user.dto';
import { FindeUserDto } from './dto/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userRepo: typeof User,
    private readonly jwtService: JwtService,
  ) {}
  async getTokens(user: User) {
    const payload = {
      id: user.id,
      is_active: user.is_active,
      is_owner: user.is_owner,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN_KEY,
        expiresIn: process.env.ACCESS_TOKEN_TIME,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_KEY,
        expiresIn: process.env.REFRESH_TOKEN_TIME,
      }),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
  async registration(createUserDto: CreateUserDto, res: Response) {
    const user = await this.userRepo.findOne({
      where: {
        email: createUserDto.email,
      },
    });
    if (user) {
      throw new BadRequestException('This email is already registered');
    }
    if (createUserDto.password !== createUserDto.confirm_password) {
      throw new BadRequestException('Password  lar bir birga most emas');
    }

    const hashed_password = await bcrypt.hash(createUserDto.password, 7);
    const newUser = await this.userRepo.create({
      ...createUserDto,
      hashed_password,
    });
    const tokens = await this.getTokens(newUser);

    console.log('tokens ', tokens);

    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const activation_link = v4();

    console.log('activation link ', activation_link);

    const updateUser = await this.userRepo.update(
      { hashed_refresh_token, activation_link },
      {
        where: { id: newUser.id },
        returning: true,
      },
    );

    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    // 76___________________________________dars**************

    const response = {
      message: 'user registered ',
      user: updateUser[1][0],
      tokens,
    };
    return response;
  }
  async activate(link: string) {
    if (!link) {
      throw new BadRequestException('Activation link is required');
    }

    const updatedUser = await this.userRepo.update(
      { is_active: true },
      { where: { activation_link: link, is_active: false }, returning: true },
    );
    if (!updatedUser[1][0]) {
      throw new BadRequestException('User already activated');
    }
    const response = {
      message: 'User activated successfully',
      user: updatedUser[1][0].is_active,
    };

    return response;
  }

  async login(loginUserDto: LoginUserDto, res: Response) {
    const { email, password } = loginUserDto;
    const user = await this.userRepo.findOne({ where: { email } });

    if (!user) {
      throw new BadRequestException('user not found');
    }
    if (!user.is_active) {
      throw new BadRequestException('user it not activated');
    }
    const isMatchPass = await bcrypt.compare(password, user.hashed_password);
    if (!isMatchPass) {
      throw new BadRequestException('Password do not  match');
    }
    const tokens = await this.getTokens(user);
    console.log('tokens ', tokens);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updateUser = await this.userRepo.update(
      { hashed_refresh_token },
      {
        where: { id: user.id },
        returning: true,
      },
    );
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'User logged in',
      user: updateUser[1][0],
      tokens,
    };
    return response;
  }
  async logout(refreshToken: string, res: Response) {
    const userData = await this.jwtService.verify(refreshToken, {
      secret: process.env.REFRESH_TOKEN_KEY,
    });
    if (!userData) {
      throw new ForbiddenException('user not verifed');
    }

    const updateUser = await this.userRepo.update(
      {
        hashed_refresh_token: null,
      },
      {
        where: { id: userData.id },
        returning: true,
      },
    );
    res.clearCookie('refresh_token');
    const response = {
      message: 'user logged out successfully',
      user_refresh_token: updateUser[1][0].hashed_refresh_token,
    };
    return response;
  }

  async refreshToken(userId: number, refreshToken: string, res: Response) {
    const decodedToken = await this.jwtService.decode(refreshToken);

    if (userId !== decodedToken['id']) {
      throw new BadRequestException('Ruxsat etilamgan ');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });

    if (!user || !user.hashed_refresh_token) {
      throw new BadRequestException('user not found');
    }
    const tokenMatch = await bcrypt.compare(
      refreshToken,
      user.hashed_refresh_token,
    );

    if (!tokenMatch) {
      throw new ForbiddenException('Forbidden');
    }
    const tokens = await this.getTokens(user);
    console.log('tokens ', tokens);
    const hashed_refresh_token = await bcrypt.hash(tokens.refresh_token, 7);
    const updateUser = await this.userRepo.update(
      { hashed_refresh_token },
      {
        where: { id: user.id },
        returning: true,
      },
    );
    res.cookie('refresh_token', tokens.refresh_token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    const response = {
      message: 'User refreshed',
      user: updateUser[1][0],
      tokens,
    };
    return response;
  }
  // 77-dars bu yerda biz bilan shug'ullanadi;
  async findUser(findUserDto: FindeUserDto) {
    const where = {};
    if (findUserDto.full_name) {
      where['full_name'] = {
        [Op.like]: `%${findUserDto.full_name}%`,
      };
    }
    if (findUserDto.email) {
      where['email'] = {
        [Op.like]: `%${findUserDto.email}%`,
      };
    }
    if (findUserDto.phone) {
      where['phone'] = {
        [Op.like]: `%${findUserDto.phone}%`,
      };
    }
    if (findUserDto.tg_link) {
      where['tg_link'] = {
        [Op.like]: `%${findUserDto.tg_link}%`,
      };
    }
    console.log(where);
    const users = await this.userRepo.findAll({ where });
    if (users.length == 0) {
      throw new BadRequestException('user not  found');
    }

    return users;
  }

  // ***********************CRUD BU YERDA *****************************************************8
  findAll() {
    return this.userRepo.findAll();
  }

  async findOne(id: number) {
    const userData = await this.userRepo.findByPk(id);

    if (!userData) {
      throw new NotFoundException(`user type with ID ${id} not found`);
    }
    return userData;
  }

  async remove(id: number) {
    try {
      const affectedRows = await this.userRepo.destroy({
        where: { id },
      });
      if (affectedRows > 0) {
        return `user with ID ${id} was removed successfully.`;
      } else {
        return `user with ID ${id} not found.`;
      }
    } catch (error) {
      throw new Error(`Error removing user with ID ${id}: ${error.message}`);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const [numberOfAffectedRows, [updatedUser]] = await this.userRepo.update(
      updateUserDto,
      {
        where: { id },
        returning: true,
      },
    );
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`user with ID ${id} not found`);
    }
    return updatedUser;
  }
}
