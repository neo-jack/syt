// 导入i18next库的核心功能
// i18next是一个专门处理国际化（多语言）的JavaScript库
import i18n from "i18next";
// 导入react-i18next库，它让i18next可以在React项目中使用
import { initReactI18next } from "react-i18next";

// 导入英文翻译包（从我们刚才看到的en_US.ts文件）
// 这里会得到一个包含所有英文翻译的对象
import en_US from "./lang/en_US";
// 导入中文翻译包（从zh_CN.ts文件）
// 这里会得到一个包含所有中文翻译的对象
import zh_CN from "./lang/zh_CN";

// 导入Redux状态管理器，用来获取当前用户选择的语言
import { store } from "@/app/store";

// 创建语言资源对象
// 这个对象包含了所有支持的语言及其翻译内容
// 格式：{ 语言代码: 翻译对象 }
const resources = {
  zh_CN, // 中文翻译
  en_US, // 英文翻译
};

// 初始化i18next国际化系统
i18n
  .use(initReactI18next) // 让i18next支持React
  .init({
    // 设置所有可用的语言资源
    resources, // 所有语言包
    // 设置默认使用的语言
    // 从Redux store中获取用户之前选择的语言设置
    lng: store.getState().app.lang, // 初始化语言
    // 插值设置（处理翻译文本中的变量替换）
    interpolation: {
      // 不转义HTML字符，这样翻译文本中可以包含HTML标签
      escapeValue: false, // 不转义
    },
  });

// 导出配置好的i18n对象，供整个项目使用
export default i18n;
