import { Service } from "typedi";
import { getLogger } from "./logging";

@Service()
export default class Application {
  private readonly logger = getLogger(Application.name);

  constructor() {}

  async preStart() {
    this.logger.debug("[Prestart] Opps this app is empty!");
  }

  async start() {
    this.logger.info("Opps this app is empty!");
  }
}
