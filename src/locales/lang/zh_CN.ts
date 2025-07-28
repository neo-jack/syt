/**
 * 中文语言包主入口文件
 * 
 * 这个文件的作用是：
 * 1. 收集所有中文翻译文件
 * 2. 把它们整合成一个完整的中文语言包
 * 3. 提供给国际化系统使用，让网站可以显示中文界面
 */

// 导入帮助函数 getFilesContent
// 这个函数可以帮我们自动读取并整合多个翻译文件
import { getFilesContent } from "../helper";

// 使用 require.context 这个特殊函数来自动查找并加载文件
// 参数解释：
// "./zh_CN" - 在当前文件夹下的 zh_CN 文件夹中查找
// true - 是否在子文件夹中也查找（递归查找）
// /\.ts$/ - 只查找以 .ts 结尾的文件（正则表达式）
// 
// 简单理解：这行代码会自动找到 zh_CN 文件夹下所有的 .ts 文件
// 比如：route.ts, app.ts, hospitalSet.ts 等等
const langs = require.context("./zh_CN", true, /\.ts$/);

// 调用 getFilesContent 函数处理刚才找到的所有语言文件
// 这个函数会：
// 1. 读取每个 .ts 文件的内容
// 2. 把文件名作为键，文件内容作为值
// 3. 组合成一个大的对象，包含所有中文翻译
// 
// 最终结果类似：
// {
//   route: { dashboard: "首页", hospital: "医院管理", ... },
//   app: { ... },
//   hospitalSet: { ... }
// }
export default getFilesContent(langs);
