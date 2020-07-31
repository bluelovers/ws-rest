import { AxiosRequestConfig, AxiosInstance } from './types';
export declare function mixinDefaultConfig<T extends AxiosRequestConfig>(config: T, axios?: AxiosInstance, ...defaultOptions: AxiosRequestConfig[]): AxiosRequestConfig;
export default mixinDefaultConfig;
