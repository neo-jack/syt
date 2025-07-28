// src/api/user/index.ts
// 这是用户相关的接口文件，包含用户登录、获取用户信息、退出登录等核心功能
// 这些接口是整个应用用户认证和权限管理的基础

// ========== 导入依赖 ==========

// 导入封装好的HTTP请求工具
import { request } from "@/utils/http";
// request: 这是基于axios二次封装的HTTP请求工具
// 它已经配置好了：
// - 自动添加baseURL（请求地址前缀）
// - 自动在请求头中添加token（用于身份验证）
// - 统一的错误处理和消息提示
// - 请求和响应的拦截处理

// 导入类型定义
import { LoginResponse, GetUserInfoResponse } from "./model/userTypes";
// LoginResponse: 登录接口的响应数据类型（token字符串）
// GetUserInfoResponse: 获取用户信息接口的响应数据类型（包含姓名和头像）
// 这些类型定义确保了TypeScript的类型安全

// ========== 用户登录接口 ==========

// 登录接口函数
export const reqLogin = (username: string, password: string) => {
  // 函数说明：
  // - 功能：向服务器发送登录请求，验证用户身份
  // - 参数：username（用户名），password（密码）
  // - 返回：Promise，成功时返回token字符串
  
  // 参数类型说明：
  // username: string - 用户输入的用户名，比如："admin"
  // password: string - 用户输入的密码，比如："123456"
  
  return request.post<any, LoginResponse>(`/admin/acl/index/login`, {
    // 解释这行代码的各个部分：
    
    // 1. request.post: 发送POST请求
    //    POST请求通常用于提交数据，这里是提交登录信息
    
    // 2. <any, LoginResponse>: TypeScript泛型参数
    //    - 第一个参数any: 请求参数的类型（这里用any是因为内部处理）
    //    - 第二个参数LoginResponse: 响应数据的类型（登录成功返回的token）
    
    // 3. `/admin/acl/index/login`: 请求的路径
    //    - 完整地址会是：baseURL + /admin/acl/index/login
    //    - 开发环境：http://localhost:8080/dev-api/admin/acl/index/login
    //    - acl表示Access Control List（访问控制列表），用于权限管理
    
    // 4. 请求体参数对象：
    username,  // 等价于 username: username
    password,  // 等价于 password: password
  });
  
  // 实际的HTTP请求示例：
  // POST http://localhost:8080/dev-api/admin/acl/index/login
  // Headers: { "Content-Type": "application/json" }
  // Body: { "username": "admin", "password": "123456" }
  // 
  // 成功响应示例：
  // {
  //   "code": 200,
  //   "message": "登录成功",
  //   "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."  // 这是JWT token
  // }
  // 
  // 失败响应示例：
  // {
  //   "code": 400,
  //   "message": "用户名或密码错误",
  //   "data": null
  // }
};

// ========== 获取用户信息接口 ==========

// 获取用户信息接口函数
export const reqGetUserInfo = () => {
  // 函数说明：
  // - 功能：根据当前登录用户的token，获取用户的详细信息
  // - 参数：无需参数，因为通过token识别用户身份
  // - 返回：Promise，成功时返回包含用户姓名和头像的对象
  
  // 为什么不需要参数？
  // 因为在request的请求拦截器中，会自动从Redux读取token并添加到请求头中
  // 服务器通过解析token就能知道是哪个用户在请求信息
  
  return request.get<any, GetUserInfoResponse>(`/admin/acl/index/info`);
  // 解释这行代码：
  
  // 1. request.get: 发送GET请求
  //    GET请求通常用于获取数据，不修改服务器状态
  
  // 2. <any, GetUserInfoResponse>: TypeScript泛型参数
  //    - 第一个参数any: 请求参数类型（GET请求通常没有请求体）
  //    - 第二个参数GetUserInfoResponse: 响应数据类型（用户信息对象）
  
  // 3. `/admin/acl/index/info`: 请求路径
  //    - 完整地址：baseURL + /admin/acl/index/info
  //    - 这个接口需要在请求头中携带有效的token
  
  // 实际的HTTP请求示例：
  // GET http://localhost:8080/dev-api/admin/acl/index/info
  // Headers: { 
  //   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  //   "Content-Type": "application/json"
  // }
  // 
  // 成功响应示例：
  // {
  //   "code": 200,
  //   "message": "获取成功",
  //   "data": {
  //     "name": "管理员",
  //     "avatar": "https://example.com/avatar.jpg"
  //   }
  // }
  // 
  // 失败响应示例（token无效）：
  // {
  //   "code": 401,
  //   "message": "token无效，请重新登录",
  //   "data": null
  // }
};

// ========== 退出登录接口 ==========

