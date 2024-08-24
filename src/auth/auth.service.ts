import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<{ user: Omit<User, 'password'>; accessToken: string }> {
    const user = await this.userService.findOneByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      const payload = { id: user.id };

      return { user: user, accessToken: this.jwtService.sign(payload) };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(username: string, email: string, password: string) {
    const user = await this.userService.create(username, email, password);
    const payload = { ...user };

    return { user, accessToken: this.jwtService.sign(payload) };
  }
}
