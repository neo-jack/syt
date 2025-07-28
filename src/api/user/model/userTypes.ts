// 这个文件是用来定义TypeScript类型的地方
// TypeScript类型就像是数据的"身份证"，告诉程序这个数据应该长什么样
// 有了类型定义，编辑器可以提示我们，帮我们避免写错代码

/**
 * 登录接口的返回数据类型
 * 当用户登录成功后，服务器会返回一个字符串类型的数据
 * 这个字符串通常是用户的身份令牌(token)，用来证明用户已经登录
 * 
 * export type 是定义类型别名的语法
 * LoginResponse 是我们给这个类型起的名字
 * = string 表示这个类型就是字符串类型
 */
export type LoginResponse = string

/**
 * 获取用户信息接口的返回数据类型
 * 当请求获取用户信息时，服务器会返回一个包含用户基本信息的对象
 * 
 * interface 是定义对象结构的语法，就像定义一个模板
 * 告诉程序这个对象里面应该包含哪些属性，每个属性是什么类型
 */
export interface GetUserInfoResponse {
  // name属性：用户的姓名，类型是字符串
  // string表示这是一个文本类型的数据，比如"张三"、"李四"等
  name: string;
  
  // avatar属性：用户的头像图片地址，类型是字符串  
  // 这里存储的是头像图片的网址链接，比如"https://example.com/avatar.jpg"
  avatar: string;
}