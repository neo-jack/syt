// 从 'react' 包中导入 React 核心库，这是编写任何 React 组件所必需的。
import React from "react";
// 从 'react-dom/client' 导入 createRoot，这是 React 18 推荐的、用于创建应用根节点的新 API。
import { createRoot } from "react-dom/client";
// 从 'react-router-dom' 导入 BrowserRouter，它是实现客户端路由的基础组件，利用浏览器的 History API 来同步 UI 和 URL。
import { BrowserRouter } from "react-router-dom";

// 从 Redux Toolkit 的核心库导入 Provider，用于将 Redux store 提供给整个应用。
import { Provider } from "react-redux";
// 从我们自己配置的 store 文件中导入 store 实例，这是应用的“单一数据源”。
import { store } from "./app/store";

// 导入应用的根组件 App。所有其他组件和页面都将是 App 组件的子组件。
import App from "./App";

// 导入并执行国际化（i18n）的配置文件。
// 这种 "import '...'" 的写法不导入任何变量，其主要目的是执行该文件中的代码，以完成初始化配置。
import "./locales/i18n";

// 导入 Ant Design 组件库的全局样式文件（Less 格式），以确保组件能正确显示。
import "antd/dist/antd.less";
// 导入我们自己定义的其他全局样式，例如一些基础样式重置或公共工具类。
import "./styles/index.css";

// 1. 查找挂载点：
// 通过 document.getElementById('root') 找到 public/index.html 文件中的那个 <div id="root"></div> 元素。
// 2. 创建根节点：
// 使用 createRoot API 在这个 DOM 节点上创建一个 React 根，后续的所有渲染都将在这个根上进行。
const root = createRoot(document.getElementById("root") as HTMLElement);

// 3. 渲染应用：
// 调用 root.render() 方法，将我们的组件树渲染到根节点中。
// render 的作用是将 JSX 描述的组件结构，转换成真实的 HTML DOM 元素并插入到页面中。
root.render(
  // <React.StrictMode> 是一个辅助组件，用于在开发模式下识别和警告潜在的问题，它不会在生产环境中渲染任何可见的 UI。
  // <React.StrictMode>
  
  // 使用 <BrowserRouter> 作为最外层组件，为整个应用开启客户端路由功能。
  // 任何需要使用路由功能（如 <Link>, useRoutes）的组件都必须被它包裹。
  <BrowserRouter>
    {/* 
      使用 <Provider> 组件包裹 App，并将 store 实例通过 prop 传入。
      这使得 App 组件及其所有后代组件都能够通过 hooks（如 useSelector, useDispatch）访问到 Redux store。
    */}
    <Provider store={store}>
      {/* 
        <App /> 是我们应用的根组件，所有的页面和UI都从这里开始渲染。
      */}
      <App />
    </Provider>
  </BrowserRouter>

  // </React.StrictMode>
);