<template>
  <div class="app-container">
    <el-input v-model="textarea" type="textarea" />
    <el-button @click="start">录音</el-button>
    <el-button @click="say">说话</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      textarea: "",
      textareaLast: "",
      i: 0,
    };
    
  },
  mounted() {
    window.speechSynthesis.cancel();
    this.setText();
    this.init();
  },
  methods: {
    setText() {
      let text = `嗯，用户问的是用JavaScript怎么实现语音转文本。我需要根据提供的搜索结果来整理答案。首先，看看搜索结果的各个网页。

网页[1]、[2]、[3]、[4]、[5]都提到了使用Web Speech API，这是浏览器内置的API，应该是最直接的方法。网页[6]和[7]提到了其他工具，比如Vosk、Whisper，但这些可能需要后端或更多配置，可能不适合纯前端的情况。用户的问题可能更倾向于前端实现，所以重点放在Web Speech API上。

网页[1]详细介绍了如何检查浏览器支持，创建Recognition对象，设置事件监听，比如onresult来获取结果。网页[2]和[3]也提供了类似的步骤，比如检查支持、创建实例、设置语言、处理结果。网页[4]和[5]还提到了HTML和JavaScript的结合使用，比如按钮控制开始和停止录音。

需要注意不同网页提到的兼容性问题，比如Chrome和Firefox支持，其他浏览器可能不支持。另外，事件处理中的onresult和onerror需要正确处理，确保用户知道发生了什么。网页[1]还提到设置continuous为true可以让用户有更长的停顿时间，这可能对用户体验有帮助。

另外，网页[6]和[7]提到的工具如Whisper虽然强大，但可能需要后端服务或更多代码，可能超出用户当前的需求。所以答案应该以Web Speech API为主，简要提及其他工具作为扩展。`;

      if (text.length > 0 && this.i < text.length) {
        setTimeout(() => {
          this.textarea += text[this.i];
          this.i++;
          this.setText();
        }, 50);
      }
    },

    init() {
      let recognition 
      if ("webkitSpeechRecognition" in window) {
        recognition =  new webkitSpeechRecognition();
        recognition.lang = "zh-CN";
        recognition.continuous = true;

        recognition.onresult = function (event) {
          const transcript = event.results[event.resultIndex][0].transcript;
          console.log(transcript);
          // document.getElementById("result").innerText = transcript;
        };
      } else {
        console.log("浏览器不支持.");
      }

      this.recognition = recognition;
    },
    start() {
      this.recognition.start();
    },
    say() {
      this.textareaLast = this.textarea.substring(
        this.textareaLast.length,
        this.textarea.length - 1
      );
      if ("speechSynthesis" in window && this.textareaLast) {
        const utterance = new SpeechSynthesisUtterance(this.textareaLast);
        utterance.lang = "zh-CN"; // 设置语言为中文
        utterance.rate = 1; // 语速（1为正常）
        utterance.pitch = 1; // 音调（1为正常）
        utterance.onend = () => {
          this.say();
          console.log("Speech finished");
        };

        window.speechSynthesis.speak(utterance);
      } else {
        console.log("浏览器不支持Web Speech API");
      }
    },
  },
};
</script>

<style scoped lang="scss">
.app-container {
  height: calc(100vh - 84px);

  .item {
    margin-top: 10px;
  }
  /* position: relative; */
  /* background: grey; */
}
</style>
