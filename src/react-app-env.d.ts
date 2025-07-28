// 这是一个特殊的注释，被称为“三斜线指令”，它是专门给 TypeScript 编译器看的一种命令。
// 这行代码的作用是告诉 TypeScript 编译器：“请去加载 'react-scripts' 这个包里面提供的所有类型定义”。

// 那么，为什么要加载这些类型定义呢？
//
// 1. 项目背景：这个项目是用 Create React App (一个快速搭建 React 应用的工具) 创建的。
//    Create React App 内部使用了一个叫做 'react-scripts' 的包来处理所有的编译、启动、打包等复杂工作。
//
// 2. 特殊功能：'react-scripts' 为了让开发更方便，提供了一些默认不支持的“超能力”。
//    比如，它允许我们像导入一个 JavaScript 模块一样，直接在代码中导入图片、CSS、SVG等文件：
//    `import logo from './logo.svg';`
//
// 3. TypeScript 的困惑：标准的 TypeScript 并不认识这种操作。
//    在它看来，`.svg` 文件不是代码，所以 `import` 一个 `.svg` 文件是会报错的。
//
// 4. 解决方案：为了解决 TypeScript 的困惑，'react-scripts' 包里自带了一个“说明书”（也就是类型定义文件）。
//    这个“说明书”告诉 TypeScript：“当你看到有人导入 .svg 文件时，不要报错，你应该把它理解成一个字符串（图片的路径）”。
//
// 总结：
// `/// <reference types="react-scripts" />` 这行代码就像是在项目入口处贴上了一张告示，
// 确保 TypeScript 编译器能读懂 Create React App 环境下的所有特殊语法和功能，
// 从而让我们可以在项目里顺利地使用图片等静态资源，并且享受到完整的代码提示和类型检查。
// 这个文件通常是自动生成的，我们一般不需要去修改它。
/// <reference types="react-scripts" />
