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
      const element = document.getElementById("webgl");
      const width = element.clientWidth;
      const height = element.clientHeight;

      //场景
      const scene = new THREE.Scene();
      //相机
      const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1000);
      camera.position.set(100, 100, 100);
      camera.lookAt(0, 0, 0);

      //===========================
      //===========================
      //===========================

      const geometry = new THREE.PlaneGeometry(200, 100);
      console.log('uv',geometry.attributes);
      const uvs = new Float32Array([
      // 0, 1, 1, 1, 0, 0, 1, 0,
      0, 0, // 左下角
      0, 1 , // 左上角
      1, 0, // 右下角
      1, 1, // 右上角
      ]);
      // 设置几何体attributes属性的位置normal属性
      geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标

      //纹理贴图加载器TextureLoader
      const texLoader = new THREE.TextureLoader();
      // .load()方法加载图像，返回一个纹理对象Texture
      const texture = texLoader.load(
        require("@/assets/demoImages/1.jpg"),
        () => {
          texture.colorSpace = THREE.SRGBColorSpace; //设置为SRGB颜色空间
        }
      );

      const material = new THREE.MeshLambertMaterial({
        // 设置纹理贴图：Texture对象作为材质map属性的属性值
        map: texture, //map表示材质的颜色贴图属性
        // color: 0xffffff,
        side: THREE.DoubleSide,
      });

      // 创建物体
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      //===========================
      //===========================
      //===========================

      // 添加环境光,环境关没有展示辅助
      const light = new THREE.AmbientLight(0xffffff, 1);
      scene.add(light);

      //辅助观察的坐标系
      // const axesHelper = new THREE.AxesHelper(100);
      // scene.add(axesHelper);

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
