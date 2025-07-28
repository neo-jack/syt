// 从 'react' 库中导入 React 本身，以及 useEffect 和 useState 这两个核心 Hooks
// React 是构建用户界面的基础
// useEffect 用于处理组件加载后的操作，比如从服务器获取数据
// useState 用于在组件中创建和管理状态（可以变化的数据）
import React, { useEffect, useState } from "react";
// 从 'antd' UI 组件库中导入卡片（Card）、描述列表（Descriptions）和按钮（Button）组件
// antd 是一个流行的 React UI 库，可以让我们快速搭建出漂亮的界面
import { Card, Descriptions, Button } from "antd";
// 从 'react-router-dom' 库中导入 useParams 和 useNavigate 这两个 Hooks
// useParams 用于获取 URL 地址栏中的参数，比如订单的 ID
// useNavigate 用于实现页面间的跳转功能
import { useParams, useNavigate } from "react-router-dom";
// 从我们自己封装的 API 文件中，导入 getById 函数
// 这个函数的作用是根据订单的ID，向服务器发送请求，获取该订单的详细信息
import { getById } from "@/api/order/orderInfo";

// 定义一个名为 OrderListShow 的 React 函数组件，用于显示订单详情
function OrderListShow() {
	// 使用 useParams hook 获取 URL 中的动态参数。例如，如果 URL 是 /order/show/123，params 会是 { id: '123' }
	const params = useParams();
	// 使用 useNavigate hook 获取一个 navigate 函数，我们可以调用这个函数来跳转到其他页面
	const navigate = useNavigate();

	// 使用 useState 创建一个名为 'orderInfo' 的 state 变量，用来存储订单的详细信息
	// 初始值设置为 { param: {} } 是为了防止在数据还没从服务器加载回来时，代码读取 orderInfo.param.orderStatusString 这样的深层属性而报错
	const [orderInfo, setOrderInfo] = useState<any>({ param: {} });
	// 使用 useState 创建一个名为 'patientInfo' 的 state 变量，用来存储就诊人的详细信息
	// 初始值 { param: {} } 也是出于同样的安全考虑
	const [patientInfo, setPatientInfo] = useState<any>({ param: {} });

	// 使用 useEffect hook 来在组件第一次渲染到屏幕后执行某些操作
	useEffect(() => {
		// 定义一个异步函数 getInfo，用于封装获取订单详情的整个逻辑
		const getInfo = async () => {
			// 调用我们导入的 getById 函数，并把从 URL 中获取的订单 ID (params.id) 传给它
			// `+(params.id as string)` 这部分代码的意思是：
			// 1. `params.id as string`：告诉 TypeScript 我们确定 params.id 是一个字符串
			// 2. `+`：使用一元加号操作符，快速将这个字符串类型的 ID 转换为数字类型，因为 getById 函数可能需要一个数字参数
			const data = await getById(+(params.id as string));
			// 请求成功后，服务器会返回一个包含 orderInfo 和 patient 的对象
			// 我们使用 setOrderInfo 函数，将返回的订单信息更新到 orderInfo state 中
			setOrderInfo(data.orderInfo);
			// 使用 setPatientInfo 函数，将返回的就诊人信息更新到 patientInfo state 中
			setPatientInfo(data.patient);
		};
		// 调用上面定义的 getInfo 函数，开始执行获取数据的流程
		getInfo();
		// useEffect 的第二个参数是依赖数组。这里我们传入一个空数组 []，
		// 意味着这个 effect 只在组件首次加载时运行一次，之后就不会再重复运行了。
	}, []);

	// return 语句返回的是这个组件要渲染到页面上的 JSX 内容
	return (
		// 使用 antd 的 Card 组件作为最外层的容器，让页面内容以卡片的形式展示
		<Card>
			{/* 使用 antd 的 Descriptions 组件来展示一组描述性的键值对数据 */}
			{/* title 属性设置这个描述列表的标题为“订单信息” */}
			{/* bordered 属性让描述列表带有边框，看起来更清晰 */}
			<Descriptions title="订单信息" bordered>
				{/* Descriptions.Item 代表描述列表中的一项 */}
				{/* label 属性是该项的标签（标题） */}
				{/* span={2} 表示这一项要占据2个栅格栏位（antd的Descriptions默认是3栏布局）*/}
				<Descriptions.Item label="订单交易号" span={2}>
					{/* 花括号 {} 中是我们要显示的动态数据，这里显示订单的交易号 */}
					{orderInfo.outTradeNo}
				</Descriptions.Item>
				<Descriptions.Item label="医院名称" span={2}>
					{/* 显示订单关联的医院名称 */}
					{orderInfo.hosname}
				</Descriptions.Item>
				<Descriptions.Item label="科室名称" span={2}>
					{/* 显示订单关联的科室名称 */}
					{orderInfo.depname}
				</Descriptions.Item>
				<Descriptions.Item label="医生职称" span={2}>
					{/* 显示医生的职称 */}
					{orderInfo.title}
				</Descriptions.Item>
				<Descriptions.Item label="安排日期" span={2}>
					{/* 显示预约的就诊日期 */}
					{orderInfo.reserveDate}
				</Descriptions.Item>
				<Descriptions.Item label="预约号序" span={2}>
					{/* 显示预约的序号 */}
					{orderInfo.number}
				</Descriptions.Item>
				<Descriptions.Item label="医事服务费" span={2}>
					{/* 显示挂号的费用 */}
					{orderInfo.amount}
				</Descriptions.Item>
				<Descriptions.Item label="建议取号时间" span={2}>
					{/* 显示建议的取号时间 */}
					{orderInfo.fetchTime}
				</Descriptions.Item>
				<Descriptions.Item label="取号地点" span={2}>
					{/* 显示取号的具体地点 */}
					{orderInfo.fetchAddress}
				</Descriptions.Item>
				<Descriptions.Item label="退号时间" span={2}>
					{/* 显示订单的退号截止时间 */}
					{orderInfo.quitTime}
				</Descriptions.Item>
				<Descriptions.Item label="订单状态" span={2}>
					{/* 显示订单的状态文字，比如“已支付”、“已取消”等 */}
					{orderInfo.param.orderStatusString}
				</Descriptions.Item>
				<Descriptions.Item label="预约时间" span={2}>
					{/* 显示订单的创建时间 */}
					{orderInfo.createTime}
				</Descriptions.Item>
			</Descriptions>

			{/* 这是第二个 Descriptions 组件，用于显示就诊人的信息 */}
			{/* style 属性用于添加内联 CSS 样式，这里设置了20像素的上下外边距，让它和上面的列表隔开一些距离 */}
			<Descriptions title="就诊人信息" bordered style={{ margin: "20px 0" }}>
				<Descriptions.Item label="姓名" span={2}>
					{/* 显示就诊人的姓名 */}
					{patientInfo.name}
				</Descriptions.Item>
				<Descriptions.Item label="证件类型" span={2}>
					{/* 显示就诊人的证件类型文字，比如“身份证” */}
					{patientInfo.param.certificatesTypeString}
				</Descriptions.Item>
				<Descriptions.Item label="证件编号" span={2}>
					{/* 显示就诊人的证件号码 */}
					{patientInfo.certificatesNo}
				</Descriptions.Item>
				<Descriptions.Item label="性别" span={2}>
					{/* 使用三元运算符进行判断：如果 patientInfo.sex 的值为真(通常是1或true)，则显示“男”，否则显示“女” */}
					{patientInfo.sex ? "男" : "女"}
				</Descriptions.Item>
				<Descriptions.Item label="出生年月" span={2}>
					{/* 显示就诊人的出生日期 */}
					{patientInfo.birthdate}
				</Descriptions.Item>
				<Descriptions.Item label="手机" span={2}>
					{/* 显示就诊人的手机号码 */}
					{patientInfo.phone}
				</Descriptions.Item>
				<Descriptions.Item label="是否结婚" span={2}>
					{/* 同样使用三元运算符判断婚姻状况 */}
					{patientInfo.isMarry ? "已婚" : "未婚"}
				</Descriptions.Item>
				<Descriptions.Item label="地址" span={2}>
					{/* 显示就诊人的完整地址 */}
					{patientInfo.param.fullAddress}
				</Descriptions.Item>
				<Descriptions.Item label="联系人姓名" span={2}>
					{/* 显示紧急联系人的姓名 */}
					{patientInfo.contactsName}
				</Descriptions.Item>
				<Descriptions.Item label="联系人证件类型" span={2}>
					{/* 显示紧急联系人的证件类型文字 */}
					{patientInfo.param.contactsCertificatesTypeString}
				</Descriptions.Item>
				<Descriptions.Item label="联系人证件号" span={2}>
					{/* 显示紧急联系人的证件号码 */}
					{patientInfo.contactsCertificatesNo}
				</Descriptions.Item>
				<Descriptions.Item label="联系人手机" span={2}>
					{/* 显示紧急联系人的手机号码 */}
					{patientInfo.contactsPhone}
				</Descriptions.Item>
			</Descriptions>

			{/* antd 的 Button 按钮组件 */}
			{/* onClick 事件绑定了一个箭头函数，当用户点击这个按钮时，会执行这个函数 */}
			<Button onClick={() => navigate("/order/orderInfo/list")}>返回</Button>
		</Card>
	);
}

// 将 OrderListShow 组件作为默认导出，这样其他文件就可以通过 import 导入并使用它
export default OrderListShow;
