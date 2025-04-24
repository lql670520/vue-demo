<template>
  <div class="app-container">
    <div id="webgl"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
// import {GUI} from "three/examples/jsm/libs/";
import { GUI } from "lil-gui";

export default {
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const element = document.getElementById("webgl");
      const width = element.clientWidth;
      const height = element.clientHeight;

      //场景
      const scene = new THREE.Scene();
      //相机
      const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
      camera.position.set(-10, 20, 10);
      camera.lookAt(0, 0, 0);

      // 盒子
      const geometryObj = {
        color: 0xf0fff0,
        specular: 0x222222,
      };
      const geometry = new THREE.SphereGeometry(1, 20, 20);
      const material = new THREE.MeshPhongMaterial(geometryObj);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true; //物体投影
      scene.add(mesh); //模型对象添加到场景中

      // 地板
      const planeGeometry = new THREE.PlaneGeometry(100, 100);
      const planeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = Math.PI / 2;
      plane.position.y = -1;
      plane.receiveShadow = true; //接受投影
      scene.add(plane);

      //光源设置
      const spotLight = new THREE.SpotLight(0xffffff, 1);
      spotLight.position.set(5, 5, 5);
      spotLight.target = mesh;
      spotLight.intensity = 2; //设置光照强度
      spotLight.shadow.radius = 20; //设置阴影的模糊度
      spotLight.angle = Math.PI / 6; //设置聚光灯的角度
      spotLight.distance = 0; //设置聚光灯的距离
      spotLight.penumbra = 0; //设置聚光灯的边缘
      spotLight.decay = 0; //设置聚光灯的衰减
      spotLight.castShadow = true; //物体投影
      spotLight.shadow.mapSize.set(1024, 1024); //设置阴影贴图的分辨率

      scene.add(spotLight);

      // 环境光
      const ambient = new THREE.AmbientLight(0xffffff, 1);
      scene.add(ambient);

      //=========================================================================//

      const gui = new GUI(); //创建GUI对象
      gui.domElement.style.position = "absolute";
      gui.domElement.style.top = "25px";
      gui.domElement.style.right = "25px";
      element.appendChild(gui.domElement);

      // // 创建材质子菜单
      const folder1 = gui.addFolder("照相机");
      folder1.add(camera.position, "x", -50, 50);
      folder1.add(camera.position, "y", 0, 50);
      folder1.add(camera.position, "z", 0, 50);

      const folder2 = gui.addFolder("聚关灯");
      folder2.add(spotLight.position, "x", 0, 50);
      folder2.add(spotLight.position, "y", 0, 50);
      folder2.add(spotLight.position, "z", 0, 50);

      const folder3 = gui.addFolder("盒子材质");
      folder3.addColor(geometryObj, "color").onChange(function (value) {
        // // 材质颜色color
        material.color.set(value);
      });
      folder3.addColor(material, "specular");

      const folder4 = gui.addFolder("光");
      folder4.addColor(spotLight, "color");

      //辅助观察的坐标系
      // const axesHelper = new THREE.AxesHelper(100);
      // scene.add(axesHelper)

      // 渲染器
      const renderer = new THREE.WebGLRenderer();
      renderer.shadowMap.enabled = true; //开启阴影
      renderer.physicallyCorrectLights = true; //设置渲染器器物理正确性
      renderer.setSize(width, height);
      element.appendChild(renderer.domElement);

      // 控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true; //启用阻尼,必须在render中添加upudate

      // 监听当前元素窗口变化
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;

          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      });
      resizeObserver.observe(element);

      // 渲染循环
      function render() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
      render();
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
