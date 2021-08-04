# Web Serv  ice Typescript

Esse é um boilerplate de um webservice inteiramente em Typescript seguindo algumas guidelines de clean architecture e orientação a controller, services e repositories.

## Development

Para uso em desenvolvimento é possível utilizar o comando abaixo para um teste em `live-reload` com `ts-node-dev`

```shell
yarn dev
```

## Build

O build da aplicação é através do comando `yarn build`. Os arquivos de build ficam localizados na pasta `dist`

## Check List

- Loggers
  - Winston
  - Morgan
- Middlewared de Autenticação
  - JWT
  - Users Roles
- Defaults
  - Criação de usuário `default`
- Banco de dados
  - Typeorm
    - Repositorios
    - Migrations
