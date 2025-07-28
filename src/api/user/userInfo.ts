// 从工具目录导入封装好的HTTP请求函数
// 这个request函数是对axios的二次封装，用来发送网络请求
import { request } from "@/utils/http";

// 定义API接口的基础路径
// 这个变量存储了所有用户相关接口的公共路径部分
// 相当于给所有用户API加了一个统一的前缀
const api_name = "/admin/user";

/**
 * 获取用户列表的分页数据
 * 这个函数用来从服务器获取用户信息列表，支持分页和搜索功能
 * 
 * @param page - 当前页码，比如第1页、第2页等
 * @param limit - 每页显示多少条数据，比如每页显示10条或20条
 * @param searchObj - 搜索条件对象，包含各种筛选条件（比如按姓名搜索、按状态筛选等）
 * @returns 返回一个Promise，包含用户列表数据
 */
export const getPageList = (page: number, limit: number, searchObj: any): any => {
  // 使用request函数发送GET请求到服务器
  return request({
    // 拼接完整的请求地址，格式为：/admin/user/页码/每页条数
    // 比如：/admin/user/1/10 表示获取第1页，每页10条数据
    url: `${api_name}/${page}/${limit}`,
    // 指定请求方法为GET，用于获取数据
    method: "get",
    // 将搜索条件作为查询参数发送
    // 比如：?name=张三&status=1 这样的查询参数
    params: searchObj,
  });
};

/**
 * 锁定或解锁用户账户
 * 这个函数用来改变用户账户的锁定状态
 * 管理员可以锁定违规用户，也可以解锁被误锁的用户
 * 
 * @param id - 用户的唯一标识ID，用来确定要操作哪个用户
 * @param status - 锁定状态，通常0表示解锁，1表示锁定
 */
export const lock = (id: number, status: number) => {
  // 发送GET请求来改变用户锁定状态
  return request({
    // 拼接请求地址，格式为：/admin/user/lock/用户ID/状态值
    // 比如：/admin/user/lock/123/1 表示锁定ID为123的用户
    url: `${api_name}/lock/${id}/${status}`,
    // 使用GET方法发送请求
    method: "get",
  });
};

/**
 * 查看用户详细信息
 * 这个函数用来获取某个特定用户的完整信息
 * 通常用于查看用户详情页面，显示用户的所有相关信息
 * 
 * @param id - 用户的唯一标识ID
 * @returns 返回该用户的详细信息，包括基本信息、认证信息、就诊人信息等
 */
export const show = (id: number): any => {
  // 发送GET请求获取用户详细信息
  return request({
    // 拼接请求地址，格式为：/admin/user/show/用户ID
    // 比如：/admin/user/show/123 表示查看ID为123的用户信息
    url: `${api_name}/show/${id}`,
    // 使用GET方法获取数据
    method: "get",
  });
};

/**
 * 审核用户认证信息
 * 这个函数用来处理用户的实名认证审核
 * 管理员可以通过或拒绝用户的认证申请
 * 
 * @param id - 用户的唯一标识ID
 * @param authStatus - 认证状态，通常1表示审核通过，2表示审核拒绝
 */
export const approval = (id: number, authStatus: number) => {
  // 发送GET请求来更新用户的认证状态
  return request({
    // 拼接请求地址，格式为：/admin/user/approval/用户ID/认证状态
    // 比如：/admin/user/approval/123/1 表示通过ID为123用户的认证
    url: `${api_name}/approval/${id}/${authStatus}`,
    // 使用GET方法发送请求
    method: "get",
  });
};