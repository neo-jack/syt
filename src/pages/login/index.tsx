// 这个文件是用户登录页面组件
// 负责显示登录表单，让用户输入用户名密码进行登录

// 导入React核心库，用于创建React组件
import React from "react";

// 导入Ant Design的UI组件
// Form: 表单组件，用来创建和管理表单
// Input: 输入框组件，用户可以在里面输入文字
// Button: 按钮组件，用户点击触发操作
import { Form, Input, Button } from "antd";

// 导入React Router的导航功能
// useNavigate: 一个Hook，用来在代码中跳转到其他页面
// 就像点击链接一样，但是通过代码来控制
import { useNavigate } from "react-router-dom";

// 导入自定义的Redux hooks
// useAppDispatch: 用来向Redux发送操作指令的工具
import { useAppDispatch } from "@/app/hooks";

// 导入登录相关的功能
// loginAsync: 异步登录操作，会向服务器发送登录请求
// LoginParams: TypeScript类型定义，规定登录参数的格式
import { loginAsync, LoginParams } from "./slice";

// 导入当前组件的样式文件
// 这个CSS文件定义了登录页面的外观样式
import "./index.less";

// 定义并导出Login登录组件
function Login() {
  /*
    ==================== 登录流程说明 ====================
    
    完整的用户登录流程：
    
    1. 收集表单数据
       - 用户在输入框中输入用户名和密码
       - 表单组件会自动收集这些数据
    
    2. 发送请求，请求登录
       - 将用户名密码发送给服务器
       - 服务器验证用户名密码是否正确
    
    3. 服务器返回登录信息，保存用户登录信息（为了实现用户免登录）
       - 登录信息中最重要的是token，这是用户的唯一标识
       - 就像身份证号码一样，证明用户的身份
    
    ==================== Token工作原理 ====================
    
    客户端请求登录流程：
        - 服务器检查用户名和密码是否正确 
          - 如果正确，对用户id进行JWT加密形成一个唯一标识：token
            - 服务器将token响应给客户端

    客户端下次发送请求需要携带token：
        - 服务器通过token进行JWT解密就能得到用户id
          - 通过用户id就能查找到用户数据
            - 服务器返回相应的数据

    ==================== 不同的Token存储方式 ====================
    
    方式1: Cookie存储
        - 服务器将token存储到cookie并返回客户端
        - 客户端会自动保存cookie，发送请求会自动携带cookie
        - 优点：自动化，不需要手动处理
        - 缺点：安全性较低，容易被攻击

    方式2: Session存储
        - 将用户数据在服务器内存中再存储一份，返回代表用户id的唯一标识token
        - 使用cookie保存token返回客户端
        - 客户端会自动保存cookie，发送请求会自动携带cookie
        - 优点：服务器端存储，相对安全
        - 缺点：服务器内存消耗大

    方式3: Headers存储（本项目采用的方式）
        - 服务器将token作为响应结果返回（放在响应体中）
        - 客户端发送请求需要将token放在请求头中携带
        - 服务器解析token时，会去请求头中找token
        
        这种方式需要做两件事：
        1. 将token存储起来 
           - 将token数据存储在redux中（问题：刷新页面数据会丢失）
             - 所有存储在组件或redux中的数据都是内存存储，刷新就没了
             - 解决方案：token持久化存储 --> WebStorage(localStorage/sessionStorage)
               - localStorage: 永久存储，除非手动删除
               - sessionStorage: 会话（临时）存储，刷新浏览器数据还在，关闭浏览器数据就删除

           总结：既存储在redux中，也存储在localStorage中
             - localStorage：为了持久化，页面刷新不丢失
             - redux：为了读写速度更快（性能更好），组件间共享数据
          
        2. 发送请求时在headers携带token
           - 通过请求拦截器设置公共的请求参数：token
           - 这样每次发请求都会自动带上token

    4. 跳转到首页
       - 登录成功后，自动跳转到系统主页面

    5. 获取用户数据
       - 登录成功后请求用户详细数据（姓名、头像等）进行展示
       - 页面刷新时也需要重新请求用户数据展示
         - 需要在一个统一公共的位置请求用户数据展示
           --> 这个位置就是Layout组件，因为所有页面组件都是Layout的子组件
           --> 或者EmptyLayout，Login组件的父组件
           --> 实际使用withAuthorization高阶组件来完成此功能
             --> 权限检查完成后再渲染具体的Layout或EmptyLayout
  */

  // 获取dispatch函数，用来向Redux发送操作指令
  // 就像获取一个"遥控器"，可以控制Redux数据仓库
  const dispatch = useAppDispatch();
  
  // 获取导航函数，用来在代码中进行页面跳转
  // 就像获取一个"导航仪"，可以跳转到其他页面
  const navigate = useNavigate();

  // 定义表单提交处理函数
  // 当用户点击"登录"按钮时，这个函数会被调用
  // values参数包含用户在表单中输入的数据（用户名、密码）
  const onFinish = async (values: LoginParams) => {
    // 1. 收集表单数据（这里被注释了，因为values就是表单数据）
    // console.log(values); // 可以打印看看用户输入了什么
    
    // 2. 发送请求，请求登录
    // 思考：什么样的数据会交给redux管理？
    // 答案：至少有两个组件以上使用的数据
    // 用户相关的数据会有多个组件使用（头部显示用户名、权限检查等），所以交给redux管理
    
    // 调用异步登录操作，向服务器发送登录请求
    // await表示等待服务器响应，result是服务器的响应结果
    const result = await dispatch(loginAsync(values)); // 3. redux中保存用户登录信息
    
    // 重要提示：不管登录成功还是失败，promise状态都是成功的
    // 需要通过检查result.type来判断登录是否真的成功
    
    // 检查登录结果
    if (result.type === "user/loginAsync/fulfilled") {
      // 如果type是"fulfilled"，说明登录成功
      // 4. 跳转到首页（需要保证登录成功才能跳转）
      navigate("/syt/dashboard");
    }
    // 如果登录失败，不跳转，用户继续在登录页面
    // 错误信息会在Redux的错误处理中显示
  };

  // 渲染登录页面的UI界面
  return (
    // 最外层容器，使用CSS类名"login"设置页面样式
    <div className="login">
      {/* 登录表单的容器，使用CSS类名"login-container"设置样式 */}
      <div className="login-container">
        {/* 页面标题 */}
        <h1>尚医通平台管理系统</h1>
        
        {/* 
          Ant Design的表单组件
          各个属性的作用：
        */}
        <Form
          name="basic"                    // 表单的名称，用于标识这个表单
          labelCol={{ span: 4 }}          // 标签（如"用户名"）占据的列宽度，总共24列，这里占4列
          wrapperCol={{ span: 20 }}       // 输入框占据的列宽度，这里占20列（4+20=24，正好填满）
          initialValues={{                // 表单的初始值，页面加载时输入框里显示的默认内容
            username: "admin",            // 用户名输入框默认显示"admin"
            password: "111111"            // 密码输入框默认显示"111111"
          }}
          onFinish={onFinish}             // 表单提交时调用的函数，就是上面定义的onFinish
          autoComplete="off"              // 关闭浏览器的自动填充功能
        >
          {/* 
            用户名输入框组件
            Form.Item是表单项的容器，包含标签、输入框、验证规则等
          */}
          <Form.Item 
            label="用户名"                // 显示在输入框前面的标签文字
            name="username"               // 字段名称，提交时数据的key
            rules={[{                     // 验证规则数组
              required: true,             // 必填字段，不能为空
              message: "请输入用户名!"     // 验证失败时显示的错误信息
            }]}
          >
            {/* 普通的文本输入框，用户可以输入用户名 */}
            <Input />
          </Form.Item>

          {/* 
            密码输入框组件
            结构和用户名输入框类似
          */}
          <Form.Item 
            label="密码"                  // 标签文字
            name="password"               // 字段名称
            rules={[{                     // 验证规则
              required: true,             // 必填
              message: "请输入用户名密码!" // 错误信息
            }]}
          >
            {/* 
              密码输入框，输入的内容会被遮盖显示为圆点
              Input.Password是Ant Design提供的密码专用输入框
            */}
            <Input.Password />
          </Form.Item>

          {/* 
            提交按钮区域
            wrapperCol={{ span: 24 }}表示这一行占满整个宽度
          */}
          <Form.Item wrapperCol={{ span: 24 }}>
            {/* 
              登录按钮
              type="primary"：蓝色的主要按钮样式
              htmlType="submit"：HTML中的提交按钮类型，点击会触发表单提交
              className="login-btn"：自定义CSS类名，用于设置按钮样式
            */}
            <Button type="primary" htmlType="submit" className="login-btn">
              登录
            </Button>
            
            {/* 换行 */}
            <br />
            <br />
            
            {/* 提示信息，告诉用户默认的用户名和密码 */}
            <p>用户名:admin 密码:111111</p>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

// 导出Login组件，供其他文件导入使用
export default Login;