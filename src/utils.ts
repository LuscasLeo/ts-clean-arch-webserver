import * as typeorm from "typeorm";
import * as typeormTypediExtensions from "typeorm-typedi-extensions";

export const initDI = () => {
  typeorm.useContainer(typeormTypediExtensions.Container);
};
