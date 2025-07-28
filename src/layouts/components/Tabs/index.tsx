// 导入 React 中需要使用的钩子函数和类型。
// useState 用于在函数组件中管理状态。
// useEffect 用于处理副作用，比如数据获取、订阅或手动更改 DOM。
// MouseEvent 是 TypeScript 的类型，用于描述鼠标事件对象。
import { useState, useEffect, MouseEvent } from "react";
// 导入 react-router-dom 提供的钩子函数和工具。
// useLocation 用于获取当前 URL 的信息。
// useNavigate 用于实现编程式导航（即在代码中跳转路由）。
// matchPath 用于比较一个路径和一个模式是否匹配。
import { useLocation, useNavigate, matchPath } from "react-router-dom";

// 导入子组件 Tab，这个组件负责渲染单个标签页。
import Tab from "./components/Tab";
// 导入应用的路由配置信息。
import routes from "@/routes";
// 导入路由配置的 TypeScript 类型定义，增强代码的健壮性。
import { XRoutes, XMeta } from "@/routes/types";
// 导入用于国际化（多语言）的翻译组件。
import Translation from "@comps/Translation";

// 导入标签页数组的 TypeScript 类型定义。
import { TabsType } from "./types";

// 导入组件的样式文件，使用 Less 预处理器。
import "./index.less";

// 定义标签页的初始状态。
// 这是一个数组，里面包含一个默认的、不可关闭的“仪表盘”或“首页”标签页。
const initTabs: TabsType = [
  {
    key: "/syt/dashboard", // 标签页的唯一标识，通常和路径一致。
    path: "/syt/dashboard", // 标签页对应的路由路径。
    title: <Translation>route:dashboard</Translation>, // 标签页的标题，这里使用了翻译组件。
    closable: false, // `false` 表示这个标签页不能被关闭。
  },
];

// 定义一个辅助函数 `findTitle`，用于根据给定的路径名（pathname）在路由配置中查找对应的标题。
// 这个函数会递归地搜索路由数组。
const findTitle = (routes: XRoutes, pathname: string) => {
  // 遍历路由配置数组中的每一个路由对象。
  for (let i = 0; i < routes.length; i++) {
    // 获取当前遍历到的路由对象。
    const route = routes[i];
    // 检查当前路由是否有子路由。
    if (route.children) {
      // 如果有子路由，就递归调用 `findTitle` 函数在子路由中查找。
      const title = findTitle(route.children, pathname) as string;
      // 如果在子路由中找到了标题，就立即返回这个标题。
      if (title) return title;
    } else {
      // 如果没有子路由，就检查当前路由的路径是否与给定的 `pathname` 匹配。
      // `matchPath` 是 react-router-dom 提供的函数，可以处理带参数的动态路由。
      if (matchPath(route.path as string, pathname)) {
        // 如果路径匹配，就返回该路由的 meta 信息中定义的标题。
        return (route.meta as XMeta).title as string;
      }
    }
  }
};

