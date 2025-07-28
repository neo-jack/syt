// src/routes/index.tsx
// 这是整个应用的路由配置文件，定义了用户访问不同网址时应该显示哪个页面

// ========== 导入React相关的功能 ==========
import { lazy, Suspense, FC } from "react"; 
// lazy: React的懒加载功能，让页面组件只在需要时才加载，提高首次加载速度
// Suspense: 配合lazy使用，在组件加载过程中显示加载状态
// FC: TypeScript类型，表示这是一个React函数组件

import { useRoutes, Navigate } from "react-router-dom";
// useRoutes: React Router提供的Hook，用来根据配置生成路由
// Navigate: 用来重定向到其他页面的组件

// ========== 导入图标组件 ==========
import { 
  HomeOutlined,           // 首页图标
  ShopOutlined,           // 商店图标（用于医院管理）
  DatabaseOutlined,       // 数据库图标（用于数据管理）
  UserOutlined,           // 用户图标（用于会员管理）
  UnorderedListOutlined,  // 列表图标（用于订单管理）
  TableOutlined           // 表格图标（用于统计管理）
} from "@ant-design/icons";

// ========== 导入类型定义 ==========
import type { XRoutes } from "./types";
// XRoutes: 自定义的路由类型，定义了路由对象应该有哪些属性

// ========== 导入多语言组件 ==========
import Translation from "@comps/Translation";
// Translation: 自定义的多语言翻译组件，让应用支持中英文切换

// ========== 导入布局组件 ==========
import {
  Layout,      // 主要的页面布局（包含侧边栏、头部等）
  EmptyLayout, // 空布局（用于登录页面，没有侧边栏和头部）
} from "../layouts";

// ========== 导入加载组件 ==========
import Loading from "@comps/Loading";
// Loading: 加载提示组件，在页面组件还没加载完成时显示

// ========== 使用懒加载导入页面组件 ==========
// 懒加载的好处：页面只在用户访问时才加载，减少首次加载时间

// 基础页面
const Login = lazy(() => import("@pages/login"));           // 登录页面
const Dashboard = lazy(() => import("@pages/dashboard"));   // 首页/仪表板
const NotFound = lazy(() => import("@pages/404"));          // 404错误页面

// 医院管理相关页面
const HospitalSet = lazy(() => import("@pages/hospital/hospitalSet"));
// 医院设置页面，用来管理医院的基本配置

const AddOrUpdateHospital = lazy(() => import("@pages/hospital/hospitalSet/components/AddOrUpdateHospital"));
// 添加或修改医院信息的页面

const HospitalList = lazy(() => import("@pages/hospital/hospitalList"));
// 医院列表页面，显示所有医院的列表

const ShowHospital = lazy(() => import("@pages/hospital/hospitalList/components/ShowHospital"));
// 显示单个医院详细信息的页面

const HospitalSchedule = lazy(() => import("@pages/hospital/hospitalList/components/HospitalSchedule"));
// 医院排班页面，显示医院的医生排班信息

// 数据管理相关页面
const Dict = lazy(() => import("@pages/cmn/dict"));
// 数据字典页面，管理系统中的基础数据

// 会员管理相关页面
const UserList = lazy(() => import("@pages/user/userList"));
// 会员列表页面

const UserListShow = lazy(() => import("@pages/user/userList/components/UserListShow"));
// 显示单个会员详细信息的页面

const AuthList = lazy(() => import("@pages/user/authList"));
// 认证审批列表页面，管理会员的认证申请

// 订单管理相关页面
const OrderList = lazy(() => import("@pages/order/orderList"));
// 订单列表页面

const OrderListShow = lazy(() => import("@pages/order/orderList/components/OrderListShow"));
// 显示单个订单详细信息的页面

// 统计管理相关页面
const StatisticsOrder = lazy(() => import("@pages/statistics/order"));
// 订单统计页面

