// src/layouts/components/SideBar/index.tsx
// 这是应用左侧菜单组件，负责显示导航菜单，让用户可以在不同功能模块之间跳转

// ========== 导入React相关功能 ==========
import React, { useEffect, useState } from "react";
// React: 核心React库
// useEffect: 副作用Hook，用来监听路由变化
// useState: 状态Hook，用来管理菜单的状态

import { useLocation, useNavigate } from "react-router-dom";
// useLocation: 获取当前页面的路由信息（比如当前在哪个页面）
// useNavigate: 用来进行页面跳转的Hook

// ========== 导入Ant Design UI组件 ==========
import { Layout, Menu } from "antd";
// Layout: Ant Design的布局组件，这里使用其中的Sider（侧边栏）
// Menu: Ant Design的菜单组件，用来渲染导航菜单

import { useTranslation } from "react-i18next";
// useTranslation: 多语言翻译Hook，用来显示不同语言的文字

// ========== 导入路由相关功能 ==========
import { findSideBarRoutes } from "@/routes";
// findSideBarRoutes: 自定义函数，从路由配置中提取需要显示在菜单中的路由

import { XRoutes } from "@/routes/types";
// XRoutes: 自定义的路由类型定义

import type { MenuProps } from "antd";
// MenuProps: Ant Design Menu组件的属性类型定义

// ========== 导入样式和资源 ==========
import "./index.less";
// 导入这个组件专用的CSS样式文件

import logo from "./images/logo.png";
// 导入应用的Logo图片

// ========== 类型定义 ==========
// 参考Ant Design官方文档：https://ant.design/components/menu-cn/
type MenuItem = Required<MenuProps>["items"][number];
// MenuItem: 定义菜单项的类型
// Required<MenuProps>["items"]: 从MenuProps中提取items属性，并设为必需
// [number]: 表示数组中单个元素的类型

// ========== 辅助函数：创建菜单项 ==========
function getItem(
  label: React.ReactNode,    // 菜单项显示的文字或组件
  key: React.Key,           // 菜单项的唯一标识符（通常是路由路径）
  icon?: React.ReactNode,   // 菜单项的图标（可选）
  children?: MenuItem[],    // 子菜单项数组（可选，用于二级菜单）
  type?: "group"           // 菜单项类型（可选）
): MenuItem {
  // 这个函数的作用：规范化创建菜单项，确保每个菜单项都有统一的格式
  return {
    key,        // 菜单项的唯一标识
    icon,       // 菜单项图标
    children,   // 子菜单项
    label,      // 菜单项显示内容
    type,       // 菜单项类型
  } as MenuItem;
}

// ========== 从Layout中提取Sider组件 ==========
const { Sider } = Layout;
// Sider: Ant Design布局组件中的侧边栏部分
// 用来作为左侧菜单的容器

// ========== 菜单点击事件的类型定义 ==========
interface MenuInfo {
  key: string;                   // 被点击的菜单项的key（路由路径）
  keyPath: string[];            // 从根菜单到当前菜单项的完整路径
  /** @deprecated This will not support in future. You should avoid to use this */
  item: React.ReactInstance;    // 被点击的菜单项组件实例（已废弃）
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>; // 原始的DOM事件
}

