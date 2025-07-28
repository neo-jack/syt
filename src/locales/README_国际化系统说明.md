# 国际化系统说明文档

## 什么是国际化？
国际化（i18n）就是让我们的网站支持多种语言。用户可以选择中文或英文来使用我们的系统。

## 文件结构说明

```
src/locales/                    # 国际化文件夹
├── helper.ts                   # 辅助函数文件
├── i18n.ts                     # 国际化配置文件
└── lang/                       # 语言文件夹
    ├── en_US.ts               # 英文语言包入口
    ├── zh_CN.ts               # 中文语言包入口
    ├── en_US/                 # 英文翻译文件夹
    │   ├── app.ts            # 应用基础翻译
    │   ├── hospitalSet.ts    # 医院设置翻译
    │   └── route.ts          # 路由翻译
    └── zh_CN/                 # 中文翻译文件夹
        ├── app.ts            # 应用基础翻译
        ├── hospitalSet.ts    # 医院设置翻译
        └── route.ts          # 路由翻译
```

## 工作流程

### 1. 准备翻译内容
- 每个功能模块都有自己的翻译文件（如：`hospitalSet.ts`）
- 文件内容是一个对象，包含键值对的翻译：
  ```typescript
  const hospitalSet = {
    addBtnText: "Add",        // 英文版本
    removeBtnText: "Remove"
  };
  ```

### 2. 合并翻译文件
- `en_US.ts` 和 `zh_CN.ts` 是入口文件
- 它们使用 `helper.ts` 中的 `getFilesContent` 函数
- 自动找到对应文件夹下的所有翻译文件并合并

### 3. 配置国际化系统
- `i18n.ts` 文件配置整个国际化系统
- 设置支持的语言、默认语言等
- 连接到React应用

### 4. 在组件中使用
```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <button>{t('hospitalSet.addBtnText')}</button>
  );
}
```

## 关键概念

### require.context()
这是webpack提供的功能，可以动态加载文件：
- `"./en_US"` - 要搜索的文件夹
- `true` - 是否搜索子文件夹
- `/\.ts$/` - 只要`.ts`结尾的文件

### getFilesContent函数
把多个分散的翻译文件合并成一个对象：
- 输入：多个独立的翻译文件
- 输出：一个包含所有翻译的大对象

### 翻译键的命名规则
格式：`模块名.键名`
- `hospitalSet.addBtnText` - 医院设置模块的添加按钮文本
- `app.title` - 应用基础模块的标题

## 添加新翻译的步骤

1. 在对应语言文件夹下找到相关模块文件
2. 添加新的翻译键值对
3. 在组件中使用 `t('模块名.键名')` 调用
4. 系统会根据当前语言自动显示对应文本

## 优势
- **自动化**：新增翻译文件会自动被加载
- **模块化**：每个功能模块的翻译独立管理
- **易维护**：修改翻译只需要修改对应文件
- **类型安全**：TypeScript提供类型检查 