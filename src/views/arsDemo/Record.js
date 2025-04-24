export default class Record {
  ws = null; //websocket
  uri = "wss://192.168.1.10:10095";
  //   conState = 0; //websocket状态 0未连接 1 已连接 2 已断开 3链接异常
  constructor(options) {
    if (options) {
      // this.uri = options.uri;
    }
  }

  // websocket打开;
  wsOpen() {
    if ("WebSocket" in window) {
      this.ws = new WebSocket(this.uri);
      this.ws.onopen = () => {
        this.log("websocket连接成功");
        // 发送json
        let request = {
          chunk_size: new Array(5, 10, 5), //表示流式模型latency配置`[5,10,5]`，表示当前音频解码片段为600ms，并且回看300ms，右看300ms。
          chunk_interval: 10, //音频间隔
          wav_name: "h5",
          is_speaking: true, //是否正在说话
          itn: true, //是否开启逆文本
          mode: "online", //`offline`表示推理模式为一句话识别；`online`表示推理模式为实时语音识别；`2pass`表示为实时语音识别，并且说话句尾采用离线模型进行纠错。
          //   hotwords: "", //  //热词文件，每行一个热词，格式(热词 权重)：阿里巴巴 20   JSON.stringify({"阿里巴巴":20,"hello world":40}),
        };

        //文音频文件识别，添加下面属性
        // request = {
        //   ...request,
        //   wav_format: "pcm",
        //   audio_fs: 16000, //文件采样率，要根据文件上传计算出来
        //   mode:"offline",//文件的话必须是离线识别
        // };

        this.wsSend(JSON.stringify(request)); //发送数据
      };

      this.ws.onclose = () => {
        this.log("websocket连接关闭");
      };

      this.ws.onerror = () => {
        this.log("websocket连接异常");
      };
    } else {
      this.log("您的浏览器不支持WebSocket");
    }
  }

  wsClose() {
    if (this.ws) {
      this.ws.close();
    }
  }
  wsSend(sendData) {
    // 0:表示还没建立连接, 1:已经建立连接，可以进行通讯, 2:通过关闭握手，正在关闭连接, 3:连接已经关闭或无法打开
    if (this.ws && this.ws.readyState == 1) {
      this.ws.send(sendData);
    }
  }

  log(msg, type) {
    console.log(msg);
  }

  
}
