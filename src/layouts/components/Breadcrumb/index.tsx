// src/layouts/components/Breadcrumb/index.tsx
// 这是面包屑导航组件，显示用户当前在应用中的位置
// 类似网站上常见的：首页 > 产品中心 > 产品详情 这样的导航路径

// ========== 导入React相关功能 ==========
import React from "react";
// React: 核心React库，用于创建组件

// ========== 导入路由相关功能 ==========
import { useLocation, matchPath } from "react-router-dom";
// useLocation: React Router提供的Hook，用来获取当前页面的路由信息
// matchPath: React Router提供的函数，用来匹配路由路径（特别是带参数的动态路由）

// ========== 导入Ant Design UI组件 ==========
import { Breadcrumb } from "antd";
// Breadcrumb: Ant Design的面包屑导航组件，提供美观的导航样式

// ========== 导入路由配置相关功能 ==========
import { findSideBarRoutes } from "@/routes";
// findSideBarRoutes: 自定义函数，从路由配置中获取需要显示在菜单中的路由信息

import { XRoutes } from "@/routes/types";
// XRoutes: 自定义的路由类型定义，确保类型安全

// ========== 创建BreadcrumbItem的别名 ==========
const BreadcrumbItem = Breadcrumb.Item;
// 这样做的目的：
// 1. 简化代码，后面可以直接写 <BreadcrumbItem> 而不是 <Breadcrumb.Item>
// 2. 提高代码可读性
// 3. 如果将来需要替换组件，只需要修改这一行

// ========== 定义查找面包屑标题的函数 ==========
const findBreadcrumbTitle = (pathname: string, routes: XRoutes): any => {
  // 这个函数的作用：根据当前页面路径，找到对应的面包屑标题
  // 参数说明：
  // - pathname: 当前页面的路径，比如 "/syt/hospital/hospitalSet"
  // - routes: 路由配置数组，包含所有路由信息
  // 返回值：包含标题信息的对象，可能有 title 和 childTitle 两个属性

  // === 遍历所有一级路由 ===
  for (let i = 0; i < routes.length; i++) {
    // 获取当前遍历的路由对象
    const route = routes[i];

    // === 检查是否是一级路由的精确匹配 ===
    if (route.path === pathname) {
      // 如果当前路径完全等于一级路由的路径
      // 比如：pathname="/syt/dashboard" 且 route.path="/syt/dashboard"
      
      return {
        title: route.meta?.title as string,
        // 只返回一级标题，没有二级标题
        // 比如：{ title: "首页" }
      };
    }

    // === 检查是否有子路由需要匹配 ===
    if (route.children) {
      // 如果当前一级路由有子路由，需要进一步检查子路由
      
      // 遍历当前一级路由的所有子路由
      for (let j = 0; j < route.children.length; j++) {
        // 获取当前遍历的子路由对象
        const childRoute = route.children[j];

        // === 使用matchPath进行智能路由匹配 ===
        // 为了路由的params参数能匹配上，必须使用matchPath方法
        if (matchPath(childRoute.path as string, pathname)) {
          // matchPath的作用解释：
          // 1. 普通路由匹配："/syt/hospital/hospitalSet" 匹配 "/syt/hospital/hospitalSet"
          // 2. 动态路由匹配："/syt/hospital/hospitalList/show/123" 匹配 "/syt/hospital/hospitalList/show/:id"
          // 3. matchPath会自动处理路径参数（如:id、:hoscode等）
          
          return {
            title: route.meta?.title as string,        // 一级标题（父路由标题）
            childTitle: childRoute.meta?.title,       // 二级标题（子路由标题）
          };
          // 比如：
          // pathname = "/syt/hospital/hospitalSet"
          // 返回：{ title: "医院管理", childTitle: "医院设置" }
          
          // 或者对于动态路由：
          // pathname = "/syt/hospital/hospitalList/show/123"
          // 返回：{ title: "医院管理", childTitle: "显示医院详情" }
        }
      }
    }
  }
  
  // 如果没有找到匹配的路由，函数会返回 undefined
  // 这种情况通常不会发生，因为用户只能访问已定义的路由
};

