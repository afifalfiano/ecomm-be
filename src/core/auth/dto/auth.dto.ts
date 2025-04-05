export class AuthPayloadDto {
  email: string;
  password: string;
}

export class AuthUserDto {
  name: string;
  email: string;
  sub: number; // id
  iat: number;
  exp: number;
}
