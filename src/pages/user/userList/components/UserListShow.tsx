// 导入 React 库以及 'useState' 和 'useEffect' 这两个非常重要的 Hook。
// React 是构建用户界面的基础库。
// 'useState' 让你在函数组件中拥有自己的“状态”（可以随时间改变的数据）。
// 'useEffect' 让你在组件渲染后执行一些“副作用”操作，比如从服务器获取数据。
import React, { useState, useEffect } from "react";
// 从 antd UI 库中导入需要的组件。
// Card: 卡片组件，用来把相关信息包裹在一个漂亮的容器里。
// Descriptions: 描述列表组件，非常适合展示键值对形式的只读信息。
// Button: 按钮组件。
// Table: 表格组件，用来展示多行多列的结构化数据。
import { Card, Descriptions, Button, Table } from "antd";
// 从 react-router-dom 库导入两个 Hook，用于处理页面路由和导航。
// useParams: 用来获取当前页面 URL 中的动态参数（比如 /user/show/123 里的 '123'）。
// useNavigate: 用来获取一个可以让你在代码中跳转到其他页面的函数。
import { useParams, useNavigate } from "react-router-dom";
// 从封装好的 API 文件中导入 'show' 函数。这个函数专门用来请求后端接口，获取单个用户的详细信息。
import { show } from "@/api/user/userInfo";

