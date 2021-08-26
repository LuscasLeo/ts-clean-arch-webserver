import express from "express";
import morgan from "morgan";
import { Service } from "typedi";
import { InjectRepository } from "typeorm-typedi-extensions";
import { AppRoles } from "./entity/User";
import { getLogger } from "./logging";
import UsersRepository from "./repositories/user.repository";
import { createServer } from "./server";
import { AuthenticationService } from "./services/authentication.service";
import ConfigurationService from "./services/configuration.service";

@Service()
export default class Application {
  private readonly logger = getLogger(Application.name);

  constructor(
    @InjectRepository() private readonly usersRepo: UsersRepository,
    private readonly configuration: ConfigurationService,
    private readonly authService: AuthenticationService
  ) {}

  async preStart() {
    const usersCount = await this.usersRepo.count();
    const { defaultUserName, defaultUserPassword } = this.configuration;

    if (usersCount == 0) {
      this.logger.info(`Creating default user '${defaultUserName}' `);

      const rootUser = this.usersRepo.create({
        name: defaultUserName,
        password: await this.authService.encrypt(defaultUserPassword),
        roles: [AppRoles.ADMIN],
      });

      await this.usersRepo.save(rootUser);
    }
  }

  async start() {
    const app = createServer(
      this.authService.authorizationChecker.bind(this.authService),
      this.authService.currentUserChecker.bind(this.authService)
    );

    app.use(express.json());
    app.use(morgan("common"));

    app.listen(this.configuration.appPort, () => {
      this.logger.info(`App listening on port ${this.configuration.appPort}`);
    });
  }
}
