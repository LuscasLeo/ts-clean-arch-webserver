import { Service } from "typedi";

class RequiredEnvironmentVariable extends Error {
  constructor(public readonly variableName: string) {
    super(`Missing required environment variable '${variableName}'`);
  }
}

class VariableTypeMismatch extends Error {
  constructor(
    public readonly variableName: string,
    public readonly value: string,
    public readonly expectedType: string
  ) {
    super(
      `Variable '${variableName}' expected to be of type '${expectedType}' [${value}]`
    );
  }
}

const getOrFail = (variableName: string) => {
  if (!(variableName in process.env))
    throw new RequiredEnvironmentVariable(variableName);

  return process.env[variableName];
};

const numberOrFail = (variableName: string) => {
  const val = getOrFail(variableName);

  if (isNaN(Number(val)))
    throw new VariableTypeMismatch(variableName, val, "number");

  return Number(val);
};

const booleanOrFail = (variableName: string) => {
  const val = getOrFail(variableName);
  return ["true", "1", "yes"].includes(val);
};

@Service()
export default class ConfigurationService {
  public readonly logLevel = getOrFail("LOG_LEVEL");
}
