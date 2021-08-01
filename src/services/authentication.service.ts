import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Action, HttpError } from "routing-controllers";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import UsersRepository from "../repositories/user.repository";
import ConfigurationService from "./configuration.service";

const AUTH_HEADER = "authorization";

export interface UserAuthData extends JwtPayload {
  userId: number;
}

@Service()
export class AuthenticationService {
  constructor(
    @InjectRepository() private readonly usersRepo: UsersRepository,
    private readonly config: ConfigurationService
  ) {}

  async currentUserChecker(action: Action) {
    if (!(AUTH_HEADER in action.request.headers))
      throw new Error("No Authorization token");
    const token = action.request.headers[AUTH_HEADER];

    const decoded = await this.decodeToken(token);

    return await this.usersRepo.getUserById(decoded.userId);
    // return await getConnection()
    //   .getRepository(User)
    //   .findOne({ id: decoded.userId });
  }

  async authorizationChecker(action: Action, roles: any[]) {
    if (!(AUTH_HEADER in action.request.headers))
      throw new HttpError(401, "No authorization token provided");

    const token = action.request.headers[AUTH_HEADER];

    const decoded = await this.decodeToken(token);

    const user = await this.usersRepo.getUserById(decoded.userId);

    if (!user) throw new HttpError(401, "Invalid token (user not found)");

    return roles.every((role) => user.roles.includes(role));
  }

  encodeAuth(authData: UserAuthData): string {
    return jwt.sign(authData, this.config.jwtSecret);
  }

  async decodeToken(token: string): Promise<UserAuthData> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.config.jwtSecret, (error, decoded) => {
        if (error) reject(error);
        else resolve(decoded as UserAuthData);
      });
    });
  }

  async encrypt(val: string) {
    return await bcrypt.hash(val, 8);
  }

  async compare(val: string, encryptedVal: string) {
    return await bcrypt.compare(val, encryptedVal);
  }
}
