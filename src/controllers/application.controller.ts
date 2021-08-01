import { Get, JsonController } from "routing-controllers";
import { Service } from "typedi";

@Service()
@JsonController()
export default class ApplicationController {
  @Get()
  async index() {
    return {
      name: "Application API",
    };
  }
}
