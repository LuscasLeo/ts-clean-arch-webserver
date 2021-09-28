import * as routingControllers from "routing-controllers";
import * as typeDI from "typedi";
import * as typeorm from "typeorm";
import * as typeormTypediExtensions from "typeorm-typedi-extensions";

export const initDI = () => {
  typeorm.useContainer(typeormTypediExtensions.Container);
  routingControllers.useContainer(typeDI.Container);
};
