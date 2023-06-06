import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { Inject } from '@nestjs/common';

export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super({
      clientID: process.env.CLIENTID,
      clientSecret: process.env.CLIENTSECRET,
      callbackURL: 'http://localhost:3001/api/auth/google/redirect',
      scope: ['profile', 'email'],
    });
  }
  async validate(profile: Profile): Promise<any> {
    const user = await this.authService.validateUser(
      profile.emails[0].value,
      profile.displayName,
    );

    return user || null;
  }
}
