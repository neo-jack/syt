// 从上级目录的helper文件中导入getFilesContent函数
// 这个函数的作用是：帮助我们把多个翻译文件合并成一个完整的翻译对象
import { getFilesContent } from "../helper";

// 使用webpack的require.context功能来动态导入文件
// 这行代码的意思是：找到当前目录下的"en_US"文件夹中所有以".ts"结尾的文件
// 参数解释：
// "./en_US" - 要搜索的文件夹路径（相对于当前文件）
// true - 是否递归搜索子文件夹（true表示会搜索子文件夹）
// /\.ts$/ - 正则表达式，匹配以".ts"结尾的文件
const langs = require.context("./en_US", true, /\.ts$/);

// 调用getFilesContent函数，把找到的所有翻译文件合并成一个对象
// 比如：如果en_US文件夹里有app.ts、route.ts等文件
// 最终会合并成：{ app: {...}, route: {...} } 这样的对象结构
// 然后作为默认导出，供其他组件使用英文翻译
export default getFilesContent(langs);