// ========== 主要的SideBar组件 ==========
function SideBar() {
  // 这是左侧菜单组件的主函数

  // === 状态管理 ===
  const [collapsed, setCollapsed] = useState(false);
  // collapsed: 菜单是否折叠的状态
  // true: 菜单折叠（只显示图标）
  // false: 菜单展开（显示图标和文字）
  // setCollapsed: 用来更新折叠状态的函数

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  // openKeys: 当前展开的子菜单的key数组
  // 比如：["syt/hospital"] 表示医院管理菜单当前是展开状态
  // setOpenKeys: 用来更新展开菜单的函数

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  // selectedKeys: 当前选中的菜单项的key数组
  // 比如：["/syt/dashboard"] 表示首页菜单当前被选中
  // setSelectedKeys: 用来更新选中菜单的函数

  // === 折叠菜单的处理函数 ===
  const onCollapse = (collapsed: boolean) => {
    // 这个函数在用户点击折叠按钮时被调用
    // collapsed: 新的折叠状态（true或false）
    setCollapsed(collapsed);
    // 更新组件的折叠状态
  };

  // === 获取路由相关的Hooks ===
  const location = useLocation();
  // location: 包含当前页面路由信息的对象
  // location.pathname: 当前页面的路径，比如 "/syt/dashboard"

  const navigate = useNavigate();
  // navigate: 用来进行页面跳转的函数
  // navigate("/syt/hospital/hospitalSet"): 跳转到医院设置页面

  // === 提取当前路径 ===
  const { pathname } = location;
  // 使用解构赋值从location对象中提取pathname
  // pathname: 当前页面路径，比如 "/syt/hospital/hospitalSet"

  // === 监听路由变化，自动更新菜单状态 ===
  useEffect(() => {
    // 这个Effect在pathname发生变化时执行
    // 目的：根据当前页面路径，自动设置菜单的展开和选中状态

    // 计算需要展开的菜单项
    const openKeys = pathname.split("/").slice(0, 3).join("/");
    // 解释这行代码的执行过程：
    // 假设 pathname = "/syt/hospital/hospitalSet"
    // 1. pathname.split("/") → ["", "syt", "hospital", "hospitalSet"]
    // 2. .slice(0, 3) → ["", "syt", "hospital"] (取前3个元素)
    // 3. .join("/") → "/syt/hospital"
    // 结果：openKeys = "/syt/hospital"，表示需要展开医院管理菜单
    
    setOpenKeys([openKeys]);
    // 设置需要展开的菜单项，用数组包装因为可能同时展开多个菜单

    // 计算需要选中的菜单项
    const selectedKeys = pathname.split("/").slice(0).join("/");
    // 解释这行代码：
    // 假设 pathname = "/syt/hospital/hospitalSet"
    // 1. pathname.split("/") → ["", "syt", "hospital", "hospitalSet"]
    // 2. .slice(0) → ["", "syt", "hospital", "hospitalSet"] (取全部元素)
    // 3. .join("/") → "/syt/hospital/hospitalSet"
    // 结果：selectedKeys = "/syt/hospital/hospitalSet"，表示需要选中医院设置菜单项
    
    setSelectedKeys([selectedKeys]);
    // 设置需要选中的菜单项
  }, [pathname]);
  // 依赖数组：[pathname]，表示只有当pathname变化时才重新执行这个Effect

  // === 获取菜单路由配置 ===
  const routes = findSideBarRoutes() as XRoutes;
  // findSideBarRoutes(): 从完整的路由配置中提取需要显示在菜单中的路由
  // 比如：提取 /syt 下的所有子路由（dashboard、hospital、user等）
  // as XRoutes: TypeScript类型断言，确保返回值符合XRoutes类型

  // === 生成菜单项数据 ===
  const menuItems: MenuItem[] = routes.map((route) => {
    // 遍历每个路由配置，将其转换为菜单项格式
    
    return getItem(
      // 第一个参数：菜单项显示的文字
      route.meta?.title,
      // route.meta?.title: 从路由的meta属性中获取标题
      // 比如：<Translation>route:hospital</Translation>，会显示"医院管理"

      // 第二个参数：菜单项的唯一标识（用于路由跳转）
      route.path as string,
      // route.path: 路由路径，比如 "/syt/hospital"

      // 第三个参数：菜单项的图标
      route.meta?.icon,
      // route.meta?.icon: 从路由的meta属性中获取图标
      // 比如：<ShopOutlined />，会显示商店图标

      // 第四个参数：子菜单项（处理二级菜单）
      route.children
        ?.map((item) => {
          // 遍历当前路由的子路由，为每个子路由创建子菜单项

          if (item.hidden) return null;
          // 如果子路由设置了hidden: true，则不显示在菜单中
          // 比如：添加医院、编辑医院等页面不应该在菜单中显示

          // 为每个子路由创建菜单项
          return getItem(
            item.meta?.title,        // 子菜单项标题
            item.path as string,     // 子菜单项路径
            item.meta?.icon          // 子菜单项图标
          );
        })
        .filter(Boolean)
        // .filter(Boolean): 过滤掉null值
        // 即：只保留那些不是hidden的子菜单项
    );
  });

  // === 菜单点击事件处理 ===
  const handleMenuClick = ({ key }: MenuInfo) => {
    // 当用户点击菜单项时触发这个函数
    // key: 被点击的菜单项的路径，比如 "/syt/dashboard"
    
    navigate(key);
    // 使用navigate函数跳转到对应的页面
    // 比如：点击首页菜单，会跳转到 "/syt/dashboard"
  };

  // === 菜单展开/收起事件处理 ===
  const handleOpenChange = (openKeys: string[]) => {
    // 当用户展开或收起子菜单时触发这个函数
    // openKeys: 当前所有展开的菜单项的key数组
    
    setOpenKeys(openKeys);
    // 更新展开菜单的状态
    // 比如：用户点击医院管理，openKeys会变成 ["/syt/hospital"]
  };

  // === 获取多语言翻译功能 ===
  const { t } = useTranslation();
  // t: 翻译函数，用来显示多语言文字
  // t("app:title"): 显示应用标题，中文时显示"商医通管理系统"

  // === 渲染左侧菜单 ===
  return (
    <Sider 
      collapsible={true}           // 菜单可以折叠
      collapsed={collapsed}        // 当前的折叠状态
      onCollapse={onCollapse}      // 折叠状态改变时的回调函数
      breakpoint="lg"              // 在大屏幕(lg)断点处自动折叠
    >
      {/* breakpoint="lg" 解释：
          - 当屏幕宽度小于992px时，菜单会自动折叠
          - 这样在手机或平板上菜单不会占用太多空间
      */}

      {/* === 应用标题和Logo区域 === */}
      <h1 className="layout-title">
        {/* className="layout-title": 应用CSS样式，设置标题的外观 */}
        
        {/* 应用Logo */}
        <img className="layout-logo" src={logo} alt="logo" />
        {/* 
          src={logo}: 显示导入的logo图片
          alt="logo": 图片无法显示时的替代文字
          className="layout-logo": 应用CSS样式，控制logo大小
        */}

        {/* 应用标题文字 */}
        <span style={{ display: collapsed ? "none" : "inline-block" }}>
          {/* 
            动态样式控制：
            - 如果菜单折叠(collapsed为true)，则隐藏标题文字(display: "none")
            - 如果菜单展开(collapsed为false)，则显示标题文字(display: "inline-block")
            - 这样折叠时只显示Logo，展开时显示Logo+标题
          */}
          
          {t("app:title")}
          {/* 
            t("app:title"): 显示应用标题
            - 中文环境：显示"商医通管理系统"
            - 英文环境：显示"SYT Admin"
          */}
        </span>
      </h1>

      {/* === 主要的导航菜单 === */}
      <Menu
        theme="dark"                    // 菜单主题：深色主题
        mode="inline"                   // 菜单模式：内联模式（子菜单在当前菜单内展开）
        openKeys={openKeys}             // 当前展开的子菜单
        selectedKeys={selectedKeys}     // 当前选中的菜单项
        items={menuItems}               // 菜单项数据（从路由配置生成）
        onClick={handleMenuClick}       // 点击菜单项时的处理函数
        onOpenChange={handleOpenChange} // 展开/收起子菜单时的处理函数
      />
      {/* 
        Menu组件属性详解：
        
        1. theme="dark": 
           - 设置菜单为深色主题，背景是深色，文字是浅色
           - 与整个应用的设计风格保持一致
           
        2. mode="inline":
           - 子菜单在当前菜单内部展开，不会弹出新的层级
           - 比如点击"医院管理"，子菜单会在下方展开显示
           
        3. openKeys={openKeys}:
           - 控制哪些子菜单当前是展开状态
           - 例如：["/syt/hospital"] 表示医院管理子菜单展开
           
        4. selectedKeys={selectedKeys}:
           - 控制哪个菜单项当前被选中（高亮显示）
           - 例如：["/syt/dashboard"] 表示首页菜单被选中
           
        5. items={menuItems}:
           - 菜单的数据源，包含所有菜单项的信息
           - 每个菜单项包含：标题、图标、路径、子菜单等
           
        6. onClick={handleMenuClick}:
           - 用户点击菜单项时触发的函数
           - 会自动跳转到对应的页面
           
        7. onOpenChange={handleOpenChange}:
           - 用户展开或收起子菜单时触发的函数
           - 用来更新openKeys状态
      */}
    </Sider>
  );
}

