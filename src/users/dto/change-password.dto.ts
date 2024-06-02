import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  // @MinLength(8)
  // @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'Password must contain at least one uppercase letter, one lowercase letter, one number or special character',
  // })
  newPassword: string;

  @IsString()
  // @MinLength(8)
  // @MaxLength(20)
  currentPassword: string;
}