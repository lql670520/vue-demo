<template>
  <div class="app-container">
    <el-card>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item label="asr服务器地址" prop="asrIp">
          <el-input v-model="ruleForm.asrIp"></el-input>
        </el-form-item>

        <el-form-item label="录音模式" prop="isFileMode">
          <el-radio-group v-model="ruleForm.isFileMode">
            <el-radio label="麦克风" value="1"></el-radio>
            <el-radio label="文件" value="2"></el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="活动形式" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >立即创建</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item> -->
      </el-form>
      <!-- <div class="item">asr服务器地址(必填)</div>
      <div class="item">
        <el-input v-model="asrIp"></el-input>
        <input type="file" id="upfile" @change="fileChange" />
      </div>

      <div class="item">选择录音模式</div>
      <div class="item">
        <el-radio-group v-model="isFileMode">
          <el-radio label="录音模式"></el-radio>
          <el-radio label="文件模式"></el-radio>
        </el-radio-group>
      </div>-->
      <div class="item">
        <el-button type="primary" @click="wsOpen">链接</el-button>
        <el-button type="primary">开始</el-button>
        <el-button type="primary" @click="wsClose">停止</el-button>
      </div> 
    </el-card>
    <el-card style="margin-top: 20px">
      <div class="item">语音识别结果显示</div>
      <div class="item">
        <el-input
          type="textarea"
          :rows="10"
          placeholder=""
          v-model="textarea"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
// import "./recorder-core.js";
// import "./wav.js";
// import "./pcm.js";

import Record from "./Record";

export default {
  data() {
    return {
      ruleForm: {
        asrIp: "wss://192.168.1.10:10095",
        isFileMode: "1",
      },
      rules: {
        asrIp: [{ required: true, message: "请输入服务", trigger: "blur" }],
        isFileMode: [
          { required: true, message: "请选择录音模式", trigger: "change" },
        ],
      },
      record: null,

      isFileMode: false,
      textarea: "",
    };
  },
  mounted() {
    this.record = new Record();
    // var upfile = ;
    // console.log(upfile);
  },
  methods: {
    // webSokent 连接
    wsOpen() {
      this.record && this.record.wsOpen({ uri: this.asrIp });
    },
    wsClose() {
      this.record && this.record.wsClose();
    },
    fileChange(f) {
      console.log(
        f.target.files,
        "fileChange",
        document.getElementById("upfile")
      );
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
