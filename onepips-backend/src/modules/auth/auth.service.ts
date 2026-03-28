import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(credentials: any) {
    return { accessToken: 'dummy-token' };
  }

  async register(data: any) {
    return { id: 'dummy-id', ...data };
  }
}
