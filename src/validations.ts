import { plainToClass } from "class-transformer";
import { ValidationError, Validator } from "class-validator";
import { Request, RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { HttpError } from "./types";

export type Constructor<T> = { new (): T };

export class ValidationErrorSet {
  constructor(public readonly errors: ValidationError[]) {}
}

export function validateBody<T extends object>(type: Constructor<T>): RequestHandler {
  return validateMiddleware((req) => validate(req.body, type));
}

export function validateNumberStrings(params: string[]): RequestHandler {
  return (req, res, next) => {
    if (params.every((val) => !isNaN(Number(req.params[val])))) {
      next();
    } else {
      next(new HttpError(400, `Params must be number! [${params.join(", ")}]`));
    }
  };
}

function validateMiddleware(errorsGetter: (req: Request) => ValidationError[]): RequestHandler {
  return (req, res, next) => {
    const errors = errorsGetter(req);
    if (errors.length > 0) {
      next(new ValidationErrorSet(errors));
    } else {
      next();
    }
  };
}

function validate<T extends object, J extends T>(data: J, type: Constructor<T>) {
  const validator = new Validator();
  const input = plainToClass(type, data);

  return validator.validateSync(input);
}
