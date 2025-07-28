// 这是一个数据字典相关的API接口文件
// 数据字典是什么？简单说就是系统中各种选项数据的统一管理
// 比如：省市区信息、医院等级、科室分类等这些固定的选项数据

// 从工具文件夹导入HTTP请求工具
// request是一个封装好的网络请求函数，用来和后端服务器通信
import { request } from "@utils/http";

// 定义API的基础路径
// 这个路径是所有数据字典接口的共同前缀
// "/admin/cmn/dict" 表示这是管理员模块下的通用数据字典接口
const api_name = "/admin/cmn/dict";

/**
 * 根据字典编码查找数据字典
 * @param dictCode 字典编码 - 这是一个字符串，用来标识不同类型的数据字典
 * 比如："Province" 表示省份数据，"HosType" 表示医院类型数据
 * @returns 返回对应的数据字典列表
 * 
 * 使用场景举例：
 * - 当需要获取所有省份列表时，传入 "Province"
 * - 当需要获取医院等级列表时，传入 "Hostype"
 */
export const findByDictCode = (dictCode: string): any => {
  // 发起GET请求到服务器
  // ${dictCode} 会被替换成实际传入的字典编码
  // 最终的请求地址类似：/admin/cmn/dict/findByDictCode/Province
  return request({
    url: `${api_name}/findByDictCode/${dictCode}`, // 拼接完整的请求地址
    method: "get", // 使用GET方法，表示我们要获取数据（不是修改数据）
  });
};

/**
 * 根据父级ID查找下级数据字典
 * @param parentId 父级ID - 这是一个数字，表示上一级数据的ID
 * 比如：选择了"北京市"，想要获取北京市下面的所有区县
 * 
 * @returns 返回该父级下的所有子级数据列表
 * 
 * 使用场景举例：
 * - 用户选择了"北京市"（假设ID是1），传入1就能获取北京市的所有区县
 * - 用户选择了"朝阳区"（假设ID是101），传入101就能获取朝阳区的所有街道
 * 
 * 这种设计叫做"级联查询"，就像套娃一样，一层套一层
 */
export const findByParentId = (parentId: number): any => {
  // 发起GET请求到服务器
  // ${parentId} 会被替换成实际传入的父级ID
  // 最终的请求地址类似：/admin/cmn/dict/findByParentId/1
  return request({
    url: `${api_name}/findByParentId/${parentId}`, // 拼接完整的请求地址
    method: "get", // 使用GET方法获取数据
  });
};

/**
 * 导出数据字典数据
 * 这个功能是将数据字典导出成文件（比如Excel文件）
 * 管理员可以下载这个文件，用于备份或者在其他地方使用
 * 
 * @returns 返回可下载的文件数据
 * 
 * 使用场景：
 * - 系统管理员想要备份所有的数据字典
 * - 需要将数据字典提供给其他系统使用
 * - 生成报表或文档时需要完整的数据字典信息
 */
export const exportData = () => {
  // 发起GET请求到服务器获取导出数据
  // 注意：这里没有参数，因为是导出所有的数据字典
  return request({
    url: `${api_name}/exportData`, // 完整的导出接口地址
    method: "get", // 使用GET方法获取导出数据
  });
};

// 文件总结：
// 这个文件定义了3个主要功能：
// 1. 按编码查字典 - 获取某一类的所有数据（如所有省份）
// 2. 按父ID查字典 - 获取某个数据下的子数据（如某省下的所有市）
// 3. 导出字典数据 - 将所有数据导出成文件
// 
// 这些功能组合起来，就能完成复杂的数据字典管理，
// 比如实现省市区的三级联动选择功能
