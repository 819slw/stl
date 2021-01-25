/**
 *建立心跳基类
*/

export class Heart {


  constructor() {
    this.timeout = 5000
    this.HEART_TIMEOUT = null // 心跳计时器
    this.SERVER_HEART_TIMEOUT = null // 心跳计时器
  }

  // 重置
  reset() {
    clearTimeout(this.HEART_TIMEOUT)
    clearTimeout(this.SERVER_HEART_TIMEOUT)
    return this
  }

  /**
   * 启动心跳
  */
  start(cb) {
    this.HEART_TIMEOUT = setTimeout(() => {
      cb()
      this.SERVER_HEART_TIMEOUT = setTimeout(() => {
        cb()
        this.reset().start(cb())
      }, this.timeout)
    }, this.timeout)
  }
}