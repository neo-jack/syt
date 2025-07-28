// 从 'react' 库中导入 React。写 React 组件前必须先导入它。
import React from "react";
// 从 'antd' 这个UI组件库中，导入 Result 和 Button 两个组件。
// Result 组件用于展示操作结果，比如成功、失败、或者像这里的“未找到页面”。
// Button 组件就是一个按钮。
import { Result, Button } from "antd";
// 从 'react-router-dom' 这个专门管理页面跳转（路由）的库中，导入 useNavigate 这个工具。
// 这个工具可以帮助我们实现点击按钮后跳转到其他页面的功能。
import { useNavigate } from "react-router-dom";

// 定义一个名为 NotFound 的函数组件。这个组件就是当用户访问一个不存在的网址时会看到的“404-找不到页面”。
function NotFound() {
	// 调用 useNavigate() 这个函数，它会返回一个专门用来跳转页面的新函数，我们把这个新函数命名为 navigate。
	const navigate = useNavigate();

	// return 后面括号里的内容，就是这个组件最终在网页上显示的样子。
	return (
		// 使用我们从 antd 库导入的 Result 组件，来创建一个标准的提示页面。
		<Result
			// status="404" 是告诉 Result 组件，我们要显示一个“404 Not Found”的状态。
			// antd 会根据这个状态，自动显示一个代表“404”的图标。
			status="404"
			// title="404" 是设置这个 Result 组件的主标题文字。
			title="404"
			// subTitle="..." 是设置副标题的文字，用来给用户更详细的提示。
			subTitle="找不到页面"
			// extra 属性可以让我们在 Result 组件下面添加一些额外的内容，这里我们放一个按钮。
			extra={
				// 使用从 antd 库导入的 Button 组件，来创建一个可以点击的按钮。
				// type="primary" 是设置按钮的样式为“主要按钮”，通常是醒目的蓝色。
				// onClick={...} 是给按钮绑定一个点击事件。当用户点击这个按钮时，就会执行里面的代码。
				// () => navigate("/syt/dashboard") 是一个箭头函数，意思是“当点击时，调用 navigate 函数，并跳转到 '/syt/dashboard' 这个网址（通常是首页）”。
				<Button type="primary" onClick={() => navigate("/syt/dashboard")}>
					{/* 这里是按钮上显示的文字 */}
					返回首页
				</Button>
			}
		/>
	);
}

// 使用 export default 语法，将 NotFound 这个组件导出去。
// 这样，项目的其他部分（比如路由配置文件）就可以使用这个我们创建的 404 页面了。
export default NotFound;
