<template>
  <div class="app-container">
    <div id="webgl"></div>
    <div class="remark">
      备注：
      <ul style="margin-top: 10px">
        <li>
          <div>texLoader.load 引入方式require("@/assets/demoImages/1.jpg")</div>
        </li>
        <li>
          <div>
            注意最新版本，webgl渲染器默认编码方式已经改变，为了避免色差，纹理对象编码方式要修改为
            texture.colorSpace = THREE.SRGBColorSpace;//设置为SRGB颜色空间
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function load3D() {
  const container = document.getElementById("webgl");
  const width = container.clientWidth;
  const height = container.clientHeight;

  let scene, camera, renderer;
  let stats;

  function init() {
    // 场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0);
    scene.fog = new THREE.Fog(0xffeeff, 10, 50);

    // 相机
    camera = new THREE.PerspectiveCamera(45, width / height, 1, 100);
    camera.position.set(1, 1, 1);
    camera.lookAt(0, 0, 0);

    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // 性能插件监测
    stats = new Stats();
    stats.domElement.style.position = "absolute";
    stats.domElement.style.left = "20px";
    stats.domElement.style.top = "20px";
    container.appendChild(stats.dom);

    render();
  }

  // 渲染
  function render() {
    stats.update()
    renderer.render(scene, camera);
  }

  init();
}

export default {
  data() {
    return {};
  },
  mounted() {
    load3D();
  },
  methods: {},
};
</script>

<style scoped>
.app-container {
  height: calc(100vh - 84px);
  position: relative;
}

#webgl {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  border: 1px solid #ccc;
}

.remark {
  position: absolute;
  color: red;
  bottom: 20px;
  left: 40px;
}
</style>
