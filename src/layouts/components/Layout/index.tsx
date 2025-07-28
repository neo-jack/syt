// src/layouts/components/Layout/index.tsx
// 这是整个应用的主布局组件，定义了页面的整体结构和外观
// 包含：左侧菜单、顶部导航、标签页、主内容区域等

/*
<Layout>
  <Sider>侧边栏</Sider>
  <Layout>
    <Header>头部</Header>
    <Content>内容区</Content>
    <Footer>底部</Footer>
  </Layout>
</Layout>
*/


// ========== 导入React相关功能 ==========
import React from "react";
// React: 核心React库，用于创建组件

import { Outlet } from "react-router-dom";
// Outlet: React Router提供的组件，用来显示当前路由对应的页面内容
// 比如：当用户访问 /syt/dashboard 时，Outlet会显示Dashboard组件
// 当用户访问 /syt/hospital/hospitalSet 时，Outlet会显示HospitalSet组件

// ========== 导入Ant Design UI组件 ==========
import { Layout, Button } from "antd";
// Layout: Ant Design的布局组件，提供网页的基本框架结构
// Button: 按钮组件，这里用于语言切换按钮

// ========== 导入权限控制组件 ==========
import withAuthorization from "@/components/withAuthorization";
// withAuthorization: 高阶组件（一个特殊的函数）
// 作用：检查用户是否已登录，如果没登录就跳转到登录页面
// 这样可以保护所有需要登录才能访问的页面

// ========== 导入各个子组件 ==========
import Avatar from "../Avatar";
// Avatar: 用户头像组件，显示在页面右上角，点击可以退出登录

import Breadcrumb from "../Breadcrumb";
// Breadcrumb: 面包屑导航组件，显示当前页面的位置
// 比如：医院管理 > 医院设置，让用户知道自己在哪个页面

import SideBar from "../SideBar";
// SideBar: 左侧菜单组件，显示所有功能模块的导航菜单

import Tabs from "../Tabs";
// Tabs: 标签页组件，类似浏览器的标签页，可以在多个页面之间快速切换

// ========== 导入多语言功能 ==========
import { useTranslation } from "react-i18next";
// useTranslation: 多语言Hook，用来切换应用的语言（中文/英文）

// ========== 导入Redux状态管理 ==========
import { useAppSelector, useAppDispatch } from "@/app/hooks";
// useAppSelector: 从Redux全局状态中获取数据的Hook
// useAppDispatch: 向Redux发送操作指令的Hook

import { selectLang, setLang } from "@/app/appSlice";
// selectLang: 选择器函数，用来获取当前选择的语言
// setLang: 动作函数，用来设置新的语言

// ========== 导入样式文件 ==========
import "./index.less";
// 导入这个组件专用的CSS样式文件

// ========== 从Ant Design Layout中提取需要的组件 ==========
const { Header, Content } = Layout;
// Layout.Header: 页面顶部区域组件
// Layout.Content: 页面主内容区域组件
// 这样写可以直接使用 Header 和 Content，而不需要写 Layout.Header




