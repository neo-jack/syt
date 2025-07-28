// 从工具目录导入封装好的HTTP请求函数
// 这个request函数是对axios网络请求库的二次封装
// 用来向服务器发送网络请求，获取或提交数据
import { request } from "@/utils/http";

// 定义订单相关API接口的基础路径
// 这是一个常量，存储了所有订单信息接口的公共URL前缀
// 所有订单相关的请求都会以这个路径开头
const api_name = "/admin/order/orderInfo";

/**
 * 获取订单统计数据的函数
 * 这个函数主要用于统计订单的各种数量信息
 * 比如：今日订单数、本月订单数、各种状态的订单数量等
 * 通常用于管理后台的数据看板（Dashboard）展示统计图表
 * 
 * @param searchObj - 搜索和筛选条件对象
 *   这个参数包含各种筛选条件，例如：
 *   - 时间范围筛选（开始时间、结束时间）
 *   - 医院筛选（特定医院的订单统计）
 *   - 订单状态筛选（已支付、已取消等状态的订单）
 *   - 其他业务相关的筛选条件
 * 
 * @returns 返回一个Promise对象，包含各种统计数据
 *   返回的数据通常包括：
 *   - 不同状态订单的数量统计
 *   - 时间段内的订单趋势数据
 *   - 各医院、各科室的订单分布情况
 *   - 用于绘制图表的统计信息
 */
export const getCountMap = (searchObj: any): any => {
	// 使用request函数发送GET请求到服务器
	return request({
		// 拼接完整的请求地址
		// `${api_name}/getCountMap` 会变成："/admin/order/orderInfo/getCountMap"
		// 这是专门用于获取订单统计数据的接口地址
		url: `${api_name}/getCountMap`,
		
		// 指定HTTP请求方法为GET
		// GET方法用于从服务器获取数据，不会修改服务器上的数据
		method: "get",
		
		// 将搜索条件作为查询参数发送给服务器
		// params会被转换成URL查询字符串的形式
		// 例如：?startTime=2023-01-01&endTime=2023-12-31&hospitalId=1
		// 服务器根据这些参数来筛选和统计相应的订单数据
		params: searchObj,
	});
};