// ========== 定义懒加载包装函数 ==========
const load = (Comp: FC) => {
  // 这个函数的作用：为懒加载的组件添加加载状态
  // 参数Comp：需要懒加载的React组件
  
  return (
    // Suspense组件：处理懒加载组件的加载状态
    <Suspense fallback={<Loading />}>
      {/* fallback属性：在组件加载过程中显示的内容（这里是Loading组件） */}
      {/* 当网络慢时，用户会看到Loading组件，直到真正的组件加载完成 */}
      <Comp />
      {/* Comp就是传入的页面组件，比如Dashboard、Login等 */}
    </Suspense>
  );
};

// ========== 定义完整的路由配置 ==========
const routes: XRoutes = [
  // routes是一个数组，每个对象代表一个路由规则
  
  // ========== 第一个路由组：登录相关 ==========
  {
    path: "/",                    // 根路径，用户访问网站首页时的路径
    element: <EmptyLayout />,     // 使用空布局（没有侧边栏和头部）
    children: [                   // 子路由数组
      {
        path: "login",            // 子路径，最终的完整路径是 "/login"
        element: load(Login),     // 显示登录页面，并用load函数包装
      },
    ],
  },

  // ========== 第二个路由组：主应用区域 ==========
  {
    path: "/syt",                 // 主应用的基础路径
    element: <Layout />,          // 使用完整布局（包含侧边栏、头部、面包屑等）
    children: [                   // 所有主要功能页面都在这个children数组里
      
      // === 首页/仪表板 ===
      {
        path: "/syt/dashboard",   // 首页的完整路径
        meta: {                   // meta对象：存储额外信息，不是React Router原生的
          icon: <HomeOutlined />, // 在左侧菜单中显示的图标
          title: <Translation>route:dashboard</Translation>, // 在左侧菜单中显示的标题
          // Translation组件会根据当前语言显示"首页"或"Dashboard"
        },
        element: load(Dashboard), // 显示仪表板页面
      },

      // === 医院管理模块 ===
      {
        path: "/syt/hospital",    // 医院管理的基础路径
        meta: {
          icon: <ShopOutlined />, // 医院管理的图标
          title: <Translation>route:hospital</Translation>, // "医院管理"
        },
        // 注意：这里没有element属性，因为这只是一个菜单分组，不对应具体页面
        children: [               // 医院管理下的具体页面
          
          // 医院设置页面
          {
            path: "/syt/hospital/hospitalSet",  // 医院设置页面路径
            meta: {
              title: <Translation>route:hospitalSet</Translation>, // "医院设置"
            },
            element: load(HospitalSet), // 显示医院设置页面
          },
          
          // 添加医院页面
          {
            path: "/syt/hospital/hospitalSet/add",  // 添加医院页面路径
            element: load(AddOrUpdateHospital),     // 显示添加/修改医院页面
            meta: {
              title: "添加医院",   // 页面标题（写死的中文，没有用翻译）
            },
            hidden: true,           // 不在左侧菜单中显示（因为是通过按钮跳转的页面）
          },
          
          // 修改医院页面
          {
            path: "/syt/hospital/hospitalSet/edit/:id",  // 路径中的:id是参数，代表医院ID
            element: load(AddOrUpdateHospital),          // 复用添加页面组件
            meta: {
              title: "修改医院",
            },
            hidden: true,           // 不在左侧菜单中显示
          },
          
          // 医院列表页面
          {
            path: "/syt/hospital/hospitalList",
            meta: {
              title: <Translation>route:hospitalList</Translation>, // "医院列表"
            },
            element: load(HospitalList),
          },
          
          // 显示医院详情页面
          {
            path: "/syt/hospital/hospitalList/show/:id",  // :id参数表示医院ID
            element: load(ShowHospital),
            meta: {
              title: "显示医院详情",
            },
            hidden: true,           // 隐藏，通过列表页面的查看按钮进入
          },
          
          // 医院排班页面
          {
            path: "/syt/hospital/hospitalList/schedule/:hoscode",  // :hoscode是医院编码参数
            element: load(HospitalSchedule),
            meta: {
              title: "医院排班",
            },
            hidden: true,           // 隐藏，通过列表页面的排班按钮进入
          },
        ],
      },

      // === 数据管理模块 ===
      {
        path: "/syt/cmn",         // cmn可能是common的缩写，表示公共数据
        meta: {
          icon: <DatabaseOutlined />,
          title: <Translation>route:data</Translation>, // "数据管理"
        },
        children: [
          {
            path: "/syt/cmn/dict", // 数据字典页面
            meta: {
              title: <Translation>route:dict</Translation>, // "数据字典"
            },
            element: load(Dict),
          },
        ],
      },

      // === 会员管理模块 ===
      {
        path: "/syt/user",
        meta: { 
          icon: <UserOutlined />, 
          title: <Translation>route:member</Translation>  // "会员管理"
        },
        children: [
          // 会员列表页面
          {
            path: "/syt/user/userInfo",
            element: load(UserList),
            meta: { 
              title: <Translation>route:memberList</Translation> // "会员列表"
            },
          },
          
          // 会员详情页面
          {
            path: "/syt/user/userInfo/show/:id",  // :id是会员ID参数
            element: load(UserListShow),
            meta: { 
              title: "会员列表"     // 这里可能是复制粘贴错误，应该是"会员详情"
            },
            hidden: true,
          },
          
          // 认证审批列表页面
          {
            path: "/syt/user/userInfo/authList",
            element: load(AuthList),
            meta: { 
              title: <Translation>route:certificationList</Translation> // "认证审批列表"
            },
          },
        ],
      },

      // === 订单管理模块 ===
      {
        path: "/syt/order",
        meta: { 
          icon: <UnorderedListOutlined />, 
          title: <Translation>route:order</Translation> // "订单管理"
        },
        children: [
          // 订单列表页面
          {
            path: "/syt/order/orderInfo",
            meta: { 
              title: <Translation>route:orderList</Translation> // "订单列表"
            },
            element: load(OrderList),
          },
          
          // 订单详情页面
          {
            path: "/syt/order/orderInfo/show/:id",  // :id是订单ID参数
            element: load(OrderListShow),
            meta: { 
              title: "订单列表"     // 这里也可能是错误，应该是"订单详情"
            },
            hidden: true,
          },
        ],
      },

      // === 统计管理模块 ===
      {
        path: "/syt/statistics",
        meta: { 
          icon: <TableOutlined />, 
          title: <Translation>route:statistics</Translation> // "统计管理"
        },
        children: [
          {
            path: "/syt/statistics/order",
            meta: { 
              title: <Translation>route:statisticsList</Translation> // "统计列表"
            },
            element: load(StatisticsOrder),
          },
        ],
      },
    ],
  },

  // ========== 404错误页面路由 ==========
  {
    path: "/404",                 // 专门的404页面路径
    element: load(NotFound),      // 显示404页面
  },

  // ========== 通配符路由（兜底路由） ==========
  {
    path: "*",                    // *表示匹配所有其他路径
    // 如果用户访问了上面没有定义的路径，就会匹配到这里
    element: <Navigate to="/404" />, // 重定向到404页面
    // Navigate组件会自动跳转到指定路径
  },
];

// ========== 导出自定义Hook ==========
/* 
自定义Hook：useAppRoutes
作用：将路由配置转换为React Router可以使用的路由组件
这是整个应用路由系统的入口函数
*/
export const useAppRoutes = () => {
  // useRoutes是React Router提供的Hook
  // 它接收路由配置数组，返回当前URL对应的页面组件
  return useRoutes(routes);
};

// ========== 导出工具函数 ==========
// 找到要渲染成左侧菜单的路由配置
export const findSideBarRoutes = () => {
  // 在routes数组中找到path为"/syt"的路由（主应用区域）
  const currentIndex = routes.findIndex((route) => route.path === "/syt");
  
  // 返回"/syt"路由下的children数组
  // 这些children就是要显示在左侧菜单中的路由
  return routes[currentIndex].children as XRoutes;
};

// ========== 默认导出 ==========
export default routes;// 导出整个路由配置，供其他文件使用
