<template>
  <div class="app-container">
    <div id="webgl"></div>
    <div class="remark">
      备注：初步了解了BufferGeometry，它可以自定义任何几何形状，它的数据存储在BufferAttribute中。我们也使用BufferGeometry创建了一个自定义的mesh物体，但是，如果你跟着步骤创建了这个物体，用鼠标反转你会发现，这个物体只有一个面可以看到，反转后是看不到任何物体的，这是因为在Threejs中，空间中一个三角形是有正反两面的，在Three.js中规则你的眼睛(相机)对着三角形的一个面，如果三个顶点的顺序是逆时针方向，该面视为正面，如果三个顶点的顺序是顺时针方向，该面视为反面。
      我们可以在创建材质的时候配置side属性来设置物体的正反面是否可见。
      <ul style="margin-top: 10px">
        <li>
          <div>
            通过javascript中的Float32Array来创建一组xyz坐标数据用来表示几何体的顶点坐标
          </div>
        </li>
        <li>
          <div>
            MeshBasicMaterial材质中side:THREE.FrontSide（默认正面）
            、THREE.DoubleSide（两面可见）、THREE.BackSide（背面可见）
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

      const geometry = new THREE.BufferGeometry();
      //创建顶点数据
      const vertices = new Float32Array([
        0,
        0,
        0, //顶点1坐标
        100,
        0,
        0, //顶点2坐标
        0,
        100,
        0, //顶点3坐标
        0,
        0,
        30, //顶点4坐标
        0,
        0,
        100, //顶点5坐标
        60,
        0,
        20, //顶点6坐标
      ]);

      // 创建属性缓冲区对象
      const attribute = new THREE.BufferAttribute(vertices, 3);
      console.log(attribute, "eeeeeee");
      // 设置几何体attributes属性的位置属性
      geometry.attributes.position = attribute;
      // 创建材质
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide, //FrontSide（默认正面） 、THREE.DoubleSide（两面可见）、THREE.BackSide（背面可见）
      });
      // 创建物体
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      //===========================
      //===========================
      //===========================

      //辅助观察的坐标系
      const axesHelper = new THREE.AxesHelper(100);
      scene.add(axesHelper);

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