// ========== 定义主布局组件 ==========
function LayoutComponent() {
  // 这是一个函数组件，包含整个应用的布局逻辑

  // === 获取当前语言设置 ===
  const lang = useAppSelector(selectLang);
  // 从Redux全局状态中获取当前的语言设置
  // lang的值可能是 "zh_CN"（中文）或 "en_US"（英文）

  // === 获取Redux操作函数 ===
  const dispatch = useAppDispatch();
  // dispatch函数用来向Redux发送指令，比如修改语言设置

  // === 获取多语言切换功能 ===
  const { i18n } = useTranslation();
  // i18n是国际化对象，包含了语言切换的各种方法
  // i18n.changeLanguage() 可以切换整个应用的语言

  // === 定义语言切换处理函数 ===
  const handleChangeLang = () => {
    // 这个函数在用户点击语言切换按钮时被调用

    // 根据当前语言决定新语言
    const newLang = lang === "zh_CN" ? "en_US" : "zh_CN";
    // 三元运算符：如果当前是中文，就切换到英文；如果当前是英文，就切换到中文

    // 更新Redux中的语言状态
    dispatch(setLang(newLang));
    // 向Redux发送setLang指令，更新全局语言状态

    // 更新i18n的语言设置
    i18n.changeLanguage(newLang);
    // 通知多语言系统切换语言，这会让所有使用翻译的文字立即更新
  };

  // === 渲染布局结构 ===
  return (
    // 最外层Layout：整个页面的容器
    <Layout style={{ minHeight: "100vh" }}>
      {/* 
        style={{ minHeight: "100vh" }}:
        - minHeight: 最小高度
        - 100vh: 视口高度的100%，即整个浏览器窗口的高度
        - 确保页面至少占满整个屏幕高度
      */}

      {/* 左侧菜单区域 */}
      <SideBar />
      {/* 
        SideBar组件包含：
        - 应用Logo和标题
        - 功能模块导航菜单（首页、医院管理、会员管理等）
        - 可以折叠/展开的功能
      */}

      {/* 右侧主要内容区域 */}
      <Layout>
        {/* 这是嵌套的Layout，用来组织右侧的头部和内容区域 */}

        {/* 顶部导航栏 */}
        <Header className="layout-header">
          {/* 
            Header: Ant Design的头部组件
            className="layout-header": 应用自定义CSS样式
          */}

          {/* 面包屑导航 */}
          <Breadcrumb />
          {/* 
            显示当前页面位置，比如：
            - 首页
            - 医院管理 > 医院设置
            - 会员管理 > 会员列表
          */}

          {/* 右侧功能区域 */}
          <div>
            {/* 这个div包含语言切换按钮和用户头像 */}

            {/* 语言切换按钮 */}
            <Button size="small" onClick={handleChangeLang}>
              {/* 
                size="small": 小尺寸按钮
                onClick={handleChangeLang}: 点击时调用语言切换函数
              */}

              {/* 按钮文字：根据当前语言显示相反的语言名称 */}
              {lang === "zh_CN" ? "English" : "中文"}
              {/* 
                逻辑：
                - 如果当前是中文，按钮显示"English"（点击后切换到英文）
                - 如果当前是英文，按钮显示"中文"（点击后切换到中文）
              */}
            </Button>

            {/* 用户头像和下拉菜单 */}
            <Avatar />
            {/* 
              Avatar组件包含：
              - 用户头像图片
              - 点击后显示下拉菜单
              - 菜单选项：返回首页、退出登录
            */}
          </div>
        </Header>

        {/* 标签页区域 */}
        <Tabs />
        {/* 
          Tabs组件功能：
          - 类似浏览器标签页，可以同时打开多个页面
          - 首页标签不能关闭，其他标签可以关闭
          - 点击标签可以快速切换页面
          - 自动记录用户访问过的页面
        */}

        {/* 主内容区域 */}
        <Content>
          {/* Content: Ant Design的内容区域组件 */}

          <Outlet />
          {/* 
            Outlet: 这是最重要的部分！
            - 这里会显示当前路由对应的页面组件
            - 比如用户访问/syt/dashboard时，这里显示Dashboard组件
            - 比如用户访问/syt/hospital/hospitalSet时，这里显示HospitalSet组件
            - React Router会自动根据URL在这里渲染对应的页面
          */}
        </Content>

        {/* 页脚区域（当前被注释掉了） */}
        {/* <Footer style={{ textAlign: "center" }}>
          xxx
        </Footer> */}
        {/* 
          如果需要页脚，可以取消注释这部分
          通常显示版权信息、联系方式等
        */}
      </Layout>
    </Layout>
  );
}

// ========== 导出带权限控制的组件 ==========
export default withAuthorization(LayoutComponent);
// withAuthorization()是一个高阶组件（函数），它的作用：
// 1. 检查用户是否已登录（是否有token）
// 2. 如果没有登录，自动跳转到登录页面
// 3. 如果已登录但没有用户信息，自动请求用户信息
// 4. 只有通过权限检查，才会显示LayoutComponent

/* 
=== 组件功能总结 ===
这个Layout组件是整个应用的"骨架"，提供了：

1. **整体布局结构**：
   - 左侧：导航菜单
   - 右侧上方：面包屑导航、语言切换、用户头像
   - 右侧中间：标签页
   - 右侧下方：具体页面内容

2. **权限控制**：
   - 确保只有登录用户才能访问
   - 自动处理登录状态检查

3. **多语言支持**：
   - 可以在中文和英文之间切换
   - 切换后整个应用的语言都会改变

4. **导航功能**：
   - 面包屑显示当前位置
   - 标签页支持多页面切换
   - 左侧菜单提供功能入口

=== 在项目中的作用 ===
- 所有主要功能页面都使用这个布局
- 在路由配置中，/syt/* 路径都使用这个Layout
- 登录页面使用EmptyLayout（没有菜单和导航）
- 提供了统一的用户体验和交互方式

=== 数据流向 ===
1. 用户操作（点击菜单、切换语言等）
2. 通过Redux更新全局状态
3. 组件重新渲染，显示最新状态
4. 路由变化时，Outlet显示对应页面
*/