import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User } from '../user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signup.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { username, email, password, phoneNumber } = signUpDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { email, password } = loginDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ token: string }> {
    const { email, password, newPassword } = resetPasswordDto;

    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { password: hashedPassword },
    );
    const token = this.jwtService.sign({ id: user._id });

    return { token };
  }
  async findUser(id: number) {
    const user = await this.userModel.findById({ id });
    return user;
  }

  // ********************OAuth method************************
  async validateUser(email: string, username: string): Promise<User> {
    const user = await this.userModel.findOne({
      email,
      username,
    });

    if (user) return user;
    const newUser = await this.userModel.create({ email, username });
    return newUser.save();
  }
}
