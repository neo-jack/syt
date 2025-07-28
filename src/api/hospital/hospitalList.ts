// 从工具目录导入封装好的HTTP请求函数
// 这个request是对axios网络请求库的二次封装
// 用来向服务器发送各种类型的网络请求
import { request } from "@/utils/http";

// 从同级目录的model文件夹导入TypeScript类型定义
// 这些类型定义了各种接口的参数和返回数据的结构
import {
  GetHospitalListParams,      // 获取医院列表的参数类型
  GetHospitalListResponse,    // 获取医院列表的返回数据类型
  CityList,                   // 城市列表的数据类型
  HospitalDetail,             // 医院详情的数据类型
  DepartmentList,             // 科室列表的数据类型
  GetScheduleRuleListParams,  // 获取排班规则列表的参数类型
  GetScheduleRuleListResponse,// 获取排班规则列表的返回数据类型
  GetDoctorListParams,        // 获取医生列表的参数类型
  DoctorList,                 // 医生列表的数据类型
  Status,                     // 医院状态的数据类型
} from "./model/hospitalListTypes";

// 获取医院列表的函数
/*
  这里是一段说明JavaScript解构语法的注释：
  
  // ...args 表示剩余参数，收集除了前面指定参数外的所有参数
  function fn(x, y, ...args) {}

  // { page, limit, ...params } 表示解构赋值
  // 从函数的第一个参数对象中提取page和limit属性
  // ...params 表示除了page和limit以外的其他所有属性
  function fn({ page, limit, ...params }) {}
*/

/**
 * 获取医院列表的分页数据（带搜索功能）
 * 这个函数用来从服务器获取所有合作医院的列表信息
 * 支持分页显示和多种条件搜索筛选
 * 主要用于医院管理页面显示医院列表表格
 * 
 * @param params - 包含分页和搜索条件的参数对象
 *   使用解构语法 { page, limit, ...params } 来分离参数：
 *   - page: 当前页码（第几页）
 *   - limit: 每页显示多少条医院数据
 *   - ...params: 其他搜索条件，比如：
 *     * hosname: 医院名称（如"北京协和医院"）
 *     * hoscode: 医院编码（如"1000_0"）
 *     * hostype: 医院类型（如"三甲医院"）
 *     * provinceCode: 省份代码
 *     * cityCode: 城市代码
 *     * districtCode: 区县代码
 *     * status: 医院状态（0下线，1上线）
 * 
 * @returns 返回一个Promise，包含医院列表数据和分页信息
 *   返回数据结构遵循GetHospitalListResponse类型：
 *   - content: 医院数组，每个医院包含详细信息
 *   - totalElements: 符合条件的医院总数
 *   - number: 当前页码
 *   - size: 每页条数
 */
export const reqGetHospitalList = ({ page, limit, ...params }: GetHospitalListParams) => {
  // 使用request对象的get方法发送GET请求
  return request.get<any, GetHospitalListResponse>(
    // 拼接请求URL，格式：/admin/hosp/hospital/页码/每页条数
    // 例如：/admin/hosp/hospital/1/10 表示获取第1页，每页10条数据
    `/admin/hosp/hospital/${page}/${limit}`, 
    {
      // 将除了page和limit之外的其他搜索条件作为查询参数发送
      // params会被转换成URL查询字符串
      // 例如：?hosname=协和医院&status=1&provinceCode=110000
      params,
    }
  );
};

// 这里是被注释掉的代码，可能是旧版本的获取省份列表的函数
// 获取省列表数据
// export const reqGetProvinceList = () => {
//   return request.get<any, any>(`/admin/cmn/dict/findByDictCode/province`);
// };

