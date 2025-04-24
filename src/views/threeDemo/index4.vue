<template>
  <div class="app-container">
    <div id="webgl"></div>
    <div class="remark">
      备注：
      <ul style="margin-top: 10px">
        <li>
          <div>MeshStandardMaterial必须带有阴影材质</div>
        </li>
        <li>
          <div>投影效果要开启：</div>
          <div>renderer.shadowMap.enabled = true; //渲染器开启阴影</div>
          <div>spotLight.castShadow = true; //灯光投射阴影</div>
          <div>sphereMesh.castShadow = true; //物体投射阴影</div>
          <div>plane.receiveShadow = true;//面板开启接收投影</div>
        </li>
      </ul>
    </div>
    <div style="margin-top: 30px">
      可以切换平行光、点光源进行切换看看，这个两个也是有阴影效果，而环境光没有效果，因为是全局
    </div>
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

      const sphereGeometry = new THREE.SphereGeometry(3, 20, 20);
      const material = new THREE.MeshStandardMaterial({
        color: 0xff0000,
      });
      const sphereMesh = new THREE.Mesh(sphereGeometry, material);
      sphereMesh.position.set(10, 10, 10);
      sphereMesh.castShadow = true; //投射阴影
      scene.add(sphereMesh);

      const planeGeometry = new THREE.PlaneGeometry(100, 100);
      const planeMterial = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide, //打开双面
      });
      const plane = new THREE.Mesh(planeGeometry, planeMterial);
      plane.position.set(0, -10, 0);
      plane.rotation.x = -Math.PI / 2;
      plane.receiveShadow = true; //接手阴影
      scene.add(plane);

      // 环境灯光
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      // 平行光
      // const spotLight = new THREE.DirectionalLight(0xffffff);
      // 点源光
      // const spotLight = new THREE.PointLight(0xffffff, 5000);

      // 聚光灯
      const spotLight = new THREE.SpotLight(0xffffff, 10000);
      spotLight.position.set(0, 30, 30);
      spotLight.target = sphereMesh;
      spotLight.castShadow = true; //投射阴影
      spotLight.shadow.radius = 20; //设置阴影的模糊度
      spotLight.shadow.mapSize.set(1024, 1024); //shedow.mapSize设置阴影贴图的分辨率
      spotLight.angle = Math.PI / 6; //设置聚光灯的角度
      spotLight.distance = 0; //设置聚光灯的距离
      spotLight.penumbra = 0; //设置聚光灯的边缘
      // spotLight.decay = 0;
      scene.add(spotLight);

      const helper = new THREE.SpotLightHelper(spotLight);
      scene.add(helper);

      // 创建一个相机
      const width = 400;
      const height = 300;
      const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 3000);
      camera.position.set(200, 200, 200);
      camera.lookAt(0, 0, 0);

      // 添加辅助坐标轴
      const axeshelper = new THREE.AxesHelper(100);
      scene.add(axeshelper);
      // 创建webgl渲染器
      const renderer = new THREE.WebGLRenderer();
      renderer.shadowMap.enabled = true; //开启阴影
      renderer.setSize(width, height);
      renderer.render(scene, camera);
      document.getElementById("webgl").appendChild(renderer.domElement);
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.addEventListener("change", function () {
        renderer.render(scene, camera);
      });
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
