// 导入 React 中的 useState 钩子。
// useState 用于在函数组件中添加和管理"状态"(state)。状态是组件内部会变化的数据。
import { useState } from "react";
// 导入 react-router-dom 库中的 Link 组件。
// Link 组件用于在应用的不同页面之间进行导航，类似于 HTML 中的 <a> 标签，但它不会重新加载整个页面，适用于单页面应用（SPA）。
import { Link } from "react-router-dom";
// 导入 antd 图标库中的 CloseOutlined 图标。
// 这是一个 "x" 形状的关闭图标。
import { CloseOutlined } from "@ant-design/icons";
// 导入 antd UI 库中的 Dropdown (下拉菜单) 和 Menu (菜单) 组件。
// Dropdown 组件可以在某个元素上触发（如右键点击）时显示一个下拉菜单。
// Menu 组件就是那个下拉菜单本身。
import { Dropdown, Menu } from "antd";

// 从上级目录的 types 文件中导入 TabType 类型定义。
// 这告诉我们一个"标签页"对象应该是什么样子，比如它应该包含哪些属性（如路径 path、标题 title 等）。
import { TabType } from "../../types";

// 导入这个组件自己的 LESS 样式文件。
// LESS 是一种 CSS 预处理器，让我们能用更高级的语法来写样式。
import "./index.less";

// 定义这个组件接收的"属性"(props)的类型。
// 这就像是组件的说明书，规定了使用这个组件时必须提供哪些数据。
interface TabProps {
  // `tab`: 当前这个标签页对象的数据，包含了标题、路径等信息。
  tab: TabType;
  // `active`: 一个布尔值（true 或 false），表示这个标签页当前是否是被选中的那个。
  active: boolean;
  // `index`: 这个标签页在所有标签页列表中的位置（索引），从 0 开始。
  index: number;
  // `length`: 当前打开的标签页的总数。
  length: number;
  // `onClose`: 一个函数，当这个标签页被关闭时会调用它。它需要知道被关闭标签页的索引。
  onClose(index: number): void;
  // `onCloseOthers`: 一个函数，当需要关闭其他所有标签页时调用。
  onCloseOthers(index: number): void;
  // `onCloseAll`: 一个函数，当需要关闭全部标签页时调用。
  onCloseAll(index: number): void;
}