// ========== 定义主要的面包屑组件 ==========
function BreadcrumbComponent() {
  // 这是面包屑导航组件的主函数

  // === 获取当前页面的路由信息 ===
  const location = useLocation();
  // location对象包含当前页面的各种路由信息：
  // - pathname: 当前路径，如 "/syt/hospital/hospitalSet"
  // - search: 查询参数，如 "?id=123"
  // - hash: 锚点，如 "#section1"
  // - state: 路由状态数据

  // === 提取当前页面路径 ===
  const { pathname } = location;
  // 使用解构赋值从location对象中提取pathname
  // pathname示例："/syt/dashboard"、"/syt/hospital/hospitalSet"、"/syt/hospital/hospitalList/show/123"

  // === 获取需要遍历的路由配置 ===
  const routes = findSideBarRoutes();
  // findSideBarRoutes()的作用：
  // 1. 从完整的路由配置中提取主应用区域的路由（/syt下的所有路由）
  // 2. 过滤掉登录路由、404路由等不需要显示面包屑的路由
  // 3. 返回用于生成左侧菜单和面包屑的路由数组

  // === 生成面包屑导航数据 ===
  const titles = findBreadcrumbTitle(pathname, routes);
  // 调用上面定义的函数，根据当前路径查找对应的标题
  // titles可能的结果：
  // - { title: "首页" } （一级页面）
  // - { title: "医院管理", childTitle: "医院设置" } （二级页面）
  // - undefined （找不到匹配的路由）

  // === 渲染面包屑导航 ===
  return (
    <Breadcrumb style={{ margin: "15px 10px" }}>
      {/* 
        Breadcrumb: Ant Design的面包屑容器组件
        style={{ margin: "15px 10px" }}: 设置外边距
        - 上下15px的间距，让面包屑不会紧贴头部边缘
        - 左右10px的间距，与页面内容保持一致的缩进
      */}

      {/* === 一级面包屑项（父级标题） === */}
      <BreadcrumbItem>{titles.title}</BreadcrumbItem>
      {/* 
        BreadcrumbItem: 单个面包屑项
        {titles.title}: 显示一级标题
        
        显示效果示例：
        - 如果在首页：显示 "首页"
        - 如果在医院设置页：显示 "医院管理"
        - 如果在会员列表页：显示 "会员管理"
      */}

      {/* === 二级面包屑项（子级标题） === */}
      {/* 二级导航可能没有，所以进行判断 */}
      {titles.childTitle && (
        <BreadcrumbItem>{titles.childTitle}</BreadcrumbItem>
      )}
      {/* 
        条件渲染解释：
        1. titles.childTitle: 检查是否有二级标题
        2. &&: 逻辑与操作符，只有当前面的条件为真时，才渲染后面的组件
        3. 如果没有二级标题（如首页），这个组件不会被渲染
        
        显示效果示例：
        - 首页：只显示 "首页"
        - 医院设置页：显示 "医院管理 > 医院设置"
        - 会员列表页：显示 "会员管理 > 会员列表"
        - 医院详情页：显示 "医院管理 > 显示医院详情"
      */}
    </Breadcrumb>
  );
}

// ========== 导出组件 ==========
export default BreadcrumbComponent;

/* 
=== 面包屑导航的工作原理 ===

1. **路径分析**：
   - 获取当前页面路径：/syt/hospital/hospitalSet
   - 在路由配置中查找匹配的路由

2. **路由匹配过程**：
   ```
   当前路径：/syt/hospital/hospitalSet
   
   第一层匹配：
   - /syt/dashboard ❌ 不匹配
   - /syt/hospital ❌ 不完全匹配，但有子路由，继续检查
   
   第二层匹配（/syt/hospital的子路由）：
   - /syt/hospital/hospitalSet ✅ 匹配成功！
   
   结果：
   - 父路由标题：医院管理
   - 子路由标题：医院设置
   ```

3. **动态路由处理**：
   ```
   当前路径：/syt/hospital/hospitalList/show/123
   配置路径：/syt/hospital/hospitalList/show/:id
   
   使用matchPath匹配：
   - 普通字符串匹配："/syt/hospital/hospitalList/show/" ✅
   - 参数匹配：":id" 匹配 "123" ✅
   - 整体匹配成功！
   
   结果：
   - 父路由标题：医院管理
   - 子路由标题：显示医院详情
   ```

=== 为什么需要面包屑导航？ ===

1. **用户定位**：让用户清楚知道自己在应用中的位置
2. **快速导航**：用户可以快速返回上级页面
3. **层级关系**：清晰展示页面的层级结构
4. **用户体验**：符合用户对后台管理系统的使用习惯

=== 实际显示效果 ===

不同页面的面包屑显示：

```
首页：
首页

医院设置页：
医院管理 > 医院设置

医院列表页：
医院管理 > 医院列表

医院详情页（动态路由）：
医院管理 > 显示医院详情

会员列表页：
会员管理 > 会员列表

订单详情页（动态路由）：
订单管理 > 订单列表
```

=== matchPath的重要性 ===

matchPath函数解决了动态路由的匹配问题：

**不使用matchPath的问题**：
```javascript
// 简单字符串比较
if (childRoute.path === pathname) {
  // 这种方式无法匹配动态路由
  // "/syt/hospital/hospitalList/show/:id" !== "/syt/hospital/hospitalList/show/123"
}
```

**使用matchPath的优势**：
```javascript
// 智能路由匹配
if (matchPath(childRoute.path, pathname)) {
  // 可以正确匹配动态路由
  // matchPath("/syt/hospital/hospitalList/show/:id", "/syt/hospital/hospitalList/show/123") = true
}
```

这样，无论用户访问哪个医院的详情页，面包屑都能正确显示"医院管理 > 显示医院详情"。

=== 总结 ===

Breadcrumb组件虽然功能看似简单，但实现了：
- 智能路由匹配（包括动态路由）
- 层级关系展示
- 用户友好的导航体验
- 与整体应用架构的完美集成

这体现了良好的组件设计：功能专一、逻辑清晰、易于维护。
*/