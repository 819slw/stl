import Socket from "@/util/websocket/ws"

export const socketMinxin = {
    data(){
        return {
            wbSocket: null,
            socketData: null
        }
    },
    methods: {
        initSocket(url){ // ?token=e1d1d1d1d12d12&userId=111&homeworkId=8&questionType=4&flag=0
            if(this.wbSocket) this.wbSocket.destroy()
            this.wbSocket = new Socket({url: url}) // userId  homeworkId
            this.wbSocket.onmessage((data) => {
              if(data !== 'ping'){
                let res = JSON.parse(data)
                console.log(res.sponsor)
                if (!res.sponsor) return
                if (Object.keys(res).indexOf('To') > -1) { // 某一个题目答案推送
                    this.socketData = res
                }
              }
            })
          }
    }
}