// 退出登录接口函数
export const reqLogout = () => {
  // 函数说明：
  // - 功能：通知服务器用户要退出登录，清理服务器端的会话信息
  // - 参数：无需参数，通过token识别要退出的用户
  // - 返回：Promise，成功时返回null（表示成功退出，无需返回具体数据）
  
  // 为什么需要调用退出接口？
  // 1. 通知服务器清理该用户的会话信息
  // 2. 服务器可能会将该token加入黑名单，确保安全
  // 3. 记录用户的退出日志，用于安全审计
  
  return request.post<any, null>(`/admin/acl/index/logout`);
  // 解释这行代码：
  
  // 1. request.post: 发送POST请求
  //    虽然是"退出"操作，但通常使用POST请求，因为会修改服务器状态
  
  // 2. <any, null>: TypeScript泛型参数
  //    - 第一个参数any: 请求参数类型
  //    - 第二个参数null: 响应数据类型（退出成功不需要返回具体数据）
  
  // 3. `/admin/acl/index/logout`: 请求路径
  //    - 完整地址：baseURL + /admin/acl/index/logout
  //    - 需要在请求头中携带token来识别要退出的用户
  
  // 实际的HTTP请求示例：
  // POST http://localhost:8080/dev-api/admin/acl/index/logout
  // Headers: { 
  //   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  //   "Content-Type": "application/json"
  // }
  // Body: {} （空对象）
  // 
  // 成功响应示例：
  // {
  //   "code": 200,
  //   "message": "退出成功",
  //   "data": null
  // }
};

/* 
===============================================================================
接口使用说明和数据流程
===============================================================================

=== 1. 登录流程 ===

用户操作 → 组件调用 → Redux处理 → 接口请求 → 服务器响应

1. 用户在登录页面输入用户名和密码
2. 点击登录按钮，触发表单提交
3. 组件调用：dispatch(loginAsync({ username, password }))
4. Redux中的loginAsync调用：reqLogin(username, password)
5. 发送HTTP请求到服务器
6. 服务器验证用户名密码，返回token
7. Redux保存token到状态和localStorage
8. 页面跳转到首页

代码示例：
```javascript
// 在Login组件中
const handleLogin = async () => {
  try {
    const token = await reqLogin('admin', '123456');
    console.log('登录成功，token:', token);
    // token会被自动保存到Redux和localStorage
  } catch (error) {
    console.log('登录失败:', error);
    // 错误消息会自动显示给用户
  }
};
```

=== 2. 获取用户信息流程 ===

页面加载 → 权限检查 → 获取用户信息 → 更新状态

1. 用户访问需要登录的页面
2. withAuthorization检查是否有token
3. 有token但没有用户信息时，调用getUserInfoAsync
4. Redux调用：reqGetUserInfo()
5. 请求头自动携带token发送请求
6. 服务器返回用户信息（姓名、头像）
7. Redux保存用户信息
8. 页面显示用户信息

代码示例：
```javascript
// 在withAuthorization中
if (token && !name) {
  dispatch(getUserInfoAsync()); // 自动调用reqGetUserInfo
}

// 在组件中使用用户信息
const { name, avatar } = useAppSelector(selectUser);
```

=== 3. 退出登录流程 ===

用户点击退出 → 清理数据 → 跳转登录页

1. 用户点击"退出登录"按钮
2. 组件调用：dispatch(logoutAsync())
3. Redux调用：reqLogout()
4. 通知服务器用户退出
5. 清理Redux中的用户数据（token、name、avatar）
6. 清理localStorage中的token
7. 跳转到登录页面

代码示例：
```javascript
// 在Avatar组件中
const handleLogout = async () => {
  await dispatch(logoutAsync()); // 调用reqLogout
  navigator("/login"); // 跳转到登录页
};
```

=== 4. 自动token管理 ===

这些接口的一个重要特点是自动的token管理：

1. **登录时自动保存token**：
   - 登录成功后，token被保存到Redux和localStorage
   - 确保数据持久化和快速访问

2. **请求时自动携带token**：
   - request拦截器会自动从Redux读取token
   - 在每个请求的headers中添加token
   - 无需手动处理token的传递

3. **退出时自动清理token**：
   - 清理Redis中的token
   - 清理localStorage中的token
   - 确保安全退出

=== 5. 错误处理机制 ===

所有接口都通过response拦截器统一处理错误：

1. **业务错误**（code !== 200）：
   - 自动显示错误消息给用户
   - 返回Promise.reject，触发catch分支

2. **网络错误**（请求失败）：
   - 显示通用错误消息
   - 返回Promise.reject

3. **token过期**：
   - 服务器返回401状态
   - 用户需要重新登录

=== 6. 类型安全保障 ===

所有接口都使用TypeScript类型：

1. **参数类型检查**：
   - reqLogin的参数必须是string类型
   - 编译时就能发现类型错误

2. **返回值类型约束**：
   - LoginResponse确保返回token字符串
   - GetUserInfoResponse确保返回用户信息对象

3. **IDE支持**：
   - 自动补全和类型提示
   - 重构时自动更新相关代码

===============================================================================
总结
===============================================================================

这个用户接口文件是整个应用用户认证系统的核心：

1. **功能完整**：涵盖登录、获取信息、退出的完整流程
2. **自动化管理**：token的保存、携带、清理都是自动的
3. **错误处理**：统一的错误处理和用户提示
4. **类型安全**：完整的TypeScript类型定义
5. **易于使用**：简洁的API设计，便于组件调用

这种设计确保了用户认证的安全性、可靠性和易用性，是现代Web应用的标准做法。
*/