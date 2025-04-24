<template>
  <div class="app-container">
    <div id="ar-div"></div>
  </div>
</template>

<script>
import har from "./har.min.js";
export default {
  data() {
    return {};
  },
  mounted() {
    window.control = har.ARWebControl.getInstance();
    control
      .setup({
        domId: "ar-div", //鹰眼画面的盒子
        loginType: 0,
        ip: "192.168.1.199", //AR鹰眼平台IP(海康提供的)
        port: "443", //AR鹰眼平台端口(海康提供的)
        userName: "admin", //平台用户名(海康提供的)
        credentials: "Abc456++", //平台密码(海康提供的)
        domainId: "0", //网域id
        arIndexCode: "", //AR高点编号就是用于播放鹰眼视频的id(拉好鹰眼专线后才能确定)
        websocketPort: "8888", //控件WS端口
        visible: true, //控制鹰眼窗口是否可见
        processName: "chrome", //默认浏览器
      })
      .then(() => {
        // this.isShow = true;
        // alert("控件启动成功")
      })
      .catch((err) => {
        // console.error(err.msg);
        // alert("AR控件启动失败");
      });
  },
  destroyed() {
    window.control &&
      window.control
        .close()
        .then(() => {
          console.log("关闭控件");
        })
        .catch((err) => {
          console.error(err.msg);
        });
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 84px);
  // position: relative;

  #ar-div {
    flex: 1;
    width: 100%;
    height: 100%;
    background: red;
  }
}
</style>
