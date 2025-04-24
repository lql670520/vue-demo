<template>
  <div class="app-container">
    
    <iframe
      id="iframe"
      ref="iframe"
      class="iframe"
      src="/unity/index.html"
      width="100%"
      frameborder="0"
      scrolling="atuo"
    ></iframe>
    <el-button @click="() => click(1)">指令1</el-button>
    <el-button @click="() => click(2)">指令2</el-button>
    <el-button @click="() => click(3)">指令3</el-button>
    <el-button @click="() => click(4)">指令4</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  mounted() {},
  methods: {
    click(cmd) {
      const iwindow = this.$refs.iframe.contentWindow;
      iwindow && iwindow.SendCmd("command" + cmd);
    },
  },
};
</script>

<style scoped>
.app-container {
  height: calc(100vh - 84px);
  position: relative;
  background: grey;
}

.iframe {
  height: 320px;
  width: 200px;
  /* background: green; */
}
</style>
