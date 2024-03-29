# Web Service Typescript

Esse é um boilerplate de um webservice inteiramente em Typescript seguindo algumas guidelines de clean architecture e orientação a controller, services e repositories.

## Quick start

```sh
# Instalação dos pacotes
yarn 

# Setup de variaveis ambientes [desenvolvimento]
cp .env.example .env.dev 

# IMPORTANTE: Inicie ou configure um banco de dados Postgres para conectar-se a aplicação

# Cria estrutura no banco de dados
yarn typeorm migration:run

# Iniciar aplicação em desenvolvimento (ou também usar o debugger do VSCode [f5])
yarn dev 
```

## Development

Para uso em desenvolvimento é possível utilizar o comando abaixo para um teste em `live-reload` com `ts-node-dev`

```shell
yarn dev
```

## Build

O build da aplicação é através do comando `yarn build`. Os arquivos de build ficam localizados na pasta `dist`

## Check List

- Loggers
  - [Winston](https://www.npmjs.com/package/winston)
    - [Daily Logs](winston-daily-rotate-file)
  - [Morgan](https://www.npmjs.com/package/morgan)
- Middlewared de Autenticação
  - [JWT](https://www.npmjs.com/package/jsonwebtoken)
  - Users Roles
- Defaults
  - Criação de usuário `default`
- Banco de dados
  - [Typeorm](https://www.npmjs.com/package/typeorm)
    - Repositorios
    - Migrations
- Documentação
  - [OpenAPI](https://www.npmjs.com/package/routing-controllers-openapi) com [Swagger](https://www.npmjs.com/package/swagger-ui-express)
- Dependency Injection
  - [TypeDI](https://www.npmjs.com/package/typedi)
  - [routing-controllers](https://www.npmjs.com/package/routing-controllers)

## Project structure

```sh
Project root
├── Dockerfile
├── README.md
├── logs
│   ├── 2021-08-01.log
│   ├── 2021-08-02.log
│   └── 2021-08-04.log
├── ormconfig.js
├── package.json
├── queries.sql
├── requests.rest
├── dist
├── src
│   ├── app.ts
│   ├── controllers
│   │   ├── application.controller.ts
│   │   ├── session.controller.ts
│   │   └── users.controller.ts
│   ├── database
│   │   ├── entities.ts
│   │   └── index.ts
│   ├── entity
│   │   └── User.ts
│   ├── index.ts
│   ├── logging.ts
│   ├── middlewares
│   │   └── validations.ts
│   ├── repositories
│   │   └── user.repository.ts
│   ├── server
│   │   ├── controllers.ts
│   │   └── index.ts
│   ├── services
│   │   ├── authentication.service.ts
│   │   ├── configuration.service.ts
│   │   └── users.service.ts
│   └── types.ts
├── tsconfig.json
├── yarn-error.log
└── yarn.lock
```

## Addons

- [Rest Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - Crie arquivos `.rest` para teste de rotas http e teste ali mesmo.

## Utilidade

### Debugar  arquivos de `Services` isoladamente

- Em ambiente de desenvolvimento, é possivel executar um unico arquivo typescript de service com poucas linhas. Exemplo:

```ts
import Container, { Inject, Service } from "typedi";
import { initDI } from "../utils";
import ConfigurationService from "./configuration.service";

@Service()
export default class TesteService {
  @Inject()
  private readonly confiurationService: ConfigurationService;

  async aguarde(milissegundos: number) {
    await new Promise((resolve) =>
      setTimeout(() => resolve(null), milissegundos)
    );
  }

  async digaOla() {
    console.log("Aguarde!");
    await this.aguarde(5 * 1000);
    console.log("Olá mundo!");
    console.log(
      `[TESTE DE INJEÇÃO DE DEPENDENCIA] Usuário padrão do sistema: ${this.confiurationService.defaultUserName}`
    );
  }
}

/**
 * Linhas dedicatas a uso e execução isolada
 */
if (require.main == module) {
  async function teste() {
    /** Inicia a ferramente de Injeção de dependencias */
    initDI();

    /** Extrai o serviço diretamente do sistema de DI */
    const service = Container.get(TesteService);

    await service.digaOla();
  }

  /** Chama a função de teste. */
  teste().catch((error) => console.error(error));
}

```
