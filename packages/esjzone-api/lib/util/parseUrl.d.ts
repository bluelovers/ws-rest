import { LazyURL } from 'lazy-url';
export declare function parseUrl<T extends string | number | URL | LazyURL>(input: T): {
    type: import("@node-novel/parse-input-url").EnumParseInputUrl.URL;
    _input: T & string;
    value: LazyURL;
} | {
    type: import("@node-novel/parse-input-url").EnumParseInputUrl.STRING;
    _input: T & string;
    value: string;
} | {
    type: import("@node-novel/parse-input-url").EnumParseInputUrl.URL;
    _input: (T & LazyURL) | (T & URL);
    value: LazyURL;
} | {
    type: import("@node-novel/parse-input-url").EnumParseInputUrl.URLSEARCHPARAMS;
    _input: (T & import("http-form-urlencoded").LazyURLSearchParams) | (T & URLSearchParams);
    value: import("http-form-urlencoded").LazyURLSearchParams;
} | {
    type: import("@node-novel/parse-input-url").EnumParseInputUrl.NUMBER;
    _input: T;
    value: string;
} | {
    type: import("@node-novel/parse-input-url").EnumParseInputUrl.UNKNOWN;
    _input: T;
    value: string;
};
