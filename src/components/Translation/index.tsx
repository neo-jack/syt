// 从 "react-i18next" 库中导入 useTranslation 这个 Hook。
// `useTranslation` 是 `react-i18next` 提供的核心功能，它能让你的组件访问到翻译函数 `t`，
// 从而可以根据当前的语言设置，将一个“键”（key）转换成对应的翻译文本。
import { useTranslation } from "react-i18next";

/*
  这个注释块是开发者留下的说明，用一个例子来解释 React 组件是如何接收属性（props）的。
  1. 使用组件的例子:
     当你在其他地方像这样使用 <Translation> 组件时：
     <Translation a="a" b="b">ccc</Translation>

  2. 组件内部收到的 props:
     `Translation` 组件函数就会收到一个名为 `props` 的对象作为参数。
     这个 `props` 对象会包含所有传递给组件的属性：
     {
       a: 'a',      // a 属性
       b: 'b',      // b 属性
       children: 'ccc' // `children` 是一个特殊的属性，它代表了组件标签开始和结束之间的所有内容，在这里就是字符串 "ccc"。
     }
*/

// --- 下面是被注释掉的旧版本代码 ---
// 这是一个旧的或备用的组件版本，我们可以通过它了解组件演变的过程。

// // 定义旧版本组件的 props 类型。
// interface TranslationProps {
//   // ns (namespace) 属性，类型为字符串。它用来指定要从哪个翻译文件（命名空间）里寻找翻译。
//   ns: string;
//   // children 属性，代表组件包裹的内容。
//   children: string;
// }
// // 旧版本组件的定义。它需要同时传入 `ns` 和 `children`。
// export default function Translation({ ns, children }: TranslationProps) {
//   // ns 是命名空间, 代表使用语言包中哪个文件
//   // children 代表组件标签包裹的内容
//   // `useTranslation(ns)` 会根据传入的 ns 加载特定的翻译文件。
//   const { t } = useTranslation(ns);
//   // 使用 t 函数翻译 children 的内容，并用 <span> 包裹起来。
//   return <span>{t(children)}</span>;
// }
// --- 旧版本代码结束 ---


// --- 下面是当前正在使用的代码 ---

// 为 `Translation` 组件定义一个接口（Interface），来规定它能接收哪些属性（props）以及这些属性的类型。
// 这是一种 TypeScript 的语法，能让代码更健壮，并提供更好的开发提示。
interface TranslationProps {
  // `children`: 代表这个组件标签内部包裹的内容，并且规定它的类型必须是 `string`（字符串）。
  children: string;
}

// 定义并默认导出 `Translation` 组件。
// 这是一个 React 函数组件，它的目的是简化文本翻译的操作。
// `{ children }: TranslationProps` 是一种解构赋值语法，它直接从传入的 props 对象中提取出 `children` 属性。
// `: TranslationProps` 则告诉 TypeScript，这个 props 对象必须符合我们上面定义的 `TranslationProps` 接口的规范。
export default function Translation({ children }: TranslationProps) {
  // `children` 变量在这里就代表了组件标签所包裹的那个字符串，比如 <Translation>dashboard</Translation> 中的 "dashboard"。

  // 调用 `useTranslation()` Hook，它会返回一个包含 `t` 函数的对象。
  // `t` 函数是 "translate" (翻译) 的缩写。
  // 因为这里调用 `useTranslation()` 时没有传入任何参数，所以它会使用在 i18next 初始化时配置的默认命名空间（namespace）。
  const { t } = useTranslation();

  // 组件的返回值，定义了它最终要渲染成什么样子的 HTML。
  // `<span>` 是一个行内 HTML 标签，通常用来包裹一小段文本。
  // `{t(children)}` 是这里的核心：
  //   1. `children` 是我们想要翻译的文本的“键”（key），比如 "dashboard"。
  //   2. `t(children)` 会拿着这个键，去当前语言的翻译文件里查找对应的值。
  //   3. 例如，如果当前是中文，`t("dashboard")` 可能会返回 "仪表盘"；如果当前是英文，它会返回 "Dashboard"。
  //   4. 最终，翻译好的文本就会被显示在 `<span>` 标签里面。
  return <span>{t(children)}</span>;
}
