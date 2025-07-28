// 从 antd 图标库的组件模块中，导入一个名为 `AntdIconProps` 的类型定义。
// 目的: 我们需要先拿到 antd 图标组件原始的属性类型，才能在它的基础上进行扩展。
// 功能: 这行代码的作用就是引入 antd 图标组件的“属性说明书”（即类型接口 `AntdIconProps`）。
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

// 这是一个 TypeScript 的特殊语法，叫做“模块声明”或“模块扩展”。
// 目的: 告诉 TypeScript 编译器，我们接下来要对一个已经存在的、名为 '@ant-design/icons/lib/components/AntdIcon' 的第三方库模块进行补充定义。
// 功能: 这就像是打开一个别人写好的代码模块的“说明书”，准备往里面添加一些新的内容，但并不会修改原始的库文件。
declare module '@ant-design/icons/lib/components/AntdIcon' {
  // 导出一个与我们想要扩展的接口同名的接口 `AntdIconProps`。
  // 目的: TypeScript 会自动将我们在这里定义的属性，与原始的 `AntdIconProps` 接口中的属性进行合并。
  // 功能: 在这里重新定义 `AntdIconProps` 接口，以便在其中添加我们需要的额外属性。
  export interface AntdIconProps {
    // 为图标组件的属性添加一个新的、可选的 `onPointerEnterCapture` 属性。
    // 目的: 解决 `React` 框架升级后，某些事件处理器（如 `onPointerEnter`）需要一个名为 `onPointerEnterCapture` 的捕获阶段版本，而旧的 `antd` 类型定义里没有，导致 TypeScript 报错。我们在这里手动补上。
    // 功能: 声明 `onPointerEnterCapture` 属性，它是一个函数，当鼠标指针进入图标区域时触发。`?` 号表示这个属性是可选的，不是必须的。
    onPointerEnterCapture?: React.PointerEventHandler<HTMLSpanElement>;
    // 为图标组件的属性添加另一个新的、可选的 `onPointerLeaveCapture` 属性。
    // 目的: 与上一行类似，补充 `antd` 图标库缺少的 `onPointerLeaveCapture` 事件类型，以保证与新版 `React` 的兼容性。
    // 功能: 声明 `onPointerLeaveCapture` 属性，它是一个函数，当鼠标指针离开图标区域时触发。这个属性也是可选的。
    onPointerLeaveCapture?: React.PointerEventHandler<HTMLSpanElement>;
  }
} 