<template>
  <div class="app-container">
    <div id="webgl"></div>
    <div class="remark">
      备注：https://blog.csdn.net/w137160164/article/details/129943137?spm=1001.2014.3001.5502
      <ul style="margin-top: 10px">
        <li>
          <div>查看顶点6个和4个区别：当前是4个</div>
        </li>
        <li>
          <div>代码 vertices1 和 vertices是一样的面，但是减少了顶点个数</div>
        </li>

        <li>
          <div>
            如果没有geometry.index = new THREE.BufferAttribute(indexes, 1);
            则会只展示三角形，他不是一个组的面
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
      const camera = new THREE.PerspectiveCamera(75, width / height, 1, 10000);
      camera.position.set(100, 100, 100);
      camera.lookAt(0, 0, 0);

      //===========================
      //===========================
      //===========================

      const geometry = new THREE.BufferGeometry();
      //创建顶点数据
      const vertices = new Float32Array([
        0,
        0,
        0, //顶点1坐标
        80,
        0,
        0, //顶点2坐标
        80,
        80,
        0, //顶点3坐标
        0,
        80,
        0, //顶点4坐标
      ]);
      // 创建属性缓冲区对象
      const attribute = new THREE.BufferAttribute(vertices, 3);
      // 设置几何体attributes属性的位置属性
      geometry.attributes.position = attribute;
      // 下面索引值对应顶点位置数据中的顶点坐标
      // Uint16Array类型数组创建顶点索引数据
      const indexes = new Uint16Array([
        // 下面索引值对应顶点位置数据中的顶点坐标
        0, 1, 2, 0, 2, 3,
      ]);
      // 索引数据赋值给几何体的index属性
      geometry.index = new THREE.BufferAttribute(indexes, 1); //1个为一组

      // 矩形平面，无索引，两个三角形，6个顶点
      // 每个顶点的法线数据和顶点位置数据一一对应
      const normals = new Float32Array([
          0, 0, 1, //顶点1法线( 法向量 )
          0, 0, 1, //顶点2法线
          0, 0, 1, //顶点3法线
          0, 0, 1, //顶点4法线
      ]);
      // 设置几何体的顶点法线属性.attributes.normal
      geometry.attributes.normal = new THREE.BufferAttribute(normals, 3);

      console.log(geometry);
      // 创建材质
      const material = new THREE.MeshLambertMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      //===========================
      //===========================
      //===========================

      //辅助观察的坐标系
      // const axesHelper = new THREE.AxesHelper(100);
      // scene.add(axesHelper);

      // 添加环境光,环境关没有展示辅助
      const light = new THREE.AmbientLight(0xffffff, 1);
      scene.add(light);

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
