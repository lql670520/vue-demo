import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/* Router Modules */
import componentsRouter from "./modules/components";
import chartsRouter from "./modules/charts";
import tableRouter from "./modules/table";
import nestedRouter from "./modules/nested";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true,
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/arsDemo",
    name: "arsDemo",
    meta: {
      title: "语音识别",
      icon: "el-icon-s-help",
    },
    children: [
      {
        path: "arsDemo",
        component: () => import("@/views/arsDemo/index"),
        name: "arsDemo",
        meta: {
          title: "语音识别websokent",
          icon: "dashboard",
        },
      },
      {
        path: "arsDemo2",
        component: () => import("@/views/arsDemo/index2"),
        name: "arsDemo2",
        meta: {
          title: "语音识别2",
          icon: "dashboard",
        },
      },
      // {
      //   path: "demo02",
      //   component: () => import("@/views/demo/index2"),
      //   name: "demo02",
      //   meta: {
      //     title: "海康全景接入",
      //     icon: "dashboard",
      //   },
      // },
    ],
  },
  {
    path: "/demo",
    component: Layout,
    redirect: "/demoOther",
    name: "demoOther",
    meta: {
      title: "demo接入",
      icon: "el-icon-s-help",
    },
    children: [
      {
        path: "ztDemo",
        component: () => import("@/views/demo/ztDemo/index"),
        name: "ztDemo",
        meta: {
          title: "组态列子",
          icon: "dashboard",
        },
      },
      {
        path: "demo01",
        component: () => import("@/views/demo/styleDemo/index"),
        name: "demo01",
        meta: {
          title: "样式例子",
          icon: "dashboard",
        },
      },

      {
        path: "demo02",
        component: () => import("@/views/demo/index2"),
        name: "demo02",
        meta: {
          title: "优化列子",
          icon: "dashboard",
        },
      },
    ],
  },
  {
    path: "/demoOther",
    component: Layout,
    redirect: "/demoOther",
    name: "demoOther",
    meta: {
      title: "demo接入",
      icon: "el-icon-s-help",
    },
    children: [
      {
        path: "demo01",
        component: () => import("@/views/demoOther/index1"),
        name: "demo01",
        meta: {
          title: "Untiy接入",
          icon: "dashboard",
        },
      },
      {
        path: "demo02",
        component: () => import("@/views/demoOther/index2"),
        name: "demo02",
        meta: {
          title: "海康全景接入",
          icon: "dashboard",
        },
      },
    ],
  },

  {
    path: "/three",
    component: Layout,
    redirect: "/threeDemo0",
    name: "threeDemo",
    meta: {
      title: "trheejs入门",
      icon: "el-icon-s-help",
    },
    children: [
      {
        path: "threeDemo1",
        component: () => import("@/views/threeDemo/index1"),
        name: "threeDemo1",
        meta: {
          title: "入门之一:引用Threejs并创建第一个3D图形",
          icon: "dashboard",
        },
      },
      {
        path: "threeDemo2",
        name: "threeDemo2",
        component: () => import("@/views/threeDemo/index2"),
        meta: {
          title: "入门之二:让物体跟随鼠标动起来（OrbitControls）",
          icon: "dashboard",
        },
      },
      {
        path: "threeDemo3",
        name: "threeDemo3",
        component: () => import("@/views/threeDemo/index3"),
        meta: {
          title: "入门之三-1:Threejs中的光(环境光、点光源、平行光)",
          icon: "dashboard",
        },
      },
      {
        path: "threeDemo4",
        name: "threeDemo4",
        component: () => import("@/views/threeDemo/index4"),
        meta: { title: "入门之三-2:Threejs中的光(聚光灯)", icon: "dashboard" },
      },
      {
        path: "threeDemo5",
        name: "threeDemo5",
        component: () => import("@/views/threeDemo/index5"),
        meta: {
          title: "入门之四-1:动画和帧率（requestAnimationFrame）",
          icon: "dashboard",
        },
      },
      {
        path: "threeDemo6",
        name: "threeDemo6",
        component: () => import("@/views/threeDemo/index6"),
        meta: {
          title: "入门之四-2:动画和帧率（stats）",
          icon: "dashboard",
        },
      },
      {
        path: "threeDemo7",
        name: "threeDemo7",
        component: () => import("@/views/threeDemo/index7"),
        meta: {
          title: "入门之五:实时适配、锯齿模糊、设置背景、阻尼（惯性）等",
          icon: "dashboard",
        },
      },
      {
        path: "threeDemo8",
        name: "threeDemo8",
        component: () => import("@/views/threeDemo/index8"),
        meta: {
          title: "入门之六:引用GUI面板",
          icon: "dashboard",
        },
      },
      {
        path: "threeDemo9",
        name: "threeDemo9",
        component: () => import("@/views/threeDemo/index9"),
        meta: {
          title: "以上总结例子",
          icon: "dashboard",
        },
      },

      // {
      //   path: "threeDemo10",
      //   name: "threeDemo10",
      //   component: () => import("@/views/threeDemo/index10"),
      //   meta: {
      //     title: "入门之七:BufferGeometry",
      //     icon: "dashboard",
      //   },
      // },
    ],
  },

  {
    path: "/threeBufferGeometryDemo",
    component: Layout,
    redirect: "/threeBufferGeometryDemo1",
    name: "threeBufferGeometryDemo",
    meta: {
      title: "几何体BufferGeometry",
      icon: "el-icon-s-help",
    },
    children: [
      {
        path: "threeBufferGeometryDemo1",
        name: "threeBufferGeometryDemo1",
        component: () => import("@/views/threeBufferGeometryDemo/index1"),
        meta: {
          title: "BufferGeometry与基础材质MeshBasicMaterial结合",
          icon: "dashboard",
        },
      },
      {
        path: "threeBufferGeometryDemo2",
        name: "threeBufferGeometryDemo2",
        component: () => import("@/views/threeBufferGeometryDemo/index2"),
        meta: {
          title: "BufferGeometry与PointsMaterial、Points点模型结合",
          icon: "dashboard",
        },
      },
      {
        path: "threeBufferGeometryDemo3",
        name: "threeBufferGeometryDemo3",
        component: () => import("@/views/threeBufferGeometryDemo/index3"),
        meta: {
          title:
            "BufferGeometry与LineBasicMaterial、Line、LineSegments、LineLoop线模型结合",
          icon: "dashboard",
        },
      },
      {
        path: "threeBufferGeometryDemo4",
        name: "threeBufferGeometryDemo4",
        component: () => import("@/views/threeBufferGeometryDemo/index4"),
        meta: {
          title: "BufferGeometry有顶点展示",
          icon: "dashboard",
        },
      },
      {
        path: "threeBufferGeometryDemo5",
        name: "threeBufferGeometryDemo5",
        component: () => import("@/views/threeBufferGeometryDemo/index5"),
        meta: {
          title: "BufferGeometry有无索引点展示",
          icon: "dashboard",
        },
      },
    ],
  },
  {
    path: "/threeCzDemo",
    component: Layout,
    redirect: "/threeCzDemo1",
    name: "threeCzDemo",
    meta: {
      title: "顶点UV坐标与纹理贴图",
      icon: "el-icon-s-help",
    },
    children: [
      {
        path: "threeCzDemo1",
        name: "threeCzDemo1",
        component: () => import("@/views/threeCzDemo/index1"),
        meta: {
          title: "创建纹理贴图",
          icon: "dashboard",
        },
      },
      {
        path: "threeCzDemo2",
        name: "threeCzDemo2",
        component: () => import("@/views/threeCzDemo/index2"),
        meta: {
          title: "自定义顶点UV坐标",
          icon: "dashboard",
        },
      },
      {
        path: "threeCzDemo3",
        name: "threeCzDemo3",
        component: () => import("@/views/threeCzDemo/index3"),
        meta: {
          title: "纹理对象Texture阵列",
          icon: "dashboard",
        },
      },
    ],
  },
  {
    path: "/threeDocDemo",
    component: Layout,
    redirect: "/threeDocDemo1",
    name: "threeDocDemo",
    meta: {
      title: "列子",
      icon: "el-icon-s-help",
    },
    children: [
      {
        path: "threeDocDemo1",
        name: "threeDocDemo1",
        component: () => import("@/views/threeDocDemo/index1"),
        meta: {
          title: "室内环境的使用例子",
          icon: "dashboard",
        },
      },
      {
        path: "threeDocDemo2",
        name: "threeDocDemo2",
        component: () => import("@/views/threeDocDemo/index2"),
        meta: {
          title: "房子",
          icon: "dashboard",
        },
      },
    ],
  },
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
