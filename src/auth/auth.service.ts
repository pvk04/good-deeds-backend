import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<string> {
    const user = await this.userService.findOneByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { password, ...user };
      return this.jwtService.sign(payload);
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
