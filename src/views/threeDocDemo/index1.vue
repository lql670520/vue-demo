<template>
  <div class="app-container" v-loading="loading">
    <div id="webgl"></div>
    <div class="remark">
      备注：
      <ul style="margin-top: 10px">
        <li>
          <div>
            注意：如果使用OrbitControls必须配置摄像头位置或controls.target.set(0,
            0.5, 0)，不然不起作用;
          </div>
        </li>
        <li>
          <div>
            使用glb，在vue中必须吧文件放在public文件夹下，否则路径会错误。使用DRACOLoader解压gltf文件，请引用threejs下的jsm/libs/draco/gltf/;
          </div>
        </li>

        <li>
          <div>
            renderer.setAnimationLoop和requestAnimationFrame都能使场景动画起来
          </div>
        </li>
        <li>
          <div>RoomEnvironment 室内环境（在不使用的情况小没有灯光效果）</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export default {
  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const container = document.getElementById("webgl");
      const width = container.clientWidth;
      const height = container.clientHeight;

			const stats = new Stats();
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '20px';
      stats.domElement.style.top = '20px';

			container.appendChild( stats.dom );

      const clock = new THREE.Clock();
      const renderer = new THREE.WebGLRenderer({
        antialias: true, //抗锯齿
      });
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, width / height, 1, 100);
      const controls = new OrbitControls(camera, renderer.domElement);
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      const dracoLoader = new DRACOLoader();
      const loader = new GLTFLoader();
      let mixer;

      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);

      scene.background = new THREE.Color(0xbfe3dd);
      // 加载环境贴图
      scene.environment = pmremGenerator.fromScene(
        new RoomEnvironment(),
        0.04
      ).texture;

      camera.position.set(5, 2, 8);
      controls.enableDamping = true; //启用阻尼,必须在render中添加upudate

      dracoLoader.setDecoderPath("/3d/draco/");
      loader.setDRACOLoader(dracoLoader);
      this.loading = true;
      loader.load(
        "/3d/gltf/LittlestTokyo.glb",
         (gltf) =>{
          console.log(gltf);
          const model = gltf.scene;
          model.position.set(0, 0, 0);
          model.scale.set(0.01, 0.01, 0.01);
          scene.add(model);

          mixer = new THREE.AnimationMixer(model);
          mixer.clipAction(gltf.animations[0]).play();
          this.loading = false;
          renderer.setAnimationLoop(render);
        },
         (xhr)=> {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        function (error) {
          console.error(error);
        }
      );

      // 渲染循环
      function render() {
        const delta = clock.getDelta();
        mixer.update(delta); //动画混合器
        stats.update();
        controls.update();
        renderer.render(scene, camera);
      }
    },
  },
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
