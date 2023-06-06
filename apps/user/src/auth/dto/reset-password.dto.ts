import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiProperty({
    type: String,
    description: 'This is a required property',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly newPassword: string;
}
