import { IsDefined, IsEmail, IsNumberString, IsString } from 'class-validator';

export class SignUpDto {
  @IsString()
  @IsDefined()
  username: string;

  @IsNumberString()
  @IsDefined()
  phoneNumber: number;

  @IsEmail()
  @IsDefined()
  email: string;

  @IsString()
  @IsDefined()
  password: string;
}