// ========== 导出组件 ==========
export default SideBar;

/* 
=== 组件功能总结 ===

SideBar组件的主要功能：

1. **菜单显示**：
   - 根据路由配置自动生成导航菜单
   - 支持多级菜单（主菜单 + 子菜单）
   - 显示菜单图标和文字

2. **状态管理**：
   - 折叠/展开菜单
   - 自动展开当前页面对应的父菜单
   - 自动选中当前页面对应的菜单项

3. **页面跳转**：
   - 点击菜单项自动跳转到对应页面
   - 与React Router完美集成

4. **响应式设计**：
   - 大屏幕显示完整菜单
   - 小屏幕自动折叠节省空间

5. **多语言支持**：
   - 菜单标题支持中英文切换
   - 应用标题支持多语言

=== 数据流向 ===

1. **路由配置** → findSideBarRoutes() → **提取菜单路由**
2. **菜单路由** → map() + getItem() → **生成菜单数据**
3. **菜单数据** → Menu组件 → **渲染菜单界面**
4. **用户点击** → handleMenuClick() → **页面跳转**
5. **路由变化** → useEffect() → **更新菜单状态**

=== 在项目中的作用 ===

- 提供统一的导航入口
- 让用户可以快速访问各个功能模块
- 通过视觉反馈告诉用户当前所在位置
- 支持响应式设计，适配不同设备
*/