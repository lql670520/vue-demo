<template>
  <div class="app-container">
    <div id="webgl"></div>

    <div class="remark">
      备注：
      <ul style="margin-top: 10px">
        <li>
          <div>npm install lil-gui</div>
        </li>
        <li>
          <div>import { GUI } from "lil-gui"</div>
        </li>
        <li>
          <div>
            参考：https://blog.csdn.net/2301_79959413/article/details/136304269?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-0-136304269-blog-141841981.235^v43^pc_blog_bottom_relevance_base1&spm=1001.2101.3001.4242.1&utm_relevant_index=3
          </div>
        </li>
        <li>
          <div>如果报错：this.$select.replaceChildren(),请在全局添加该方法</div>
          <div>
            if (!Element.prototype.replaceChildren) {
            Element.prototype.replaceChildren = function replaceChildren() { var
            len = this.childNodes.length; while (len--) {
            this.removeChild(this.childNodes[len]); } var argCount =
            arguments.length; while (argCount--) {
            this.appendChild(arguments[argCount]); } }; }
          </div>
        </li>
      </ul>
    </div>
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

      // 一个网格模型
      const geometry = new THREE.SphereGeometry(50, 25, 25);
      const material = new THREE.MeshPhongMaterial({
        color: 0x00ffff,
        specular: 0x111111,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh); //模型对象添加到场景中

      //光源设置
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(100, 120, 150);
      scene.add(directionalLight);
      const directionalLightHelper = new THREE.DirectionalLightHelper(
        directionalLight,
        5
      );
      scene.add(directionalLightHelper);

      const ambient = new THREE.AmbientLight(0xffffff, 0.1);
      scene.add(ambient);

      //辅助观察的坐标系
      const axesHelper = new THREE.AxesHelper(100);
      scene.add(axesHelper);

      // 测试GUI
      const guiDemo = new GUI({ title: "控制面板" });
      guiDemo.domElement.style.position = "absolute";
      guiDemo.domElement.style.top = "25px";
      guiDemo.domElement.style.left = "25px";
      guiDemo.domElement.style.right = "auto";
      element.appendChild(guiDemo.domElement);
      const obj1 = {
        myBoolean: true,
        myString: "lil-gui",
        myNumber: 1,
        myFunction: function () {
          alert("hi");
        },
        size: "Large",
        speed: 0,
      };

      const folder1 = guiDemo.addFolder("属性类型和界面控件的对应关系");
      folder1.add(obj1, "myBoolean"); // checkbox
      folder1.add(obj1, "myString"); // text field
      folder1.add(obj1, "myNumber"); // number field
      folder1.add(obj1, "size", ["Small", "Medium", "Large"]); //下拉框
      folder1
        .add(obj1, "speed", {
          left: -100,
          center: 0,
          右: 100,
        })
        .name("位置选择")
        .onChange(function (value) {
          console.log(value);
        });
      folder1.add(obj1, "myFunction"); // 按钮

      const folder2 = guiDemo.addFolder("指定最大值、最小值和步进量、滑块 ");
      const obj2 = {
        hasMin: 0,
        hasMax: 100,
        hasStep: 60,
        number1: 1,
        number2: 40,
      };
      folder2.add(obj2, "hasMin").min(0);
      folder2.add(obj2, "hasMax").max(100);
      folder2.add(obj2, "hasStep").step(10); // 四舍五入到10的倍数
      folder2.add(obj2, "number1", 0, 1, 0.1); // min, max, step
      folder2.add(obj2, "number2", 0, 100, 10).name('失去焦点触发').onFinishChange((v) => {
        //  // 修改属性，界面控件失去焦点时才触发
        console.log(v);
      }); // min, max, step
      folder2.close();//关闭菜单
      
      //=========================================================================//
      // 关联GUI
      const gui = new GUI(); //创建GUI对象
      gui.domElement.style.position = "absolute";
      gui.domElement.style.top = "25px";
      gui.domElement.style.right = "25px";
      element.appendChild(gui.domElement);

      //创建一个对象，对象属性的值可以被GUI库创建的交互界面改变
      const obj = {
        color: 0x00ffff, // 材质颜色
        specular: 0x111111, // 材质高光颜色
      };
      // 创建材质子菜单
      const matFolder = gui.addFolder("材质");
      // 材质颜色color
      matFolder.addColor(obj, "color").onChange(function (value) {
        material.color.set(value);
      });
      // 材质高光颜色specular
      matFolder.addColor(obj, "specular").onChange(function (value) {
        material.specular.set(value);
      });
      // 环境光子菜单
      const ambientFolder = gui.addFolder("环境光");
      // 环境光强度
      ambientFolder.add(ambient, "intensity", 0, 2);
      // 平行光子菜单
      const dirFolder = gui.addFolder("平行光");
      // 平行光强度
      dirFolder.add(directionalLight, "intensity", 0, 2);
      // 平行光位置
      dirFolder.add(directionalLight.position, "x", -400, 400);
      dirFolder.add(directionalLight.position, "y", -400, 400);
      dirFolder.add(directionalLight.position, "z", -400, 400);

      //渲染器和相机
      const camera = new THREE.PerspectiveCamera(75, width / height, 1, 3000);
      camera.position.set(150, 150, 150);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);
      element.appendChild(renderer.domElement);

      // 渲染循环
      function render() {
        // 当gui界面设置obj.bool为true,mesh执行旋转动画
        if (obj.bool) mesh.rotateY(0.01);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
      render();

      const controls = new OrbitControls(camera, renderer.domElement);

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
