// 从 antd 组件库导入 ConfigProvider，它是一个全局配置组件，用于统一设置其子组件的国际化、主题等。
import { ConfigProvider } from "antd";
// 导入 antd 提供的中文语言包。
import zhCN from "antd/lib/locale/zh_CN";
// 导入 antd 提供的英文语言包。
import enUS from "antd/lib/locale/en_US";

// 从自定义的 hooks 文件中导入 useAppSelector，这是一个带有 TypeScript 类型的 `useSelector` 版本，能提供更好的代码提示。
import { useAppSelector } from "@/app/hooks";
// 从 app 的 slice 中导入 selectLang，这是一个选择器函数，用于从 Redux store 中精确地获取语言状态。
import { selectLang } from "@/app/appSlice";

// 从路由配置文件中导入 useAppRoutes 这个自定义 Hook，它负责根据当前状态返回正确的路由配置。
import { useAppRoutes } from "./routes";

// 定义应用的根组件 App。它是一个函数组件。
function App() {
  // 1. 使用 Hook 从 Redux store 获取状态：
  // 调用 useAppSelector 并传入 selectLang 选择器，
  // 这会从全局 Redux store 中订阅并获取 state.app.lang 的值。
  // 当这个值变化时，App 组件会自动重新渲染。
  const lang = useAppSelector(selectLang);

  // 2. 返回要渲染的 JSX：
  // return 语句描述了 App 组件的 UI 结构。
  return (
    // 使用 ConfigProvider 包裹整个应用，它的 locale 属性可以为所有 antd 子组件提供统一的语言配置。
    // 这里使用了一个三元运算符来动态地决定使用哪个语言包：
    // 如果从 Redux 获取的 lang 状态是 "zh_CN"，则使用中文语言包 zhCN，否则使用英文语言包 enUS。
    <ConfigProvider locale={lang === "zh_CN" ? zhCN : enUS}>
      {
        /*
          3. 渲染路由：
          在这里直接调用 useAppRoutes() 这个自定义 Hook。
          这个 Hook 会根据当前 URL 和用户权限等信息，计算并返回当前应该被渲染的页面组件（React 元素）。
          例如，如果 URL 是 /login，它可能返回 <Login />；如果 URL 是 /syt/dashboard，它可能返回一个包含了 <Dashboard /> 的 <Layout />。
          这种写法使得 App 组件的逻辑非常简洁，将复杂的路由判断和渲染逻辑都封装在了 useAppRoutes Hook 内部。
        */
        useAppRoutes()
      }
    </ConfigProvider>
  );
}

// 将 App 组件作为默认导出，以便在 src/index.tsx 中导入和使用。
export default App;
