/**
 * Created by user on 2019/6/10.
 */
export declare function parseRouterVars(url: string): string[];
export declare function expand<K extends keyof M = never, M = Record<string, unknown>>(url: string, data: M): {
    paths: Pick<M, K>;
    data: Omit<M, K>;
    router: string;
    url: string;
};
export default parseRouterVars;
