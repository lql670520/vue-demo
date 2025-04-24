<template>
  <div class="app-container">
    <div id="webgl"></div>
  </div>
</template>

<script>
import * as THREE from "three";

export default {
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      console.log(THREE);

      const element = document.querySelector("#webgl");
      const width = element.clientWidth;
      const height = element.clientHeight;

      // 创建一个场景
      const scene = new THREE.Scene();

      // 创建一个几何体
      const geometry = new THREE.BoxGeometry(50, 50, 50);

      // 创建材质
      const material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.5,
      });

      // 创建一个物体
      const mesh = new THREE.Mesh(geometry, material);
      // 设置物体在场景中的位置
      mesh.position.set(0, 10, 10);

      // 将物体添加到场景中
      scene.add(mesh);

      // 创建相机
      const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 2000);

      // 设置相机的位置
      camera.position.set(200, 200, 200);
      // 设置相机聚焦的位置
      camera.lookAt(0, 0, 0);

      // 创建渲染器
      const renderer = new THREE.WebGLRenderer();
      // 设置大小
      renderer.setSize(width, height);
      renderer.render(scene, camera);

      element.appendChild(renderer.domElement);
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
</style>