// 这是 Tab 组件的函数定义。
// 它接收一些"属性"(props)作为输入，然后返回需要在屏幕上显示的内容（JSX）。
// 这里使用了"解构赋值"的语法，直接从 props 对象中取出了需要的属性。
function Tab({ tab, active, index, length, onClose, onCloseOthers, onCloseAll }: TabProps) {
  // 定义一个处理函数，当用户点击右键菜单中的某一项时，这个函数会被调用。
  const handleMenuClick = ({ key }: any) => {
    // 使用 switch 语句来判断用户点击的是哪个菜单项，判断的依据是菜单项的 'key' 属性。
    switch (key) {
      // 如果点击的是 key 为 'close' 的菜单项...
      case "close":
        // ...就调用从父组件传来的 onClose 函数，并把当前标签页的索引传过去。
        onClose(index);
        // 'return' 会立即结束这个函数的执行。
        return;
      // 如果点击的是 key 为 'closeOthers' 的菜单项...
      case "closeOthers":
        // ...就调用 onCloseOthers 函数。
        onCloseOthers(index);
        return;
      // 如果点击的是 key 为 'closeAll' 的菜单项...
      case "closeAll":
        // ...就调用 onCloseAll 函数。
        onCloseAll(index);
        return;
    }
  };

  // 在这里定义当用户右键点击标签页时出现的那个下拉菜单。
  const menu = (
    // 这是 antd 的 Menu 组件。
    <Menu
      // 给这个菜单一个 CSS 类名，方便我们给它添加样式。
      className="context-menu"
      // 指定当菜单项被点击时，调用我们上面定义的 `handleMenuClick` 函数。
      onClick={handleMenuClick}
      // 'items' 属性接收一个数组，数组里的每个对象都代表一个菜单项。
      items={[
        {
          // 'label' 是显示在菜单项上的文字。
          label: "关闭",
          // 'key' 是这个菜单项的唯一标识符，我们在 `handleMenuClick` 函数里用它来判断点击了哪个。
          key: "close",
          // 'disabled' 属性为 true 时，这个菜单项会变成灰色，不能被点击。
          // 这里的逻辑是：如果是第一个标签页 (index === 0)，则“关闭”按钮不可用，通常第一个是首页，不允许关闭。
          disabled: index === 0,
        },
        {
          // 菜单项的文字。
          label: "关闭其他",
          // 菜单项的唯一标识。
          key: "closeOthers",
          // 设置此项是否可用的逻辑。
          // 如果总共只有一个标签页 (length === 1)，那就没有“其他”可以关了。
          // 或者，如果总共有两个标签页，并且当前操作的不是第一个标签页（那么就是第二个），那么“其他”就是那个不可关闭的首页，所以也不能关。
          disabled: length === 1 || (length === 2 && index !== 0),
        },
        {
          // 菜单项的文字。
          label: "全部关闭",
          // 菜单项的唯一标识。
          key: "closeAll",
          // 如果标签页总数小于等于1，那么 "全部关闭" 就没有意义，所以禁用它。
          disabled: length <= 1,
        },
      ]}
    />
  );

  // 使用 useState 这个 React 钩子来创建一个状态变量 `isHover`。
  // `isHover` 用来记录鼠标当前是否正悬停在标签页上，它是个布尔值（true 或 false）。
  // `setIsHover` 是一个函数，用来更新 `isHover` 的值。
  // `useState(false)` 表示 `isHover` 的初始值是 false。
  const [isHover, setIsHover] = useState(false);

  // 这是一个辅助函数，它返回另一个函数。这种模式在 React 事件处理中很常见，叫做"高阶函数"。
  const handleHover = (isHover: boolean) => {
    // 这个是最终会被 onMouseEnter 和 onMouseLeave 事件触发的函数。
    return () => {
      // 它调用 `setIsHover` 函数来更新我们的 `isHover` 状态。
      setIsHover(isHover);
    };
  };

  // return 后面是这个组件要渲染到页面上的最终内容，使用 JSX 语法来写。
  return (
    // antd 的 Dropdown 组件，它把我们的标签页包裹起来，赋予它右键菜单的功能。
    // 'overlay' 属性指定了下拉菜单的内容，我们把上面定义好的 `menu` 变量传给它。
    // 'trigger' 属性告诉 Dropdown 何时显示菜单。`['contextMenu']` 表示在右键点击时触发。
    <Dropdown overlay={menu} trigger={["contextMenu"]}>
      {/* 这是我们标签页最外层的 div 容器。 */}
      {/* className 是动态设置的。它总会有 'tab' 这个类。如果当前标签页是激活状态(active为true)，就额外再添加一个 'active' 类。 */}
      {/* onMouseEnter 是一个事件处理器，当鼠标指针进入这个 div 时，它就会被调用。我们调用 handleHover(true) 来把 isHover 状态设置为 true。 */}
      {/* onMouseLeave 是当鼠标指针离开时被调用。我们调用 handleHover(false) 来把 isHover 状态设置为 false。 */}
      <div className={`tab ${active ? "active" : ""}`} onMouseEnter={handleHover(true)} onMouseLeave={handleHover(false)}>
        {/* Link 组件让标签页的标题变成一个可以点击的链接。 */}
        {/* 'to' 属性指定了点击后要跳转到的页面路径。这个路径来自 tab 对象的 path 属性。 */}
        <Link className="tab-link" to={tab.path}>
          {/* 这里显示的是标签页的标题文字。 */}
          {tab.title}
        </Link>
        {/* 这是一个"条件渲染"。只有当所有 `&&` 连接的条件都为真时，后面的关闭图标才会被显示出来。 */}
        {/* 第一个条件: `tab.closable`，表示这个标签页本身是允许被关闭的。 */}
        {/* 第二个条件: `(isHover || active)`，表示鼠标正悬停在上面，或者这个标签页是当前激活的。 */}
        {/* 当以上条件都满足时，才会渲染 <CloseOutlined /> 这个图标。 */}
        {/* CloseOutlined 就是那个 'x' 图标组件。 */}
        {/* onClick 事件：当用户点击这个 'x' 图标时，会直接调用父组件传来的 onClose 函数，并传入当前标签页的索引，来关闭自己。 */}
        {tab.closable && (isHover || active) && <CloseOutlined className="tab-close" onClick={() => onClose(index)} />}
      </div>
    </Dropdown>
  );
}

// 导出（export）这个 Tab 组件。
// "export default" 使得其他文件可以通过 import 语句来导入和使用这个组件。
export default Tab;
