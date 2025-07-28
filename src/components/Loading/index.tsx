// 从 "react" 库中导入 React 和 useEffect。
// React 是使用 JSX 和组件化思想构建界面的基础。
// useEffect 是一个 React Hook，它允许你在函数组件中执行“副作用”，比如操作 DOM（就像这个文件做的一样）。
import React, { useEffect } from "react";
// 导入 "nprogress" 库。NProgress 是一个轻量级的 JavaScript 库，
// 可以在页面顶部创建一个纤细的、类似 YouTube 加载动画的进度条。
import NProgress from "nprogress";
// 导入 NProgress 库自带的 CSS 样式文件。
// 如果不导入这个 CSS 文件，进度条将不会有任何样式，也就看不到了。
import "nprogress/nprogress.css";

// 对 NProgress进行全局配置。
NProgress.configure({
  // `showSpinner: false` 这个选项的意思是：在显示进度条时，不要显示那个默认的、旋转的加载小圆圈（spinner）。
  // 这样做可以让界面更简洁，只保留顶部的进度条。
  showSpinner: false,
});

// 定义一个名为 `Loading` 的函数组件。
// 这个组件的用途很特别：它本身在页面上是不可见的，它的唯一作用就是控制 NProgress 进度条的开始和结束。
// 它通常与 React.Suspense 和 React.lazy 一起使用，当一个组件正在被懒加载时，显示这个 Loading 组件作为临时占位符。
function Loading() {
  // 这行代码会在 `Loading` 组件开始渲染时立即执行。
  // `NProgress.start()` 的作用是让进度条在页面顶部出现，并开始从左到右移动。
  NProgress.start();

  // 使用 useEffect Hook。
  // Hook 里的代码会在组件成功渲染到屏幕上之后执行。
  useEffect(() => {
    // `NProgress.done()` 的作用是让进度条动画完成（快速移动到 100%），然后平滑地消失。
    NProgress.done();
    // `useEffect` 的第二个参数是一个空数组 `[]`，这告诉 React：这个 effect 只需要在组件第一次挂载（mount）后运行一次即可，
    // 后续即使组件更新也不要再运行了。
  }, []);

  // 这个组件返回一个空的 React 片段（Fragment）。
  // 这意味着该组件本身不会在页面上渲染出任何可见的 HTML 元素。
  // 它的所有工作都是通过调用 NProgress 的方法（副作用）来完成的。
  return <></>;
}

// 总结一下这个组件的工作流程：
// 1. 当 React 需要显示这个 Loading 组件时，它开始渲染。
// 2. 在渲染过程中，`NProgress.start()` 被调用，进度条出现。
// 3. 组件渲染完成，但在页面上是空的。
// 4. 渲染完成后，`useEffect` 被触发，`NProgress.done()` 被调用，进度条消失。
// 整个过程发生得非常快，所以效果就是进度条会快速地在屏幕顶部“闪现”一下。

// 使用 `export default` 将 `Loading` 组件导出，以便在项目的其他地方（比如路由配置中）使用它。
export default Loading;
