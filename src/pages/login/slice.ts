// 这个文件是用户登录模块的Redux状态管理文件
// Redux可以理解为一个全局的数据仓库，这个文件专门管理用户相关的数据

// 导入Redux Toolkit的两个核心函数
// createSlice: 用来创建一个数据管理模块，可以自动生成action和reducer
// createAsyncThunk: 用来创建异步操作(比如网络请求)，因为登录需要向服务器发送请求
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// 导入整个应用的数据类型定义
// store: Redux的数据仓库实例，虽然这里没直接用到，但导入了以防需要
// RootState: 整个应用所有数据的TypeScript类型定义，用于类型检查
import { store, RootState } from "@/app/store";

// 导入API请求函数，这些函数负责与服务器通信
// reqLogin: 发送登录请求的函数
// reqGetUserInfo: 获取用户详细信息的函数  
// reqLogout: 发送登出请求的函数
import { reqLogin, reqGetUserInfo, reqLogout } from "@api/user";

// 定义登录时需要的参数类型，确保传递的数据格式正确
// 这是TypeScript的接口，相当于给数据定义一个"模板"
export interface LoginParams {
  username: string; // 用户名必须是字符串类型
  password: string; // 密码必须是字符串类型
}

// 1. 定义这个模块的初始状态(刚开始时的数据)
// 就像给变量设置默认值一样
const initialState = {
  // token是用户登录后服务器给的凭证，就像身份证一样
  // 先从浏览器的localStorage里取，如果没有就用空字符串
  // localStorage是浏览器提供的存储功能，可以永久保存数据
  token: localStorage.getItem("token") || "", // 用户唯一标识，用来证明用户已登录
  
  name: "", // 用户的姓名，刚开始是空的
  avatar: "", // 用户的头像图片地址，刚开始也是空的
};

// ==================== 异步操作定义区域 ====================
// 异步操作就是需要等待的操作，比如网络请求
// 因为向服务器发送请求需要时间，不是立即完成的

// 定义登录异步操作
// createAsyncThunk会自动处理"开始请求"、"请求成功"、"请求失败"三种情况
export const loginAsync = createAsyncThunk(
  "user/loginAsync", // 这是操作的名称，Redux内部用来识别这个操作
  // 这是具体要执行的异步函数
  // 接收一个包含username和password的对象，类型必须符合LoginParams
  ({ username, password }: LoginParams) => {
    // 调用API函数向服务器发送登录请求
    // 这个函数会返回一个Promise，包含服务器的响应结果
    return reqLogin(username, password);
  }
);

// 定义获取用户信息的异步操作
// 通常在用户登录成功后调用，或者页面刷新时重新获取用户信息
export const getUserInfoAsync = createAsyncThunk(
  "user/getUserInfoAsync", // 操作名称
  // 这个函数不需要参数，因为服务器会根据token自动识别是哪个用户
  () => {
    // 调用API函数获取当前登录用户的详细信息
    return reqGetUserInfo();
  }
);

// 定义登出异步操作
// 用户点击"退出登录"时执行
export const logoutAsync = createAsyncThunk(
  "user/logoutAsync", // 操作名称
  // 登出也不需要参数，服务器会根据token知道要登出哪个用户
  () => {
    // 调用API函数通知服务器用户要登出
    return reqLogout();
  }
);

// ==================== Redux模块创建区域 ====================
// 2. 创建Redux数据管理模块
// 这就像创建一个专门管理用户数据的"部门"
const userSlice = createSlice({
  // 模块名称，在整个应用中必须唯一，就像部门名称不能重复
  name: "user",
  
  // 使用上面定义的初始状态
  initialState,
  
  // reducers用来定义同步操作(立即执行的操作)
  // 这里是空对象{}，说明这个模块没有同步操作，只有异步操作
  reducers: {},
  
  // extraReducers用来处理异步操作的结果
  // 就像"当异步操作完成后，我要做什么"的规则书
  extraReducers: (builder) =>
    builder
      // 处理登录成功的情况
      // .addCase的意思是"当某种情况发生时，执行指定的处理函数"
      .addCase(loginAsync.fulfilled, (state, action) => {
        // loginAsync.fulfilled表示登录请求成功完成
        // state是当前的数据状态，action包含服务器返回的结果
        
        // action.payload是服务器返回的数据，这里是登录后的token
        const token = action.payload;
        
        // 将token保存到Redux的状态中，这样整个应用都能访问到
        state.token = token;
        
        // 同时将token保存到浏览器的localStorage中
        // 这样即使用户刷新页面或关闭浏览器再打开，登录状态也不会丢失
        localStorage.setItem("token", token);
      })
      
      // 处理获取用户信息成功的情况
      .addCase(getUserInfoAsync.fulfilled, (state, action) => {
        // getUserInfoAsync.fulfilled表示获取用户信息请求成功
        
        // action.payload是服务器返回的用户信息，包含姓名和头像
        // 使用解构赋值的方式从返回的数据中提取name和avatar
        const { name, avatar } = action.payload;
        
        // 将用户姓名保存到Redux状态中
        state.name = name;
        
        // 将用户头像地址保存到Redux状态中
        state.avatar = avatar;
      })
      
      // 处理登出成功的情况
      .addCase(logoutAsync.fulfilled, (state) => {
        // logoutAsync.fulfilled表示登出请求成功
        // 这里不需要action参数，因为登出成功后只需要清空数据
        
        // 清空Redux中的token，表示用户已登出
        state.token = "";
        
        // 清空用户姓名
        state.name = "";
        
        // 清空用户头像
        state.avatar = "";
        
        // 从浏览器的localStorage中删除token
        // 这样下次打开页面时，系统就知道用户已经登出了
        localStorage.removeItem("token");
      }),
});

// ==================== 导出区域 ====================
// 这部分是把定义好的功能导出，让其他文件可以使用

// 导出选择器函数，用来从整个应用的状态中获取用户数据
// 选择器就像一个"取数据的工具"，告诉系统"我要用户模块的数据"
// (state: RootState) => state.user 的意思是：
// 给我整个应用的状态(state)，我要返回其中的用户部分(state.user)
export const selectUser = (state: RootState) => state.user;

// 3. 将这个模块的reducer函数导出
// reducer是Redux内部用来更新数据的函数
// 这个导出是给store(数据仓库)用的，用来把这个模块集成到整个应用中
// 就像把这个"用户部门"注册到"公司总部"一样
export default userSlice.reducer;