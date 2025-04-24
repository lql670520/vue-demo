<template>
  <div class="app-container">
    <div id="webgl"></div>
    <div class="remark"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
      const axeshelper = new THREE.AxesHelper(100);
      scene.add(axeshelper);

      const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
      const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
      });
      const mesh = new THREE.Mesh(boxGeometry, material);
      mesh.position.set(10, 10, 10);
      scene.add(mesh);

      const element = document.getElementById("webgl");
      // 创建一个相机
      const width = element.clientWidth;
      const height = element.clientHeight;
      const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 3000);
      camera.position.set(200, 200, 200);
      camera.lookAt(0, 0, 0);

      // 创建webgl渲染器
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);
      renderer.render(scene, camera);
      renderer.antialias = true; //锯齿模糊：是目标锯齿变成模糊
      renderer.setClearColor(0xe9e9e9, 1); //设置背景颜色

      element.appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.15; //默认0.05

      function render() {
        controls.update(); //监听鼠标拖拽，更新控制器状态,否否则无法有惯性效果
        renderer.render(scene, camera); //执行渲染操作
        requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
      }
      render();

      // 监听当前元素窗口变化
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          // console.log(`Size: Width = ${width}, Height = ${height}`);

          // 重置渲染器输出画布canvas尺寸
          renderer.setSize(width, height);
          // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
          camera.aspect = width / height;
          // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
          // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
          // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
          camera.updateProjectionMatrix();
        }
      });
      resizeObserver.observe(element);

      // 监听窗口变化
      // window.onresize = function () {
      //   const width = element.clientWidth;
      //   const height = element.clientHeight;
      //   // 重置渲染器输出画布canvas尺寸
      //   renderer.setSize(width, height);
      //   // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
      //   camera.aspect = width / height;
      //   // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
      //   // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
      //   // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
      //   camera.updateProjectionMatrix();
      // };
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