// 定义 Tabs 组件，这是一个函数式组件。
function Tabs() {
  // 使用 useState 创建一个状态 `tabs`，用于存储当前所有打开的标签页。
  // `setTabs` 是更新这个状态的函数。初始值为 `initTabs`。
  const [tabs, setTabs] = useState(initTabs);

  // 使用 useState 创建一个状态 `oldPathname`，用于记录上一次的路径。
  // 这有助于在 `useEffect` 中判断路径是否真的发生了变化。
  const [oldPathname, setOldPathname] = useState("");
  // 使用 useState 创建一个状态 `activeIndex`，用于记录当前活动（高亮）的标签页的索引。
  const [activeIndex, setActiveIndex] = useState(0);

  // 使用 react-router-dom 的 `useLocation` 钩子获取当前页面的 `pathname`（路径部分）。
  const { pathname } = useLocation();
  // 使用 react-router-dom 的 `useNavigate` 钩子获取一个 `navigate` 函数，用于页面跳转。
  const navigate = useNavigate();

  // 使用 useEffect 钩子来处理路由变化时的副作用。
  // 当 `pathname`（当前路径）变化时，这个钩子里的函数就会执行，从而实现动态添加新标签页的功能。
  // 依赖项数组 `[pathname, tabs, oldPathname]` 表示只有当这些值变化时，effect 才会重新运行。
  useEffect(() => {
    // 如果当前路径和旧路径相同，说明不是路由切换，直接返回，不做任何操作。
    if (pathname === oldPathname) return;

    // 在已有的标签页中查找当前路径是否已经存在。
    // `findIndex` 会返回第一个满足条件的元素的索引，如果找不到则返回 -1。
    const newActiveIndex = tabs.findIndex((tab) => tab.path === pathname);

    // 更新旧路径状态为当前路径，为下一次比较做准备。
    setOldPathname(pathname);

    // 如果 `newActiveIndex` 大于等于 0，说明标签页已经存在。
    if (newActiveIndex >= 0) {
      // 只需要将该标签页设置为活动状态即可。
      setActiveIndex(newActiveIndex);
      // 然后返回，不再执行后续的添加新标签页的逻辑。
      return;
    }

    // 如果标签页不存在，就调用 `findTitle` 函数查找新路径对应的标题。
    const title = findTitle(routes, pathname) as string;
    // 如果找不到标题（可能是一些不需要显示在标签页中的路由），就直接返回。
    if (!title) {
      return;
    }

    // 如果找到了标题，就创建一个新的标签页对象，并将其添加到 `tabs` 数组中。
    // 使用展开语法 `...tabs` 来复制旧的 `tabs` 数组，并在末尾添加新项。
    setTabs([
      ...tabs,
      {
        key: pathname, // 唯一键
        path: pathname, // 路径
        title, // 标题
        closable: true, // 新标签页默认是可以关闭的
      },
    ]);

    // 将新添加的标签页设置为活动状态。它的索引就是当前 `tabs` 数组的长度。
    setActiveIndex(tabs.length);
  }, [pathname, tabs, oldPathname]); // effect 的依赖项

  // 定义右键菜单事件的处理函数。
  const handleContextMenu = (e: MouseEvent) => {
    // `e.preventDefault()` 会阻止浏览器的默认行为，即阻止默认的右键菜单弹出。
    e.preventDefault();
  };

  // 定义关闭单个标签页的函数。
  const close = (index: number) => {
    // 使用 `filter` 方法创建一个新的 `tabs` 数组，排除掉要关闭的那个标签页。
    const newTabs = tabs.filter((tab, i) => index !== i);
    // 更新 `tabs` 状态。
    setTabs(newTabs);

    // 判断关闭的是否是当前正活动的标签页。
    if (activeIndex === index) {
      // 如果是，需要决定下一个活动标签页是哪个。
      // 这里设置为新标签页数组的最后一个。
      const lastTab = newTabs[newTabs.length - 1];
      // 更新旧路径，这会影响 `useEffect` 的行为。
      setOldPathname(lastTab.path);
      // 将最后一个标签页设为活动状态。
      setActiveIndex(newTabs.length - 1);
      // 使用 `navigate` 函数跳转到这个标签页对应的路由。
      navigate(lastTab.path);
    } else if (activeIndex > index) {
      // 如果关闭的标签页在当前活动标签页的前面，
      // 那么活动标签页的索引需要减 1。
      setActiveIndex(activeIndex - 1);
    }
  };

  // 定义关闭其他标签页的函数。
  const closeOthers = (index: number) => {
    // 保留当前点击的标签页（由 `index` 决定）和首页（索引为 0）。
    const newTabs = tabs.filter((tab, i) => index === i || i === 0);
    // 更新 `tabs` 状态。
    setTabs(newTabs);
    // 获取新的标签页数组的最后一个元素（也就是当前点击的那个）。
    const lastTab = newTabs[newTabs.length - 1];
    // 更新旧路径。
    setOldPathname(lastTab.path);
    // 更新活动索引为新的数组的最后一个。
    setActiveIndex(newTabs.length - 1);
    // 跳转到当前标签页的路径。
    navigate(lastTab.path);
  };

  // 定义关闭所有标签页的函数。
  const closeAll = () => {
    // 只保留首页（索引为 0 的标签页）。
    const newTabs = tabs.filter((tab, i) => i === 0);
    // 更新 `tabs` 状态。
    setTabs(newTabs);
    // 获取剩下的唯一一个标签页（首页）。
    const lastTab = newTabs[newTabs.length - 1];
    // 更新旧路径。
    setOldPathname(lastTab.path);
    // 更新活动索引。
    setActiveIndex(newTabs.length - 1);
    // 跳转到首页。
    navigate(lastTab.path);
  };

  // 组件的渲染逻辑，返回 JSX。
  return (
    // 最外层是一个 div，类名为 `tabs`，用于应用样式。
    // `onContextMenu` 绑定了右键菜单事件处理函数。
    <div className="tabs" onContextMenu={handleContextMenu}>
      {/* 使用 `map` 方法遍历 `tabs` 数组，为每个标签页数据渲染一个 `Tab` 组件。 */}
      {tabs.map((tab, index) => {
        // 返回 `Tab` 子组件。
        return (
          <Tab
            tab={tab} // 传递单个标签页的数据。
            key={tab.key} // `key` 是 React 用于高效更新列表的必需属性。
            active={activeIndex === index} // `active` 属性判断当前标签页是否是活动状态。
            index={index} // 传递当前标签页的索引。
            length={tabs.length} // 传递总的标签页数量。
            onClose={close} // 将 `close` 函数作为 prop 传给子组件，让子组件可以调用它。
            onCloseOthers={closeOthers} // 同上，传递 `closeOthers` 函数。
            onCloseAll={closeAll} // 同上，传递 `closeAll` 函数。
          />
        );
      })}
    </div>
  );
}

// 导出 Tabs 组件，以便在其他地方使用。
export default Tabs;
