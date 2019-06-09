
import { CancelExecutor, Canceler, CancelTokenSource } from '../types'

import Cancel from './cancel'

interface ResolvePromise {
  (reason?: Cancel): void
}

export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel

  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<Cancel>(resolve => {
      resolvePromise = resolve
    })

    // 初始化就运行该函数，那么当运行内部的message函数时候，promise就可以是resolve状态了
        executor(message => {
            // 如果已经有值，就返回，防止多次调用
            if (this.reason) {
                return
            }
            this.reason = new Cancel(message);
            // 将promise从pending状态改为resolve状态
            resolvePromise(this.reason)
        })
  }

  throwIfRequested(): void {
    if (this.reason) {
      throw this.reason
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}
