import {  AxiosRequestConfig, AxiosStatic } from './types';
import Axios from './core/Axios';
import { extend } from './helpers/util';
import defaults from './defaults';
import mergeConfig from './core/mergeConfig';

function createInstance(config: AxiosRequestConfig): AxiosStatic {
    const context = new Axios(config);
    // Axios这个类中用到了this.这里绑定工厂函数中的实例对象
    const instance = Axios.prototype.request.bind(context);
    extend(instance, context);
    return instance as AxiosStatic
}

const axios = createInstance(defaults);

axios.create = function create(config) {
    return createInstance(mergeConfig(defaults, config))
}

export default axios