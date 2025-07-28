// 这行代码是在“导入”一个叫做 `Layout` 的组件。
// “import”是 JavaScript 的一个关键字，意思是“导入”或“引入”。
// `Layout` 是我们给导入的组件起的名字。在 React 项目中，首字母大写的通常都是一个“组件”。
// 你可以把组件想象成一个独立的、可复用的积木，它包含了页面的某一部分结构（HTML）、样式（CSS）和功能（JavaScript）。
// `from "./components/Layout"` 指明了从哪里导入这个组件。这是一个相对路径，
// 意思是“从当前文件所在的目录出发，进入 `components` 文件夹，然后找到一个名为 `Layout` 的文件”。
// 这个 `Layout` 组件很可能定义了网站大部分页面的通用布局，比如包含顶部的导航栏、侧边的菜单栏和中间的内容区。
import Layout from "./components/Layout";

// 这行代码和上面类似，也是在导入一个组件，这个组件的名字是 `EmptyLayout`。
// `EmptyLayout` 从字面意思看是“空的布局”或“空白布局”。
// 通常，一个网站里不是所有页面都使用同一种布局。例如，登录页面、注册页面或者404错误页面，
// 它们可能不需要显示导航栏和菜单栏，只需要一个干净的居中区域来显示表单或提示信息。
// 所以，`EmptyLayout` 组件就是为这类特殊页面准备的一个极简布局。
import EmptyLayout from "./components/EmptyLayout";

// 这行代码是在“导出”刚刚导入的两个组件。
// “export”也是一个关键字，意思是“导出”或“分享出去”。
// `{ Layout, EmptyLayout }` 这个语法表示，我们要把 `Layout` 和 `EmptyLayout` 这两个东西打包，
// 让项目中的其他文件可以从我们这个 `index.tsx` 文件中一次性地获取它们。
// 这个 `index.tsx` 文件本身不创造新的功能，它的核心目的是组织代码，充当一个“门户”或“中转站”。
// 这样做的好处是：当其他文件需要使用布局组件时，它们只需要写 `import { Layout } from '@/layouts'`，
// 而不需要关心 `Layout` 组件具体存放在哪个子文件夹（`./components/Layout`）下。
// 这让代码的引用关系更清晰，也方便未来移动文件位置，因为只需要修改这一个“中转站”文件就可以了。
export { Layout, EmptyLayout };
