/**
 * 使用方法 import Socket from './websocket/ws'
 * this.wbSocket = new Socket(options)
 * this.wbSocket.onmessage((data) => {})
*/


import { Heart } from './heart.js'
import $config from '@/config';

export default class Socket extends Heart {
  constructor(ops) {
    super()

    this.RECONNECT_TIMER = null // 重连计时器

    this.RECONNECT_COUNT = 10 // 变量保存，防止丢失

    this.OPTIONS = {
      url: null, // 链接地址
      heartTime: 5000, // 心跳时间间隔
      heartMsg: 'ping', // 心跳信息，默认是‘ping’
      isReconnect: true, // 是否自动重连
      isRestory: true, // 是否销毁
      reconnectTime: 5000, // 重连时间间隔
      reconnectCount: 5, // 重连次数， -1则不限制
      openCb: null, // 链接成功回调
      closeCb: null, // 关闭的回调
      messageCb: null, // 消息的回调
      errorCb: null // 错误的回调
    }

    Object.assign(this.OPTIONS, ops)
    this.create()
  }

  // 建立链接
  create() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;
    if(!window.WebSocket) {
      new Error('当前浏览器不支持，无法使用')
      return;
    }
    if(!this.OPTIONS.url){
      new Error('链接地址不存在，无法建立ws通道')
    }
    delete this.ws
    this.ws = new WebSocket(`ws://${$config.WS_API()}${this.OPTIONS.url}`)
    this.onopen()
    this.onclose()
    this.onmessage()
  }

  // open事件
  /**
   * 自定义链接成功事件
   * 如果callback存在，调callback，不存在调用OPTIONS中的回调
   * @param {Function} callback
  */
  onopen (callback) {
    this.ws.onopen = () => {
      clearTimeout(this.RECONNECT_TIMER) // 清除重连定时器
      this.OPTIONS.reconnectCount = this.RECONNECT_COUNT // 计时器重置
      // 建立心跳机制
      super.reset().start(() => {
        this.send(this.OPTIONS.heartMsg)
      })
      if (typeof callback === 'function') {
        callback(event)
      } else {
        ( typeof this.OPTIONS.openCb === 'function' ) && this.OPTIONS.openCb(event)
      }
    }
  }

  /**
   * 自定义关闭事件
   * 如果callback存在，调callback，不存在调用OPTIONS中的回调
   * @param {Function} callback
  */

  onclose (callback) {
    this.ws.onclose = (event) => {
      super.reset()
      !this.OPTIONS.isRestory && this.onreconnect() // 如果不是正常销毁的通道，就立即重连
      if (typeof callback == 'function') {
        callback(event)
      } else {
        ( typeof this.OPTIONS.openCb === 'function' ) && this.OPTIONS.closeCb(event)
      }
    }
  }

  /**
   * 自定义错误事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
  */
  onerror (callback) {
    this.ws.onerror = (event) => {
      if (typeof callback === 'function') {
        callback(event)
      } else {
        (typeof this.OPTIONS.errorCb === 'function') && this.OPTIONS.errorCb(event)
      }
    }
  }

  /**
   * 自定义监听事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
  */
  onmessage (callback) {
    this.ws.onmessage = (event) => {
      // 收到任何消息，重新开始倒计时心跳检测
      super.reset().start(() => {
        this.send(this.OPTIONS.heartMsg)
      })
      if (typeof callback === 'function') {
        callback(event.data)
      } else {
        (typeof this.OPTIONS.messageCb === 'function') && this.OPTIONS.messageCb(event.data)
      }
    }
  }

  /**
   * 自定义发送消息事件
   * 如果callback存在，调用callback，不存在调用OPTIONS中的回调
   * @param {Function} callback 回调函数
  */
  send (data) {
    if (this.ws.readyState !== this.ws.OPEN) {
      new Error('没有连接到服务器，无法推送')
      return
    }
    this.ws.send(data)
  }

  /**
   * 链接事件
  */
  onreconnect () {
    if (this.OPTIONS.reconnectCount > 0 || this.OPTIONS.reconnectCount === -1) {
      this.RECONNECT_TIMER = setTimeout( () => {
        this.create()
        if (this.OPTIONS.reconnectCount !== -1) {
          this.OPTIONS.reconnectCount --
        }
      }, this.OPTIONS.reconnectTime)
    }  else { 
      clearTimeout(this.RECONNECT_TIMER)
      this.OPTIONS.reconnectCount = this.RECONNECT_COUNT
    }   
  }


  /**
   * 链接事件
  */
  destroy () {
    super.reset()
    clearTimeout(this.RECONNECT_TIMER) // 清除重连定时器
    this.OPTIONS.isRestory = true
    this.ws.close()
  }
}