import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNumberString, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  @IsDefined()
  username: string;

  @ApiProperty({
    type: Number,
    description: 'This is a required property',
  })
  @IsNumberString()
  @IsDefined()
  phoneNumber: number;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsEmail()
  @IsDefined()
  email: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsString()
  @IsDefined()
  password: string;
}