/**
 * 获取省/市/区列表数据（三级联动）
 * 这个函数用来获取中国行政区划的三级联动数据
 * 根据父级ID获取下一级的地区列表
 * 主要用于医院搜索表单中的地区选择下拉框
 * 
 * 使用场景：
 * - parentId=86：获取所有省份列表
 * - parentId=110000：获取北京市的所有区县
 * - parentId=120000：获取天津市的所有区县
 * 
 * @param parentId - 父级地区的ID编码
 *   - 86: 中国（获取所有省份）
 *   - 省份ID: 获取该省份下的所有城市
 *   - 城市ID: 获取该城市下的所有区县
 * 
 * @returns 返回一个Promise，包含下一级地区的列表数据
 *   每个地区项包含：
 *   - id: 地区ID
 *   - name: 地区名称（如"北京市"、"朝阳区"）
 *   - value: 地区编码
 */
export const reqGetCityList = (parentId: number) => {
  // 发送GET请求获取指定父级ID下的地区列表
  return request.get<any, CityList>(
    // 拼接请求URL，将父级ID嵌入到路径中
    // 例如：/admin/cmn/dict/findByParentId/86 获取所有省份
    // 例如：/admin/cmn/dict/findByParentId/110000 获取北京的区县
    `/admin/cmn/dict/findByParentId/${parentId}`
  );
};

/**
 * 根据医院ID获取医院详细信息
 * 这个函数用来获取某个特定医院的完整详细信息
 * 主要用于医院详情页面，显示医院的所有相关信息
 * 包括基本信息、预约规则、科室信息等
 * 
 * @param id - 医院的唯一标识ID，通常是一个字符串
 *   例如："1000_0"、"1000_1" 等医院编码
 * 
 * @returns 返回一个Promise，包含该医院的详细信息
 *   返回数据结构遵循HospitalDetail类型：
 *   - hospital: 医院基本信息（名称、地址、类型、状态等）
 *   - bookingRule: 预约规则（预约周期、开放时间、停止时间等）
 *   这些信息会在医院详情页面以描述列表形式展示
 */
export const reqGetHospitalById = (id: string) => {
  // 发送GET请求获取指定医院的详细信息
  return request.get<any, HospitalDetail>(
    // 拼接请求URL，将医院ID嵌入到路径中
    // 例如：/admin/hosp/hospital/show/1000_0
    `/admin/hosp/hospital/show/${id}`
  );
};

/**
 * 获取指定医院的科室列表
 * 这个函数用来获取某个医院下的所有科室信息
 * 主要用于医院排班管理页面，让管理员选择具体科室
 * 科室信息包括科室名称、科室代码、科室介绍等
 * 
 * @param hoscode - 医院编码，用来标识是哪个医院
 *   例如："1000_0" 表示某个具体医院的编码
 * 
 * @returns 返回一个Promise，包含该医院的所有科室列表
 *   返回数据结构遵循DepartmentList类型：
 *   科室数据通常按照一级科室和二级科室的层级结构组织
 *   每个科室包含：
 *   - depcode: 科室代码
 *   - depname: 科室名称（如"内科"、"外科"、"儿科"）
 *   - children: 下级科室列表（如"心内科"、"消化内科"）
 */
export const reqGetDepartmentList = (hoscode: string) => {
  // 发送GET请求获取指定医院的科室列表
  return request.get<any, DepartmentList>(
    // 拼接请求URL，将医院编码嵌入到路径中
    // 例如：/admin/hosp/department/1000_0
    `/admin/hosp/department/${hoscode}`
  );
};

/**
 * 获取医院科室的排班日期列表（分页）
 * 这个函数用来获取某个医院某个科室的排班日期信息
 * 显示哪些日期有医生排班，每个日期有多少号源等
 * 主要用于医院排班管理页面的日期选择和号源统计
 * 
 * @param params - 包含分页和筛选条件的参数对象
 *   - page: 当前页码
 *   - limit: 每页显示的日期数量
 *   - hoscode: 医院编码（如"1000_0"）
 *   - depcode: 科室编码（如"200040878"）
 * 
 * @returns 返回一个Promise，包含排班日期列表和分页信息
 *   返回数据结构遵循GetScheduleRuleListResponse类型：
 *   每个排班日期包含：
 *   - workDate: 排班日期（如"2023-12-25"）
 *   - reservedNumber: 已预约号源数
 *   - availableNumber: 剩余可预约号源数
 *   - totalNumber: 总号源数
 */
