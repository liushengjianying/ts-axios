import { ResolvedFn, RejectedFn } from "../types";

interface Interceptor<T> {
    resolved: ResolvedFn<T>
    rejected?: RejectedFn
}

export default class InterceptorManager<T> {
    private interceptors: Array<Interceptor<T> | null>

    constructor() {
        this.interceptors = [];
    }

    use(resolved: ResolvedFn<T>, rejected?: RejectedFn): number {
        this.interceptors.push({
            resolved,
            rejected
        })
        // 用来给eject删除拦截器用
        return this.interceptors.length - 1
    }

    forEach(fn: (interceptor: Interceptor<T>) => void): void {
        this.interceptors.forEach((interceptor) => {
            if (interceptor !== null) {
                fn(interceptor)
            }
        })
    }

    eject(id: number): void {
        if (this.interceptors[id]) {
            this.interceptors[id] = null;
        }
    }
}