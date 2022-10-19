export enum ResResult {
    Unauthorized = 401,
    NotFound = 404,
}

export type ResponseData<S, N, A> = {
    [key: string]: S | N | A;
};

export type ResponseArray = ResponseData<string, number, string[]>[];

export type Callback<T> = (data?: T | undefined) => void;
export type Opt = {
    [key: string]: string;
};

export type func = (data: ResponseArray, key: string) => ResponseArray | void;
export type OptMethods = {
    [key: string]: func;
};
