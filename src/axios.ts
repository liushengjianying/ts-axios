import { AxiosInstance } from './types';
import Axios from './core/Axios';
import { extend } from './helpers/util';

function createInstance(): AxiosInstance {
    const context = new Axios();
    // Axios这个类中用到了this.这里绑定工厂函数中的实例对象
    const instance = Axios.prototype.request.bind(context);
    extend(instance, context);
    return instance as AxiosInstance
}

const axios = createInstance();

export default axios