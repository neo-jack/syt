// 从工具目录导入封装好的HTTP请求函数
// 这个request函数是对axios网络请求库的二次封装
// 用来向服务器发送各种类型的网络请求（GET、POST等）
import { request } from "@/utils/http";

// 定义订单相关API接口的基础路径
// 这是一个常量，存储了所有订单信息接口的公共URL前缀
// 后面所有的订单接口都会以这个路径开头，避免重复写相同的路径
const api_name = "/admin/order/orderInfo";

/**
 * 获取订单列表的分页数据（带搜索功能）
 * 这个函数用来从服务器获取医院预约订单的列表信息
 * 支持分页显示和多种条件搜索筛选
 * 主要用于订单管理页面显示订单表格
 * 
 * @param page - 当前页码，表示要获取第几页的数据
 *   比如：1表示第1页，2表示第2页，以此类推
 * @param limit - 每页显示的订单数量
 *   比如：10表示每页显示10条订单，20表示每页显示20条订单
 * @param searchObj - 搜索和筛选条件对象
 *   这个对象可能包含以下筛选条件：
 *   - hosname: 医院名称（比如"北京协和医院"）
 *   - outTradeNo: 订单交易号（比如"202312010001"）
 *   - patientName: 就诊人姓名（比如"张三"）
 *   - orderStatus: 订单状态（比如1表示已支付，0表示未支付）
 *   - createTimeBegin: 订单创建开始时间（比如"2023-01-01"）
 *   - createTimeEnd: 订单创建结束时间（比如"2023-12-31"）
 *   - reserveDate: 预约就诊日期（比如"2023-12-25"）
 * 
 * @returns 返回一个Promise，包含订单列表数据和总数
 *   返回的数据结构通常包含：
 *   - records: 订单数组，每个订单包含详细信息
 *   - total: 符合条件的订单总数，用于分页计算
 */
export const getPageList = (page: number, limit: number, searchObj: any): any => {
  // 使用request函数发送GET请求到服务器
  return request({
    // 拼接完整的请求地址
    // `${api_name}/${page}/${limit}` 会变成类似：
    // "/admin/order/orderInfo/1/10" （获取第1页，每页10条数据）
    // "/admin/order/orderInfo/2/20" （获取第2页，每页20条数据）
    url: `${api_name}/${page}/${limit}`,
    
    // 指定HTTP请求方法为GET
    // GET方法用于从服务器获取数据，不会修改服务器上的数据
    method: "get",
    
    // 将搜索条件作为查询参数发送给服务器
    // params会被转换成URL查询字符串的形式
    // 比如：?hosname=北京协和医院&orderStatus=1&page=1&limit=10
    // 服务器根据这些参数来筛选和分页返回订单数据
    params: searchObj,
  });
};

/**
 * 获取所有订单状态列表
 * 这个函数用来获取系统中所有可能的订单状态选项
 * 主要用于订单搜索表单中的状态下拉选择框
 * 让管理员可以按照不同状态筛选订单
 * 
 * @returns 返回一个Promise，包含所有订单状态的列表
 *   返回的数据通常是一个数组，每个状态包含：
 *   - status: 状态编号（比如0、1、2等数字）
 *   - comment: 状态描述（比如"未支付"、"已支付"、"已取消"等）
 *   
 *   例如返回数据：
 *   [
 *     { status: 0, comment: "未支付" },
 *     { status: 1, comment: "已支付" },
 *     { status: 2, comment: "已取消" }
 *   ]
 */
export const getStatusList = (): any => {
  // 发送GET请求获取订单状态列表
  return request({
    // 拼接请求地址："/admin/order/orderInfo/getStatusList"
    // 这是专门用于获取订单状态选项的接口
    url: `${api_name}/getStatusList`,
    
    // 使用GET方法获取数据
    method: "get",
    
    // 这个接口不需要任何参数，所以没有params属性
  });
};

/**
 * 根据订单ID获取单个订单的详细信息
 * 这个函数用来获取某个特定订单的完整详细信息
 * 主要用于订单详情页面，显示该订单的所有相关信息
 * 包括订单基本信息、就诊人信息、医院科室信息等
 * 
 * @param id - 订单的唯一标识ID，是一个数字
 *   比如：123、456等，每个订单都有唯一的ID
 * 
 * @returns 返回一个Promise，包含该订单的详细信息
 *   返回的数据通常包含：
 *   - orderInfo: 订单基本信息（订单号、医院、科室、费用、状态等）
 *   - patient: 就诊人详细信息（姓名、身份证、联系方式等）
 *   
 *   这些信息会在订单详情页面以表格形式展示给管理员查看
 */
export const getById = (id: number): any => {
  // 发送GET请求获取指定订单的详细信息
  return request({
    // 拼接请求地址，将订单ID嵌入到URL中
    // `${api_name}/show/${id}` 会变成类似：
    // "/admin/order/orderInfo/show/123" （获取ID为123的订单详情）
    // "/admin/order/orderInfo/show/456" （获取ID为456的订单详情）
    url: `${api_name}/show/${id}`,
    
    // 使用GET方法获取数据
    method: "get",
    
    // 这个接口不需要额外的查询参数，订单ID已经包含在URL路径中
  });
};