// src/layouts/components/Avatar/index.tsx
// 这是用户头像组件，显示在页面右上角，提供用户相关的操作功能
// 主要功能：显示用户头像、下拉菜单（返回首页、退出登录）

// ========== 导入React相关功能 ==========
import React from "react";
// React: 核心React库，用于创建组件

// ========== 导入路由相关功能 ==========
import { Link, useNavigate } from "react-router-dom";
// Link: React Router提供的链接组件，用于页面跳转（声明式跳转）
// useNavigate: React Router提供的Hook，用于编程式页面跳转

// ========== 导入Ant Design UI组件 ==========
import { Menu, Dropdown, Button } from "antd";
// Menu: Ant Design的菜单组件，用来创建下拉菜单
// Dropdown: Ant Design的下拉组件，提供下拉弹出效果
// Button: Ant Design的按钮组件，这里用作头像的容器

// ========== 导入Redux状态管理 ==========
import { useAppSelector, useAppDispatch } from "@/app/hooks";
// useAppSelector: 自定义Hook，用来从Redux全局状态中读取数据
// useAppDispatch: 自定义Hook，用来向Redux发送操作指令

import { selectUser, logoutAsync } from "@/pages/login/slice";
// selectUser: 选择器函数，用来从Redux中获取用户信息（头像、姓名等）
// logoutAsync: 异步操作函数，用来处理用户退出登录

// ========== 导入样式文件 ==========
import "./index.less";
// 导入这个组件专用的CSS样式文件，控制头像的大小、形状等

// ========== 定义Avatar组件 ==========
function AvatarComponent() {
  // 这是用户头像组件的主函数，包含用户相关操作的逻辑

  // === 获取页面跳转功能 ===
  const navigator = useNavigate();
  // navigator: 页面跳转函数
  // 用法：navigator("/login") 会跳转到登录页面
  // 这里主要用于退出登录后跳转到登录页面

  // === 从Redux获取用户头像 ===
  const { avatar } = useAppSelector(selectUser);
  // 解释这行代码：
  // 1. useAppSelector(selectUser): 从Redux全局状态中获取用户信息
  // 2. { avatar }: 使用解构赋值，只提取用户头像信息
  // 3. avatar: 最终得到的用户头像URL，比如："https://example.com/avatar.jpg"
  // 这个头像信息是在用户登录成功后，通过getUserInfoAsync从服务器获取并存储在Redux中的

  // === 获取Redux操作函数 ===
  const dispatch = useAppDispatch();
  // dispatch: 用来向Redux发送指令的函数
  // 比如：dispatch(logoutAsync()) 会触发退出登录的操作

  // === 定义退出登录处理函数 ===
  const handleLogout = async () => {
    // 这个函数在用户点击"退出登录"时被调用
    // async: 声明这是一个异步函数，因为退出登录需要发送网络请求

    // 第一步：发送退出登录请求
    await dispatch(logoutAsync());
    // 解释这行代码：
    // 1. dispatch(logoutAsync()): 向Redux发送退出登录指令
    // 2. logoutAsync(): 这是一个异步操作，会：
    //    - 向服务器发送退出登录请求
    //    - 清空Redux中的用户信息（token、name、avatar）
    //    - 清除localStorage中的token
    // 3. await: 等待退出登录操作完成后再继续执行

    // 第二步：跳转到登录页面
    navigator("/login");
    // 退出登录成功后，自动跳转到登录页面
    // 这样用户就需要重新输入账号密码才能访问系统
  };

  // === 定义下拉菜单内容 ===
  const menu = (
    // 这里定义了点击头像后显示的下拉菜单内容
    <Menu>
      {/* Menu: Ant Design的菜单容器 */}

      {/* 第一个菜单项：返回首页 */}
      <Menu.Item key="0">
        {/* 
          Menu.Item: 单个菜单项
          key="0": 菜单项的唯一标识符，用于区分不同的菜单项
        */}
        
        <Link to="/syt/dashboard">返回首页</Link>
        {/* 
          Link组件：声明式路由跳转
          to="/syt/dashboard": 点击后跳转到首页
          "返回首页": 菜单项显示的文字
          
          为什么用Link而不用navigator？
          - Link适合简单的页面跳转
          - navigator适合需要先执行其他操作再跳转的场景
        */}
      </Menu.Item>

      {/* 第二个菜单项：退出登录 */}
      <Menu.Item key="1">
        {/* key="1": 第二个菜单项的唯一标识符 */}

        <div onClick={handleLogout}>退出登录</div>
        {/* 
          div + onClick：手动处理点击事件
          onClick={handleLogout}: 点击时调用退出登录函数
          "退出登录": 菜单项显示的文字
          
          为什么用div而不用Link？
          - 因为退出登录需要先执行清理操作（清除用户信息）
          - 然后才能跳转到登录页面
          - 这种复杂逻辑更适合用onClick处理
        */}
      </Menu.Item>
    </Menu>
  );

  // === 渲染头像和下拉菜单 ===
  return (
    <Dropdown 
      overlay={menu}          // 下拉菜单的内容（上面定义的menu组件）
      trigger={["click"]}     // 触发下拉菜单的方式：点击
    >
      {/* 
        Dropdown组件：提供下拉弹出效果的容器
        
        属性解释：
        1. overlay={menu}: 
           - 指定下拉弹出的内容
           - 当用户点击头像时，会显示上面定义的menu

        2. trigger={["click"]}:
           - 指定触发下拉菜单的方式
           - ["click"]: 点击时触发
           - 还可以设置为 ["hover"] 鼠标悬停触发
           - 或者 ["click", "hover"] 点击或悬停都可以触发
      */}

      {/* 头像按钮 */}
      <Button 
        className="layout-dropdown-link"  // 应用CSS样式类
        type="link"                       // 按钮类型：链接样式（没有边框和背景）
      >
        {/* 
          Button组件：作为头像的容器
          
          属性解释：
          1. className="layout-dropdown-link":
             - 应用自定义CSS样式
             - 在index.less文件中定义了按钮的高度等样式

          2. type="link":
             - 设置按钮为链接样式
             - 看起来像普通文字或图片，没有按钮的边框和背景
             - 鼠标悬停时会有简单的视觉反馈
        */}

        {/* 用户头像图片 */}
        <img 
          className="layout-avatar"  // 应用CSS样式类
          src={avatar}               // 图片源地址（从Redux获取的用户头像URL）
          alt="avatar"               // 图片无法显示时的替代文字
        />
        {/* 
          img标签：显示用户头像图片
          
          属性解释：
          1. className="layout-avatar":
             - 应用自定义CSS样式
             - 在index.less中定义了头像的宽度(40px)、高度(40px)、圆角等

          2. src={avatar}:
             - 图片的源地址
             - avatar变量来自Redux，包含用户头像的URL
             - 比如："https://example.com/user-avatar.jpg"

          3. alt="avatar":
             - 当图片无法加载时显示的替代文字
             - 对于屏幕阅读器等辅助工具也很重要
        */}
      </Button>
    </Dropdown>
  );
}

