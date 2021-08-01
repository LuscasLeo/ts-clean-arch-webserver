import { EntityRepository, Repository } from "typeorm";
import User from "../entity/User";

@EntityRepository(User)
export default class UsersRepository extends Repository<User> {
  async getUserById(userId: string | number) {
    return await this.findOne(userId);
  }
}
