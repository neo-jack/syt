// 从工具目录导入封装好的HTTP请求函数
// 这个request是对axios网络请求库的二次封装
// 用来向服务器发送请求，获取数据或提交数据
import { request } from "@/utils/http";

// 从同级目录的model文件夹导入TypeScript类型定义
// type表示这是一个类型导入，只在编译时使用，不会出现在最终的JavaScript代码中
// GetOrderListResponse是定义订单列表接口返回数据结构的类型
import type { GetOrderListResponse } from "./model/orderTypes";

// 这里是一行普通的注释，说明这个函数的作用
// 获取订单数据

/**
 * 获取订单列表数据的函数
 * 这个函数用来从服务器获取订单信息的分页列表
 * 主要用于订单管理页面显示所有订单的表格数据
 * 
 * @param page - 当前页码，表示要获取第几页的数据（比如第1页、第2页等）
 * @param limit - 每页显示的数据条数（比如每页显示10条、20条或50条订单）
 * 
 * @returns 返回一个Promise对象，包含订单列表数据
 *   返回的数据结构遵循GetOrderListResponse类型定义
 *   通常包含：
 *   - records: 订单列表数组，包含每个订单的详细信息
 *   - total: 订单总数，用于分页计算
 */
export const reqGetOrderList = (page: number, limit: number) => {
  // 使用request对象的get方法发送GET请求
  // get方法专门用于获取数据，不会修改服务器上的数据
  return request.get<any, GetOrderListResponse>(
    // 请求的URL地址，使用模板字符串拼接
    // `/admin/order/orderInfo/${page}/${limit}` 会变成类似：
    // "/admin/order/orderInfo/1/10" （获取第1页，每页10条数据）
    // "/admin/order/orderInfo/2/20" （获取第2页，每页20条数据）
    `/admin/order/orderInfo/${page}/${limit}`
  );
  
  // request.get<any, GetOrderListResponse> 的两个类型参数说明：
  // - 第一个any: 请求参数的类型，这里用any表示可以是任意类型
  // - 第二个GetOrderListResponse: 服务器返回数据的类型，确保返回的数据结构正确
};