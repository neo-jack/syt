// src/pages/dashboard/index.tsx
// 这是整个应用的首页（仪表板）组件，用户登录后看到的第一个页面

// ========== 导入React相关功能 ==========
import React from "react";
// React: 这是React库的核心，虽然新版本不强制导入，但为了兼容性还是建议导入

// ========== 导入国际化（多语言）功能 ==========
import { useTranslation } from "react-i18next";
// useTranslation: 这是一个Hook（钩子），用来获取多语言翻译功能
// 通过这个Hook，页面可以根据用户选择的语言显示中文或英文

// ========== 导入UI组件 ==========
import { Card } from "antd";
// Card: Ant Design提供的卡片组件，类似一个带边框和阴影的容器
// 可以让内容看起来更整洁美观

// ========== 导入Redux相关功能 ==========
import { useAppSelector } from "@/app/hooks";
// useAppSelector: 自定义的Hook，用来从Redux全局状态中获取数据
// Redux是状态管理工具，可以让不同组件共享数据

import { selectUser } from "@/pages/login/slice";
// selectUser: 选择器函数，专门用来从Redux中获取用户信息
// 比如用户的姓名、ID等登录后保存的信息

// ========== 定义Dashboard组件 ==========
function Dashboard() {
  // 这是一个函数组件，代表整个首页的内容和逻辑

  // === 获取多语言翻译功能 ===
  const { t } = useTranslation(["app"]);
  // useTranslation(["app"]) 的含义：
  // - useTranslation: 获取翻译功能
  // - ["app"]: 指定使用哪个翻译文件，这里使用 app.ts 文件
  // - t: 翻译函数，t("dashboard") 会根据当前语言返回对应文字
  //   中文时返回"首页"，英文时返回"Dashboard"

  // === 从Redux获取用户信息 ===
  const { name } = useAppSelector(selectUser);
  // 解释这行代码：
  // - useAppSelector(selectUser): 从Redux全局状态中获取用户信息
  // - selectUser: 选择器，告诉Redux要获取哪些用户数据
  // - { name }: 解构赋值，只提取用户姓名这一个字段
  // - name: 最终得到的用户姓名，比如"张三"、"admin"等

  // === 渲染页面内容 ===
  return (
    // Card组件：创建一个卡片容器来包装页面内容
    <Card style={{ minHeight: "calc(100vh - 64px)" }}>
      {/* 
        style属性：设置卡片的样式
        minHeight: "calc(100vh - 64px)" 的含义：
        - 100vh: 表示视口（浏览器窗口）的完整高度
        - 64px: 减去头部导航栏的高度
        - calc(): CSS计算函数，用来计算最终高度
        - 效果：让卡片占满除导航栏外的整个屏幕高度
      */}

      {/* 第一个标题：显示"首页"或"Dashboard" */}
      <h2>{t("dashboard")}</h2>
      {/* 
        解释：
        - h2: HTML标题标签，显示二级标题
        - {t("dashboard")}: JavaScript表达式，在JSX中用{}包裹
        - t("dashboard"): 调用翻译函数
          - 如果当前语言是中文，显示"首页"
          - 如果当前语言是英文，显示"Dashboard"
      */}

      {/* 第二个标题：显示用户名 */}
      <h2>用户名: {name}</h2>
      {/* 
        解释：
        - "用户名: ": 固定的中文文字
        - {name}: 动态显示从Redux获取的用户姓名
        - 最终效果：比如显示"用户名: 张三"或"用户名: admin"
        
        注意：这里的"用户名"是写死的中文，没有使用翻译功能
        如果要支持多语言，应该改为：{t("username")}: {name}
      */}
    </Card>
  );
}

// ========== 导出组件 ==========
export default Dashboard;
// 将Dashboard组件作为默认导出，这样其他文件就可以通过 import Dashboard from "./index" 来使用这个组件

/* 
=== 组件功能总结 ===
这个Dashboard组件的主要功能：

1. 显示应用首页内容
2. 展示当前登录用户的姓名
3. 支持多语言（中文/英文）
4. 使用卡片布局让页面更美观
5. 自适应屏幕高度

=== 数据流向 ===
1. 用户在登录页面输入账号密码
2. 登录成功后，用户信息被保存到Redux中
3. Dashboard组件通过useAppSelector从Redux获取用户姓名
4. 页面显示用户姓名，让用户知道自己已经登录成功

=== 在项目中的位置 ===
- 路由路径：/syt/dashboard
- 在左侧菜单中显示为"首页"
- 是用户登录后看到的第一个页面
- 通常包含系统概览、快捷入口等内容（目前比较简单）
*/