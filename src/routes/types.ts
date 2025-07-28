// 从 'react' 这个库中导入一个叫做 `ReactElement` 的类型。
// `ReactElement` 是当你使用 JSX (例如 `<div>你好</div>`) 时创建的元素。它是一个用来描述用户界面长什么样的对象。
// 我们导入它是为了在路由配置中可以定义图标的类型。
import { ReactElement } from "react";
// 从 'react-router-dom' 这个库中只导入类型 `RouteObject`。
// 'react-router-dom' 是一个在 React 应用中专门用来处理页面跳转和导航的库。
// `RouteObject` 是它预先定义好的一个对象格式，用来表示一个单独的路由（比如应用中的一个页面）。
// 这里使用 `import type` 表示我们只关心它的类型信息，不导入任何实际的程序代码，这有助于优化编译过程。
import type { RouteObject } from "react-router-dom";

// `export` 关键字表示这个 `XMeta` 接口可以被项目中的其他文件导入和使用。
// `interface XMeta` 定义了一个新的数据结构模板，我们称之为 `XMeta`。
// 这个模板用来存放和路由相关的“元数据”（也就是额外信息，比如标题和图标）。
export interface XMeta {
  // 在 `XMeta` 模板中定义一个名叫 `icon` 的属性。
  // 属性名后面的 `?` 表示这个属性是可选的，也就是说一个路由可以有图标，也可以没有。
  // 如果有图标，它的类型必须是 `ReactElement`，通常是一个图标组件，比如 `<HomeOutlined />`。
  icon?: ReactElement;
  // 定义另一个可选的属性，名叫 `title`（标题）。
  // `ReactElement | string` 表示这个标题的类型既可以是一个 `ReactElement`（比如一个包含图标的复杂标题），也可以是一个普通的文本字符串 `string`。
  // `|` 符号在这里表示“或者”的意思。
  title?: ReactElement | string;
}

// `export` 关键字表示这个 `XRoute` 接口可以被其他文件使用。
// `interface XRoute` 定义了一个我们自己的路由对象模板。
// `extends RouteObject` 表示我们的 `XRoute` 模板会继承 `react-router-dom` 中 `RouteObject` 的所有属性（例如 `path` 路径, `element` 页面组件等）。
// 在继承的基础上，我们还可以添加一些自己需要的额外属性。
export interface XRoute extends RouteObject {
  // 为路由对象添加一个可选的 `meta` 属性。
  // 它的类型是我们上面定义的 `XMeta` 模板，用来存放路由的标题和图标信息。
  meta?: XMeta;
  // 添加一个可选的 `children` 属性，用来存放子路由。
  // 比如，一个“用户管理”路由下，可以有“添加用户”和“编辑用户”等子路由。
  // 它的类型 `XRoutes` 是我们将在下面定义的，表示一个路由数组。
  children?: XRoutes;
  // 添加一个可选的 `hidden` 属性，它的类型是布尔值（`true` 或 `false`）。
  // 这个属性可以用来控制一个路由是否在侧边栏菜单中显示。如果设为 `true`，就表示隐藏。
  hidden?: boolean;
}

// `export` 关键字表示这个 `XRoutes` 类型可以被其他文件使用。
// `type XRoutes` 是在创建一个新的类型别名，叫做 `XRoutes`。
// `XRoute[]` 表示 `XRoutes` 这个类型是一个数组，数组里的每一项都必须符合我们上面定义的 `XRoute` 模板的格式。
// 这样做可以让我们更方便地表示一组路由的集合。
export type XRoutes = XRoute[];