// 定义并导出一个名为 'UserListShow' 的 React 函数组件。
// 这个组件的功能是展示一个用户的详细信息，包括基本信息、认证信息以及该用户关联的就诊人列表。
function UserListShow() {
	// 调用 'useParams' Hook 来获取 URL 中的参数。'params' 会是一个对象，比如 { id: '123' }。
	const params = useParams();
	// 调用 'useNavigate' Hook 来获取 'navigate' 函数，以便后续进行页面跳转。
	const navigate = useNavigate();
	// 使用 'useState' 创建一个名为 'userInfo' 的状态，用来存储从服务器获取的用户详细信息。
	// 初始值是一个对象 `{ param: {} }`，这样在数据还没加载完成时，代码去访问 `userInfo.param.xxx` 就不会因为 `param` 不存在而报错，这是一种保护性写法。
	// `<any>` 是 TypeScript 的语法，表示我们暂时不限制这个状态的具体类型。
	const [userInfo, setUserInfo] = useState<any>({
		param: {},
	});
	// 使用 'useState' 创建一个名为 'patientList' 的状态，用来存储该用户关联的就诊人列表。
	// 初始值是一个空数组 `[]`。
	const [patientList, setPatientList] = useState<any>([]);

	// 使用 'useEffect' Hook 来在组件第一次加载时从服务器获取数据。
	// 第二个参数 `[]` (空数组) 告诉 React 这个 effect 只在组件首次渲染到屏幕上之后执行一次，之后就不再执行了。
	useEffect(() => {
		// 在 'useEffect' 内部定义一个异步函数 'getUserInfo'。
		// 这是推荐的做法，因为 'useEffect' 的第一个参数函数本身不能直接是异步的。
		const getUserInfo = async () => {
			// 调用从 API 文件导入的 'show' 函数，并把从 URL 中获取的 id 传给它。
			// `params.id` 默认是字符串，我们用 `+` 号把它转换成数字类型。 `as string` 是告诉 TypeScript 我们确定它是个字符串。
			const data = await show(+(params.id as string));
			// 请求成功后，服务器会返回数据。我们用 'setUserInfo' 函数把返回的用户信息部分更新到组件的状态中。
			setUserInfo(data.userInfo);
			// 同时，用 'setPatientList' 函数把返回的就诊人列表部分更新到状态中。
			setPatientList(data.patientList);
		};

		// 调用上面定义的函数来真正地执行数据获取操作。
		getUserInfo();
	}, []); // 空依赖数组，确保这个 effect 只运行一次。

	// 定义 'columns' 数组，这个数组是 antd Table 组件的配置信息，它描述了表格有哪几列，每一列长什么样。
	const columns = [
		{
			title: "序号", // 表头显示的文字。
			key: "index", // 这一列的唯一标识。
			// 'render' 函数用来定制这一列的显示内容。
			render: (_a: any, _b: any, index: number) => {
				// 通过行索引 `index` (从0开始) + 1 来生成从 1 开始的序号。
				return index + 1;
			},
		},
		{
			title: "姓名",
			dataIndex: "name", // 'dataIndex' 告诉表格，这一列的数据直接取自每行数据对象里的 'name' 属性。
			key: "name",
		},
		{
			title: "证件类型",
			key: "certificatesTypeString",
			// 使用 'render' 函数，因为证件类型的数据在下一层对象里。
			render: (row: any) => row.param.certificatesTypeString,
		},

		{
			title: "证件编号",
			key: "certificatesNo",
			dataIndex: "certificatesNo",
		},
		{
			title: "性别",
			dataIndex: "sex",
			key: "sex",
			// 'render' 接收该单元格的数据 'sex' (可能是 1 或 0)，并根据它的值返回 '男' 或 '女'。
			render: (sex: number) => (sex ? "男" : "女"),
		},
		{
			title: "出生年月",
			key: "birthdate",
			dataIndex: "birthdate",
		},
		{
			title: "手机",
			key: "phone",
			dataIndex: "phone",
		},
		{
			title: "是否结婚",
			key: "isMarry",
			dataIndex: "isMarry",
			// 类似于性别，根据 'isMarry' 的值（1 或 0）来显示 '已婚' 或 '未婚'。
			render: (isMarry: number) => (isMarry ? "已婚" : "未婚"),
		},
		{
			title: "地址",
			dataIndex: "address",
			key: "address",
		},
		{
			title: "注册时间",
			dataIndex: "createTime",
			key: "createTime",
		},
	];

	// 这是组件的渲染部分，返回 JSX 来描述页面结构。
	return (
		// 使用 Card 组件作为整个页面的容器。
		<Card>
			{/* 使用 antd 的 Descriptions 组件来展示用户信息，非常适合键值对的展示。 */}
			<Descriptions title="用户信息" bordered>
				{/* Descriptions.Item 定义了描述列表中的一项。 */}
				{/* 'label' 是左侧的标签文字，'span={2}' 用来控制布局，占据两栏。 */}
				<Descriptions.Item label="手机号" span={2}>
					{/* 花括号 {} 中是 JavaScript 表达式，用来显示 'userInfo' 状态中的 'phone' 属性。 */}
					{userInfo.phone}
				</Descriptions.Item>
				<Descriptions.Item label="用户姓名" span={2}>
					{userInfo.name}
				</Descriptions.Item>
				<Descriptions.Item label="状态" span={2}>
					{/* 注意这里访问的是 'userInfo.param.statusString'。 */}
					{userInfo.param.statusString}
				</Descriptions.Item>
				<Descriptions.Item label="注册时间" span={2}>
					{userInfo.createTime}
				</Descriptions.Item>
			</Descriptions>

			{/* 第二个 Descriptions 组件，用来展示用户的实名认证信息。 */}
			{/* `style={{ marginTop: 20 }}` 给这个组件添加了20像素的上边距，让它和上面的信息块分开一些。 */}
			<Descriptions title="认证信息" bordered style={{ marginTop: 20 }}>
				<Descriptions.Item label="姓名" span={2}>
					{userInfo.name}
				</Descriptions.Item>
				<Descriptions.Item label="证件类型" span={2}>
					{userInfo.param.certificatesTypeString}
				</Descriptions.Item>
				<Descriptions.Item label="证件号" span={2}>
					{userInfo.certificatesNo}
				</Descriptions.Item>
				<Descriptions.Item label="证件图片" span={2}>
					{userInfo.certificatesUrl}
				</Descriptions.Item>
			</Descriptions>

			{/* 这是一个自定义的区域，用来显示就诊人信息列表。 */}
			<div style={{ margin: "20px 0" }}>
				{/* 这两行 div 是为了模仿 antd Descriptions 组件的标题和视图样式，使页面风格统一。 */}
				<div className="ant-descriptions-title">就诊人信息</div>
				<div className="ant-descriptions-view">
					{/* 使用 antd 的 Table 组件来展示就诊人列表。 */}
					<Table
						style={{ marginTop: 20 }}
						columns={columns} // 'columns' 属性接收我们上面定义好的列配置。
						dataSource={patientList} // 'dataSource' 属性接收我们存储在状态里的就诊人数据数组。
						bordered // 'bordered' 属性给表格添加边框。
						rowKey="id" // 'rowKey' 告诉表格使用每条数据中的 'id' 字段作为唯一的行标识符。
						pagination={false} // 'pagination={false}' 表示这个表格不需要分页功能，会一次性展示所有数据。
					/>
				</div>
			</div>

			{/* 放置一个返回按钮。 */}
			{/* 当按钮被点击时 (`onClick` 事件)，执行 'navigate(-1)'。 */}
			{/* `navigate(-1)` 的作用是让页面返回到浏览器历史记录中的前一个页面，实现了“返回”功能。 */}
			<Button onClick={() => navigate(-1)}>返回</Button>
		</Card>
	);
}

// 默认导出这个组件，这样其他文件就可以通过 import 来使用它了。
export default UserListShow;
