// 这个文件是一个"权限检查守门员"组件
// 它的作用是检查用户是否有权限访问某个页面
// 就像小区门口的保安，检查你是否有门禁卡才能进入

// 导入React的FC类型，FC是FunctionComponent的缩写，表示函数组件的类型
import { FC } from "react";

// 导入路由相关的功能
// useLocation: 获取当前页面的路径地址，比如"/login"或"/dashboard"
// Navigate: 用来跳转到其他页面的组件，类似于重定向
import { useLocation, Navigate } from "react-router-dom";

// 导入Ant Design的加载动画组件
// Spin组件会显示一个转圈的加载动画，告诉用户"正在加载中，请稍等"
import { Spin } from "antd";

// 导入自定义的Redux hooks（数据管理工具）
// useAppSelector: 用来从Redux数据仓库中读取数据
// useAppDispatch: 用来向Redux发送指令（比如"请求用户数据"）
import { useAppSelector, useAppDispatch } from "@/app/hooks";

// 导入用户相关的Redux操作和数据选择器
// getUserInfoAsync: 异步操作，用来从服务器获取用户详细信息
// selectUser: 选择器函数，用来从Redux中提取用户数据
import { getUserInfoAsync, selectUser } from "@/pages/login/slice";

/*
  ==================== 高阶组件概念说明 ====================
  高阶组件HOC (Higher-Order Component) 的概念解释：
  - 本质上是一个函数，接受一个组件作为参数，返回一个新的"增强版"组件
  - 就像给原组件"穿上一件外套"，外套提供了额外的功能（这里是权限检查）
  - 原组件不需要改动，高阶组件负责包装和增强功能

  在这个项目中的应用场景：
  WrappedComponent 组件是哪个？这取决于当前的路由路径（地址）：
      /login --> EmptyLayout/Login (登录页面)
      /syt/dashboard --> Layout/Dashboard (仪表板页面)
      /syt/hospital --> Layout/Hospital (医院管理页面)
      等等...
*/

// 定义并导出权限检查高阶组件函数
// WrappedComponent: 被包装的原始组件，比如Login组件、Dashboard组件等
function withAuthorization(WrappedComponent: FC) {
  // 返回一个新的函数组件，这个组件具有权限检查功能
  return () => {
    /*
      ==================== 权限检查逻辑说明 ====================
      整体的权限检查策略：

      当用户已经登录过（有token）时：
        - 如果访问首页或其他需要登录的页面 → 没问题，正常显示
          - 但还要判断是否有用户详细数据（姓名、头像等）
            - 有完整数据 → 直接显示页面
            - 没有详细数据 → 显示加载动画，同时请求用户数据
        - 如果访问登录页面 → 自动跳转到首页（因为已经登录了，不需要再登录）

      当用户没有登录过（没有token）时：
        - 如果访问首页或其他需要登录的页面 → 跳转到登录页面重新登录
        - 如果访问登录页面 → 没问题，正常显示登录表单
    */

    // 从Redux数据仓库中获取用户的登录状态信息
    // token: 用户的登录凭证，有token说明用户已登录
    // name: 用户的姓名，有name说明已经获取了用户的详细信息
    const { token, name } = useAppSelector(selectUser);

    // 获取当前页面的路径地址
    // pathname就是浏览器地址栏中的路径部分
    // 比如: https://example.com/login → pathname就是"/login"
    const { pathname } = useLocation();

    // ==================== 权限检查开始 ====================

    // 第一种情况：用户已经登录（有token）
    if (token) {
      // 说明用户之前已经成功登录过

      // 检查用户是否正在访问登录页面或根路径
      if (pathname === "/login" || pathname === "/") {
        // 用户已经登录了，但还在访问登录页面，这没有意义
        // 自动跳转到系统的主页面（仪表板）
        // Navigate组件会触发页面跳转，用户会看到地址栏变化
        return <Navigate to="/syt/dashboard" />;
      }

      // 执行到这里说明：用户已登录 + 访问的不是登录页面
      // 现在需要检查是否已经获取了用户的详细信息

      // 判断是否有用户的详细数据（姓名）
      if (name) {
        // 有完整的用户信息，一切正常
        // 渲染原始组件，让用户正常使用页面
        return <WrappedComponent />;
      }

      // 执行到这里说明：用户已登录 + 访问正确页面 + 但没有用户详细信息
      // 这种情况通常发生在：页面刷新后token还在，但用户详细信息丢失了

      // 获取dispatch函数，用来向Redux发送操作指令
      const dispatch = useAppDispatch();

      // 发送请求获取用户详细信息
      // 这是一个异步操作，会向服务器发送请求
      dispatch(getUserInfoAsync());

      // 在等待服务器响应期间，显示加载动画
      // size="large"表示显示较大的加载图标
      // 用户会看到一个转圈的动画，知道系统正在加载数据
      return <Spin size="large" />;
      
    } else {
      // 第二种情况：用户没有登录（没有token）
      // 说明用户还没有登录过，或者登录状态已经过期

      // 检查用户是否正在访问登录页面
      if (pathname === "/login") {
        // 用户没有登录，正在访问登录页面，这是正确的流程
        // 渲染原始组件（登录页面），让用户可以输入用户名密码登录
        return <WrappedComponent />;
      }

      // 执行到这里说明：用户没有登录 + 试图访问需要登录的页面
      // 这是不被允许的，需要强制跳转到登录页面

      // 自动跳转到登录页面
      // 用户会看到地址栏变为"/login"，并显示登录表单
      return <Navigate to="/login" />;
    }
  };
}

// 导出这个高阶组件，供其他文件使用
// 其他组件可以这样使用：export default withAuthorization(MyComponent);
export default withAuthorization;