// ========== 导出组件 ==========
export default AvatarComponent;

/* 
=== 组件功能总结 ===

Avatar组件的主要功能：

1. **显示用户头像**：
   - 从Redux获取用户头像URL
   - 显示在页面右上角
   - 头像为圆角矩形样式（40x40像素）

2. **下拉菜单功能**：
   - 点击头像显示下拉菜单
   - 菜单包含两个选项：返回首页、退出登录

3. **页面跳转**：
   - "返回首页"：直接跳转到首页
   - "退出登录"：先清理用户数据，再跳转到登录页

4. **用户状态管理**：
   - 与Redux深度集成
   - 退出时清空所有用户信息
   - 清除localStorage中的登录凭证

=== 数据流向 ===

1. **头像显示**：
   - 用户登录成功 → getUserInfoAsync() → 从服务器获取头像
   - 头像URL存储到Redux → useAppSelector() → Avatar组件显示

2. **退出登录**：
   - 用户点击"退出登录" → handleLogout() → dispatch(logoutAsync())
   - 发送退出请求到服务器 → 清空Redux用户信息 → 清除localStorage
   - navigator("/login") → 跳转到登录页面

=== 在项目中的作用 ===

- **用户身份标识**：让用户知道当前登录的是谁
- **快捷操作入口**：提供常用功能的快速访问
- **安全退出机制**：安全地清理用户会话信息
- **用户体验提升**：符合用户对后台管理系统的使用习惯

=== CSS样式说明 ===

在 index.less 文件中定义的样式：

```less
.layout-dropdown-link {
  height: 50px!important;  // 按钮容器高度
}

.layout-avatar {
  width: 40px;             // 头像宽度
  height: 40px;            // 头像高度
  border-radius: 10px;     // 圆角效果
}
```

这些样式确保头像在不同浏览器和设备上都有一致的外观。
*/