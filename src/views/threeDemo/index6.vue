<template>
  <div class="app-container">
    <div id="webgl"></div>
    <div class="remark">
      备注：
      <ul style="margin-top: 10px">
        <li>
          <div>在左上角上查看帧监听</div>
        </li>
        <li>
          <div>用1000、10000、1000000个进行测试</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";

export default {
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      // 创建一个场景
      const scene = new THREE.Scene();

      // const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
      // const material = new THREE.MeshBasicMaterial({
      //   color: 0xff0000,
      // });
      // const mesh = new THREE.Mesh(boxGeometry, material);
      // mesh.position.set(10, 10, 10);
      // scene.add(mesh);

      // 随机创建大量的模型,测试渲染性能
      const num = 10000; //控制长方体模型数量
      for (let i = 0; i < num; i++) {
        const geometry = new THREE.BoxGeometry(5, 5, 5);
        const material = new THREE.MeshBasicMaterial({
          color: 0x00ffff,
        });
        const mesh = new THREE.Mesh(geometry, material);
        // 随机生成长方体xyz坐标
        const x = (Math.random() - 0.5) * 200;
        const y = (Math.random() - 0.5) * 200;
        const z = (Math.random() - 0.5) * 200;
        mesh.position.set(x, y, z);
        scene.add(mesh); // 模型对象插入场景中
      }

      // 创建一个相机
      const width = 400;
      const height = 300;
      const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 3000);
      camera.position.set(200, 200, 200);
      camera.lookAt(0, 0, 0);

      // 创建webgl渲染器
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);
      renderer.render(scene, camera);
      document.getElementById("webgl").appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);

      // 创建一个性能插件
      const stats = new Stats();
      document.getElementById("webgl").appendChild(stats.domElement);

      function render() {
        //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
        stats.update();
        renderer.render(scene, camera); //执行渲染操作
        requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
      }
      render();
    },
  },
};
</script>

<style scoped>
#webgl {
  width: 400px;
  height: 300px;
  margin: 0 auto;
  border: 1px solid #ccc;
}

.remark {
  margin-top: 30px;
  color: red;
}
</style>
