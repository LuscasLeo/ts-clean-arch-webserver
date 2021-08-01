import { IsNumberString, IsOptional, IsString } from "class-validator";
import {
  Authorized,
  Body,
  Get,
  HttpError,
  JsonController,
  Param,
  Post,
  QueryParams,
  UseBefore,
} from "routing-controllers";
import { OpenAPI, ResponseSchema } from "routing-controllers-openapi";
import { Service } from "typedi";
import User, { AppRoles } from "../entity/User";
import { validateNumberStrings } from "../middlewares/validations";
import UsersService from "../services/users.service";

class CreateUserBody {
  @IsString()
  public readonly name: string;

  @IsString()
  public readonly password: string;
}

class ListUsersParams {
  @IsNumberString({ no_symbols: true })
  @IsOptional()
  take: string = "50";

  @IsOptional()
  @IsNumberString({ no_symbols: true })
  skip: string = "0";
}

class UserListResponse {
  users: User[];
}

@Service()
@JsonController("/users")
export default class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/")
  @OpenAPI({ summary: "Retorna a lista de usuários cadastrados." })
  @ResponseSchema(User, { isArray: true })
  async index(@QueryParams() { take, skip }: ListUsersParams) {
    return await this.usersService.listUsers(Number(take), Number(skip));
  }

  @Get("/:id")
  @UseBefore(validateNumberStrings(["id"], (r) => r.params))
  async read(@Param("id") id: string) {
    const user = this.usersService.getUserById(id);
    if (!user) throw new HttpError(404, "User not found!");

    return user;
  }

  @Post()
  @Authorized([AppRoles.ADMIN])
  async create(@Body() { name, password }: CreateUserBody) {
    {
      const user = await this.usersService.checkNameInUse(name);
      if (!!user) throw new HttpError(400, "User name already in use");
    }

    const user = this.usersService.createAndSaveUser({
      name,
      password,
      roles: [AppRoles.USER],
    });

    return user;
  }
}