export const reqGetScheduleRuleList = ({ page, limit, hoscode, depcode }: GetScheduleRuleListParams) => {
  // 发送GET请求获取排班规则列表
  return request.get<any, GetScheduleRuleListResponse>(
    // 拼接请求URL，包含分页参数、医院编码和科室编码
    // 例如：/admin/hosp/schedule/getScheduleRule/1/10/1000_0/200040878
    // 表示获取第1页，每页10条，医院1000_0，科室200040878的排班数据
    `/admin/hosp/schedule/getScheduleRule/${page}/${limit}/${hoscode}/${depcode}`
  );
};

/**
 * 获取指定日期的医生排班列表
 * 这个函数用来获取某个医院某个科室在特定日期的所有医生排班信息
 * 显示当天有哪些医生出诊，每个医生的号源情况等
 * 主要用于医院排班管理页面显示具体某天的医生排班详情
 * 
 * @param params - 包含医院、科室和日期信息的参数对象
 *   - hoscode: 医院编码（如"1000_0"）
 *   - depcode: 科室编码（如"200040878"）
 *   - workDate: 工作日期（如"2023-12-25"）
 * 
 * @returns 返回一个Promise，包含该日期的医生排班列表
 *   返回数据结构遵循DoctorList类型：
 *   每个医生排班包含：
 *   - id: 排班ID
 *   - title: 医生职称（如"主任医师"、"副主任医师"）
 *   - docname: 医生姓名
 *   - skill: 医生擅长领域
 *   - workTime: 出诊时间（上午/下午）
 *   - reservedNumber: 已预约数
 *   - availableNumber: 可预约数
 *   - amount: 挂号费用
 */
export const reqGetDoctorList = ({ hoscode, depcode, workDate }: GetDoctorListParams) => {
  // 发送GET请求获取医生排班列表
  return request.get<any, DoctorList>(
    // 拼接请求URL，包含医院编码、科室编码和工作日期
    // 例如：/admin/hosp/schedule/findScheduleList/1000_0/200040878/2023-12-25
    // 表示获取医院1000_0的科室200040878在2023-12-25的医生排班
    `/admin/hosp/schedule/findScheduleList/${hoscode}/${depcode}/${workDate}`
  );
};

/**
 * 更新医院的上线/下线状态
 * 这个函数用来改变医院的运营状态
 * 管理员可以将医院设置为上线（可接受预约）或下线（暂停预约）
 * 主要用于医院列表页面的状态切换按钮
 * 
 * @param id - 医院的唯一标识ID
 *   例如："1000_0"、"1000_1" 等医院编码
 * @param status - 要设置的状态值
 *   通常：0 表示下线（暂停服务），1 表示上线（正常服务）
 *   Status类型定义了可用的状态值
 * 
 * @returns 返回一个Promise，操作成功后通常返回null
 *   这个接口主要用于状态更新，不返回具体数据
 *   前端可以根据请求成功来更新页面显示状态
 */
export const reqUpdateHospitalStatus = (id: string, status: Status) => {
  // 发送GET请求更新医院状态
  // 注意：虽然是状态更新操作，但这里使用的是GET请求
  // 这是因为后端接口设计为GET方式，实际项目中建议使用PUT或PATCH
  return request.get<any, null>(
    // 拼接请求URL，包含医院ID和新的状态值
    // 例如：/admin/hosp/hospital/updateStatus/1000_0/1
    // 表示将医院1000_0的状态设置为1（上线）
    `/admin/hosp/hospital/updateStatus/${id}/${status}`
  );
};