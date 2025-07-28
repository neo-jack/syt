// 从 "@reduxjs/toolkit" 这个包里导入 `configureStore` 函数。
// Redux Toolkit 是官方推荐的、用来简化 Redux 开发的工具集。
// `configureStore` 是一个高级函数，它简化了创建和配置 Redux "store" 的过程。
import { configureStore } from "@reduxjs/toolkit";

// 从其他文件中引入各个模块（或称为 "slice"，即状态切片）的 reducer 函数。
// 一个 slice 包含了一部分特定功能的状态（state）和用于更新这些状态的函数（reducers）。
// 比如 `appSlice` 可能管理着整个应用的通用状态，如语言设置。
import appSlice from "./appSlice";
// `userSlice` 则专门管理和用户登录信息相关的状态，如 token、用户名等。
import userSlice from "@/pages/login/slice";

// `store` 是 Redux 应用的核心，可以把它想象成一个“全局的、集中的数据仓库”。
// 整个应用所有需要共享的数据（状态）都存放在这个 `store` 对象中。
// `export` 关键字让这个 `store` 对象可以在项目的其他地方被导入和使用。
export const store = configureStore({
  // `configureStore` 函数接收一个配置对象，其中 `reducer` 属性是必需的。
  // `reducer` 属性的值是一个对象，这个对象的作用是把我们所有不同模块的 reducer 函数组合起来。
  // Reducer 是一个纯函数，它接收当前的状态和一个 action（指令），然后返回一个新的状态。
  reducer: {
    // 这里的键值对定义了我们的全局状态树的结构。
    // `app: appSlice` 这行代码的意思是：
    // 在全局状态中，创建一个名为 `app` 的“隔间”（slice），
    // 这个隔间里的所有数据，都由从 `./appSlice.ts` 文件导入的 `appSlice` 这个 reducer 来管理。
    app: appSlice,
    // 同理，`user: userSlice` 的意思是：
    // 在全局状态中，创建一个名为 `user` 的“隔间”，
    // 这个隔间里的数据，由从 `@/pages/login/slice.ts` 导入的 `userSlice` 这个 reducer 来管理。
    user: userSlice,
  },
});

/*
  上面的配置最终会形成一个如下所示的全局状态数据结构。
  这个注释很好地展示了 `store` 中存放的数据的完整形态：
    {
      // "user" 这个隔间（slice）里的数据结构
      user: {
        name: string;
        avatar: string;
        token: string;
        routes: string[]; // 用户拥有的路由权限
        buttons: string[]; // 用户拥有的按钮权限
      },
      // "app" 这个隔间（slice）里的数据结构
      app: {
        lang: string // 当前的语言设置
      }
    }
*/

// --- 下面的代码主要是为了配合 TypeScript 使用，提供更好的类型推断和代码安全 ---

// `dispatch` 是用来“派发 action”的方法。可以把它想象成是向仓库管理员下达一个“更新数据”的指令。
// 例如 `dispatch(loginSuccess(userInfo))` 就是告诉 Redux 去执行 `loginSuccess` 这个操作。
// `typeof store.dispatch` 在 TypeScript 中，不是获取值，而是获取 `store.dispatch` 这个函数的“类型”。
// `export type AppDispatch = ...` 这行代码创建并导出了一个名为 `AppDispatch` 的新类型。
// 这样做的好处是，以后在组件中使用 `dispatch` 函数时，TypeScript 就能准确地知道这个函数接受哪些类型的 action，从而提供更好的代码提示和错误检查。
export type AppDispatch = typeof store.dispatch;

// `getState` 是一个用来“读取当前所有数据”的方法，调用 `store.getState()` 就会返回整个仓库的当前状态对象。
// `typeof store.getState` 同样是获取 `store.getState` 这个函数本身的类型。
// `ReturnType<...>` 是 TypeScript 提供的一个工具类型，它可以获取一个函数的返回值的类型。
// 所以 `ReturnType<typeof store.getState>` 的意思就是：“请告诉我 `store.getState()` 这个函数执行后，返回的数据是什么类型的？”
// `export type RootState = ...` 这行代码创建并导出了一个名为 `RootState` 的新类型，这个类型就精确地代表了我们整个 Redux 仓库中所有数据的完整结构。
// 这个 `RootState` 类型非常有用，特别是在使用 `useSelector` 这个 Hook 从 store 中读取数据时，它能让 TypeScript 知道你取出的数据是什么类型，从而避免很多潜在的 bug。
export type RootState = ReturnType<typeof store.getState>;
