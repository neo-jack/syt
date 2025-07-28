/**
 * 多语言文件内容收集工具函数
 * 
 * 这个文件的作用：
 * 1. 帮助项目支持多种语言（比如中文、英文）
 * 2. 自动收集某个文件夹下所有的语言翻译文件
 * 3. 把这些文件整理成一个对象，方便程序使用
 * 
 * 使用场景：
 * - 当用户切换语言时，程序可以显示对应的文字
 * - 比如登录按钮：中文显示"登录"，英文显示"Login"
 */

// 定义并导出getFilesContent函数
// 这个函数的作用：把多个分散的翻译文件合并成一个完整的翻译对象
// 参数langs的类型是webpack的RequireContext，它包含了通过require.context找到的所有文件
export const getFilesContent = (langs: __WebpackModuleApi.RequireContext) => {
  // 创建一个空对象，用来存放所有翻译内容
  // Record<string, any> 意思是：这是一个对象，键是字符串类型，值可以是任意类型
  const content: Record<string, any> = {};

  // 遍历所有找到的文件
  // langs.keys() 返回所有文件的路径数组，比如：["./app.ts", "./route.ts"]
  langs.keys().forEach((key: string) => {
    // 通过langs(key)加载具体的文件内容，然后取.default（因为文件用export default导出）
    // 比如：如果文件内容是 export default { title: "标题" }，这里就会得到 { title: "标题" }
    const langFileModule = langs(key).default;
    
    // 从文件路径中提取文件名（去掉"./"开头和".ts"结尾）
    // 比如："./app.ts" 会变成 "app"
    // slice(2, -3) 的意思是：从第2个字符开始，到倒数第3个字符结束
    const filename = key.slice(2, -3);
    
    // 把这个文件的翻译内容存到content对象中
    // 比如：content["app"] = { title: "标题", dashboard: "仪表板" }
    content[filename] = langFileModule;
  });

  // 返回合并后的完整翻译对象
  // 最终结果类似：{ app: {...}, route: {...}, hospitalSet: {...} }
  return content;
};
