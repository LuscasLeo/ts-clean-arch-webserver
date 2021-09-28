export type Constructor<T> = { new (...args: any[]): T };

export type AsyncReturnType<T> = T extends () => PromiseLike<infer U> ? U : T