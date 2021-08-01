import { Service } from "typedi";
import { DeepPartial, ILike } from "typeorm";
import { InjectRepository } from "typeorm-typedi-extensions";
import User, { AppRoles } from "../entity/User";
import UsersRepository from "../repositories/user.repository";
import { AuthenticationService } from "./authentication.service";

@Service()
export default class UsersService {
  constructor(
    @InjectRepository() private readonly usersRepo: UsersRepository,
    private readonly authService: AuthenticationService
  ) {}

  async createAndSaveUser({ name, password, roles }: DeepPartial<User>) {
    const passwordHash = await this.authService.encrypt(password);

    const user = this.usersRepo.create({
      name,
      password: passwordHash,
      roles: roles || [AppRoles.USER],
    });

    return await this.usersRepo.save(user);
  }

  async listUsers(take: number, skip: number) {
    return await this.usersRepo.find({ take, skip });
  }

  async getUserById(id: string | number) {
    return await this.usersRepo.findOne(id);
  }
  async checkNameInUse(name: string) {
    return (await this.usersRepo.count({ where: { name } })) > 0;
  }
  async getUserByName(name: string) {
    return await this.usersRepo.findOne({ name: ILike(name) });
  }
}
