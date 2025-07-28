// 从 '@reduxjs/toolkit' 库中导入 `createSlice` 函数。
// 这是 Redux Toolkit (RTK) 的核心功能，可以让我们非常方便地创建一个 Redux "切片"（Slice）。
// 你可以把一个 "切片" 理解成是整个应用状态（State）中的一个模块或一部分，比如用户模块、设置模块等。
import { createSlice } from "@reduxjs/toolkit";
// 从 store 配置文件中导入 RootState 类型。
// `RootState` 是一个 TypeScript 类型，它代表了我们整个 Redux store 中所有状态的总和。
// 导入它是为了在代码中获得完整的类型提示和安全检查。
import { RootState } from "./store";

// 使用 TypeScript 的 interface（接口）来定义这个“切片”中状态（State）的“形状”或“结构”。
// 这意味着，我们规定了 app 这个模块的状态里，必须有一个名为 `lang` 的属性，并且它的值必须是字符串类型。
interface AppState {
  lang: string;
}

// 定义一个函数，用来获取这个模块的初始状态。
// 这样做的好处是，我们可以把一些初始化的逻辑（比如从浏览器缓存中读取数据）封装起来，让代码更清晰。
function getInitialState(): AppState {
  // 尝试从浏览器的 localStorage 中读取之前保存的语言设置。
  // localStorage 是浏览器提供的一种本地存储功能，可以把数据长久地保存在用户的电脑上，即使用户关闭了网页再打开，数据也不会丢失。
  // `localStorage.getItem("lang")` 会尝试读取名为 "lang" 的数据。
  // 如果读取到了（用户之前设置过），就使用那个值；如果没读取到（用户第一次访问或清除了缓存），`getItem`会返回 null，
  // 此时 `|| "zh_CN"` 这个逻辑或操作符就会起作用，给 lang 赋一个默认值 "zh_CN"（简体中文）。
  const lang = localStorage.getItem("lang") || "zh_CN";

  // 返回一个符合 AppState 接口定义的对象，作为这个模块的初始状态。
  return {
    lang,
  };
}

// 1. 定义当前 Redux 模块的初始状态数据。
// 调用上面写的 getInitialState 函数来获取初始值。
let initialState: AppState = getInitialState();

/*
  这里注释掉的是一个示例，展示了如果不用函数，如何直接定义初始状态：
  const initialState: Xxx = {
    xxx: xxx,
    yyy: xxx
  }
*/

// 2. 使用 createSlice 函数创建一个 Redux “切片”模块。
export const appSlice = createSlice({
  // `name` 是这个切片的名称，它在整个 Redux 中必须是唯一的。
  // Redux Toolkit 会用这个名字作为自动生成的 action type 的前缀（例如 'app/setLang'），来区分不同模块的 action。
  name: "app",
  // `initialState` 指定了这个模块的初始状态数据。
  initialState,
  // `reducers` 是一个对象，我们在这里定义所有“更新这个模块状态的方法”。
  // 这里的每个函数都对应一种更新状态的“行为”（Action）。
  // Redux Toolkit 的一个巨大优势是它会自动为我们这里的每个 reducer 函数生成对应的 Action Creator 函数。
  reducers: {
    // 这里我们定义一个名为 `setLang` 的 reducer 函数。
    // 它接收两个参数：
    // `state`：这是当前模块的状态。Redux Toolkit 内部使用了 Immer 库，所以我们可以“直接修改”这个 state 对象，
    //          而不用像传统 Redux 那样返回一个全新的对象。这大大简化了代码。
    // `action`：这是一个描述“发生了什么”的对象。它通常有一个 `payload` 属性，装着我们要用来更新状态的新数据。
    setLang(state, action) {
      // 从 action 对象中获取 `payload`，也就是调用这个 action 时传递过来的新语言值（比如 "en_US"）。
      const lang = action.payload;
      // 将新的语言设置保存到浏览器的 localStorage 中，实现持久化存储。
      // 这样用户下次访问时，就能记住他的语言偏好。
      localStorage.setItem("lang", lang);
      // 直接修改 state 的 lang 属性。Immer 会在底层处理好，确保 Redux 的“不可变性”原则得到遵守。
      state.lang = lang;
    },
  },
});

// 暴露一个专门用来从总状态中“选择”出当前模块特定数据的方法，这种函数通常被称为 "Selector"。
// 其他组件如果想读取 `lang` 这个数据，就可以使用这个 selector。
// 它接收整个 Redux 的 state 作为参数，然后返回 state.app.lang 这个具体的值。
// 使用示例：在组件中 `const lang = useAppSelector(selectLang)`
export const selectLang = (state: RootState) => state.app.lang;

// 从 `appSlice.actions` 中解构并导出由 `createSlice` 自动生成的 Action Creator 函数。
// Action Creator 函数的名字和我们在 `reducers` 中定义的名字完全一样。
// 这样，其他组件就可以导入 `setLang` 这个函数，来“派发”（dispatch）一个更新语言的 action。
// 使用示例：
// const dispatch = useAppDispatch()
// dispatch(setLang('en_US'))  // 'en_US' 就是上面 reducer 函数中 action.payload 的值
export const { setLang } = appSlice.actions;

// 3. 默认导出（export default）这个切片生成的 reducer。
// 一个切片的核心就是一个 reducer 函数，它知道如何处理属于这个切片的所有 action，并更新状态。
// 我们需要把这个 reducer 暴露出去，以便在 store 的主配置文件中，将所有模块的 reducer 汇总到一起。
export default appSlice.reducer;
