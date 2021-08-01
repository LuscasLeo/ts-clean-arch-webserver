import { IsString, MinLength } from "class-validator";
import { Body, HttpError, JsonController, Post } from "routing-controllers";
import { Service } from "typedi";
import { AuthenticationService } from "../services/authentication.service";
import UsersService from "../services/users.service";

class SignInPayload {
    
  @IsString()
  @MinLength(1, {message: "username required"})
  username: string;
  
  @IsString()
  @MinLength(1, {message: "password required"})
  password: string;
}

@Service()
@JsonController("/login")
export default class SessionController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthenticationService
  ) {}

  @Post()
  async signIn(@Body() { username, password }: SignInPayload) {
    const user = await this.usersService.getUserByName(username);

    if (!user) throw new HttpError(401, "Incorrect username");
    const compared = await this.authService.compare(password, user.password);

    if (!compared) {
      throw new HttpError(401, "Incorrect credentials!");
    }

    const token = this.authService.encodeAuth({
      userId: user.id,
    });

    return {
      token,
    };
  }
}
