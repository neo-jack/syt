// 这个文件定义了医院管理相关的所有数据类型
// 类型定义就像是给数据制定规则，告诉程序每个数据应该是什么样子的
// 比如：医院名称必须是文字，医院状态必须是数字0或1

// 医院状态类型定义
// 0表示医院还没有上线（比如还在审核中），1表示医院已经上线可以使用
export type Status = 0 | 1;

// 搜索医院时可以使用的筛选条件
// 这就像是在购物网站上筛选商品，可以按品牌、价格、颜色等条件来筛选
export interface SearchHospitalListParams {
  hoscode?: string; // 医院编号 - 每个医院都有一个唯一的编号，就像身份证号
  hosname?: string; // 医院名称 - 比如"北京协和医院"、"上海第一人民医院"
  hostype?: string; // 医院等级 - 比如"三级甲等"、"二级甲等"，等级越高医院越好
  provinceCode?: string; // 省份代码 - 比如北京是"110000"，上海是"310000"
  cityCode?: string; // 城市代码 - 比如北京市是"110100"
  districtCode?: string; // 区县代码 - 比如朝阳区是"110105"
  status?: Status; // 医院状态 - 0表示未上线，1表示已上线
  // 注意：这里所有参数都有?号，表示这些条件都是可选的，可以只用其中几个来搜索
}

// 获取医院列表时需要的参数
// 除了上面的搜索条件，还需要分页参数（因为医院太多，需要分页显示）
export interface GetHospitalListParams extends SearchHospitalListParams {
  page: number; // 第几页 - 比如第1页、第2页
  limit: number; // 每页显示多少条数据 - 比如每页显示10条或20条
}

/*
  下面是服务器返回的真实医院数据的例子：
  这个大的JSON对象就是一个完整的医院信息
  {
    "content": [ // 这是医院列表数组，里面包含多个医院
      {
        "id": "622574cc36a9ba1be763dad8", // 医院的唯一标识ID
        "createTime": "2022-03-07 10:58:20", // 医院信息创建时间
        "updateTime": "2022-06-08 15:17:53", // 医院信息最后更新时间
        "isDeleted": 0, // 是否被删除：0表示没删除，1表示已删除
        "param": { // 额外的参数信息
          "hostypeString": "三级甲等", // 医院等级的文字描述
          "fullAddress": "北京市市辖区西城区大望路" // 医院的完整地址
        },
        "hoscode": "1000_0", // 医院编码
        "hosname": "北京协和医院", // 医院名称
        "hostype": "1", // 医院等级代码
        "provinceCode": "110000", // 省份代码
        "cityCode": "110100", // 城市代码  
        "districtCode": "110102", // 区县代码
        "address": "大望路", // 简单地址
        "logoData": "xxx" // 医院logo图片数据
        "intro": "医院介绍...", // 医院的详细介绍文字
        "route": "交通路线...", // 到医院的交通路线说明
        "status": 1, // 医院状态：1表示已上线
        "bookingRule": { // 预约挂号的规则
          "cycle": 10, // 预约周期：可以预约未来10天的号
          "releaseTime": "08:30", // 放号时间：每天8:30放号
          "stopTime": "11:30", // 停止挂号时间：11:30停止当天挂号
          "quitDay": -1, // 退号天数限制
          "quitTime": "15:30", // 退号时间限制：15:30后不能退号
          "rule": [ // 取号规则说明
            "西院区预约号取号地点：西院区门诊楼一层大厅挂号窗口取号",
            "东院区预约号取号地点：东院区老门诊楼一层大厅挂号窗口或新门诊楼各楼层挂号/收费窗口取号"
          ]
        }
      }
    ],
    "totalElements": 20, // 总共有多少家医院
  }
*/

// 单个医院的基本信息类型定义
// 这里只定义了在医院列表中显示的基本信息，不包括详细介绍等
export interface HospitalItem {
  id: string; // 医院的唯一标识，就像每个人都有身份证号
  createTime: string; // 医院信息创建时间，格式like "2022-03-07 10:58:20"
  param: { // 额外的显示信息
    hostypeString: string; // 医院等级的文字描述，比如"三级甲等"
    fullAddress: string; // 医院的完整地址，比如"北京市西城区大望路"
  };
  hosname: string; // 医院名称，比如"北京协和医院"
  logoData: string; // 医院的logo图片数据（通常是base64编码的图片）
  status: Status; // 医院状态：0表示未上线，1表示已上线
}

// 医院列表类型：就是多个医院组成的数组
export type HospitalListType = HospitalItem[];

// 获取医院列表时服务器返回的完整数据结构
export interface GetHospitalListResponse {
  content: HospitalListType; // 医院列表数据
  totalElements: number; // 总共有多少家医院（用于计算分页）
}

// 省市区三级分类数据结构
// 这就像是地址选择器，先选省，再选市，最后选区
export interface CityItem {
  id: number; // 地区的唯一标识数字
  // "updateTime": "2020-06-23 15:52:57", // 更新时间（注释掉表示暂时不用）
  // "isDeleted": 0, // 是否删除（注释掉表示暂时不用）
  // "param": {}, // 额外参数（注释掉表示暂时不用）
  // "parentId": 86, // 父级ID（注释掉表示暂时不用）
  name: string; // 地区名称，比如"北京市"、"朝阳区"
  value: string; // 地区代码，比如"110000"、"110105"
  createTime: string; // 创建时间，在展示数据时会用到
  dictCode: string; // 字典编码，用于获取下级地区数据
  children: CityList; // 下级地区列表，比如北京市的children就是各个区
  hasChildren: boolean; // 是否有下级地区：true表示还有下级，false表示已经是最后一级
}

// 地区列表类型：多个地区组成的数组
export type CityList = CityItem[];

/*
  下面是医院详情数据的例子：
  当点击某个医院查看详细信息时，服务器返回的数据结构
  {
     "bookingRule": { // 预约挂号规则
      "cycle": 10, // 可以预约未来10天的号
      "releaseTime": "08:30", // 每天8:30放号
      "stopTime": "11:30", // 11:30停止当天挂号
      "quitDay": -1, // 退号天数限制
      "quitTime": "15:30", // 15:30后不能退号
      "rule": [ // 具体的取号规则说明
        "西院区预约号取号地点：西院区门诊楼一层大厅挂号窗口取号",
        "东院区预约号取号地点：东院区老门诊楼一层大厅挂号窗口或新门诊楼各楼层挂号/收费窗口取号"
      ]
    },
    "hospital": { // 医院的详细信息
      // 包含SearchHospitalListParams中的所有字段
      // 包含HospitalItem中的大部分字段
      // 还包含以下额外字段：
      "route": "交通路线说明...", // 到医院的详细交通路线
      "intro": "医院介绍...", // 医院的详细介绍
      // 注意：bookingRule在hospital对象中是null，真正的规则在外层的bookingRule中
    }
  }
*/

// 单个医院的详细信息类型定义
// 这里使用了TypeScript的高级类型操作：
// - Required<SearchHospitalListParams>：把搜索参数中的可选字段都变成必填字段
// - Omit<HospitalItem, "id" | "createTime">：从HospitalItem中排除id和createTime字段
export interface HospitalDetailItem extends Required<SearchHospitalListParams>, Omit<HospitalItem, "id" | "createTime"> {
  route: string; // 到医院的交通路线详细说明
  intro: string; // 医院的详细介绍文字
}

// 医院详情的完整数据结构
export interface HospitalDetail {
  bookingRule: { // 预约挂号的规则配置
    cycle: number; // 预约周期：可以预约未来多少天的号
    releaseTime: string; // 放号时间：每天什么时候开始放号
    stopTime: string; // 停挂时间：每天什么时候停止挂号
    // quitDay: number; // 退号天数（注释掉表示暂时不用）
    quitTime: string; // 退号时间：每天什么时候后不能退号
    rule: string[]; // 预约和取号的具体规则说明（数组，可能有多条规则）
  };
  hospital: HospitalDetailItem; // 医院的详细信息
}

/*
  下面是医院科室数据的例子：
  医院里有很多科室，科室之间有层级关系，比如：
  [
    {
      "depcode": "a4e171f4cf9b6816acdfb9ae62c414d7", // 大科室代码
      "depname": "专科", // 大科室名称
      "children": [ // 大科室下面的小科室
        {
          "depcode": "200040878", // 小科室代码
          "depname": "多发性硬化专科门诊", // 小科室名称
          "children": null // 小科室下面没有更小的科室了
        },
      ]
    }
  ]
*/

// 医院科室信息类型定义
export interface DepartmentItem {
  depcode: string; // 科室代码，每个科室的唯一标识
  depname: string; // 科室名称，比如"内科"、"外科"、"儿科"
  children: DepartmentList; // 下级科室列表，比如内科下面的心内科、消化内科等
}

// 科室列表类型：多个科室组成的数组
export type DepartmentList = DepartmentItem[];

// 获取医院排班日期列表时需要的参数
export interface GetScheduleRuleListParams {
  page: number; // 第几页
  limit: number; // 每页显示多少条
  hoscode: string; // 医院编码，指定查看哪个医院的排班
  depcode: string; // 科室编码，指定查看哪个科室的排班
}

/*
  下面是医院排班日期列表数据的例子：
  显示某个科室未来几天的排班情况
  {
    "total": 37, // 总共有37天的排班数据
    "bookingScheduleList":[ // 排班日期列表
      {
        "workDate": "2022-04-24", // 工作日期
        "workDateMd": null, // 月日格式（暂时不用）
        "dayOfWeek": "周日", // 星期几
        "docCount": 3, // 当天有几个医生出诊
        "reservedNumber": 100, // 当天总共放多少个号
        "availableNumber": 38, // 当天还有多少个号可以预约
        "status": null // 状态（暂时不用）
      }
    ],
    "baseMap": { // 基础信息
      "hosname": "北京协和医院" // 医院名称
    }
  }
*/

// 获取医院排班日期列表时服务器返回的数据结构
export interface GetScheduleRuleListResponse {
  total: number; // 总共有多少天的排班数据
  bookingScheduleList: ScheduleRuleList; // 排班日期列表
  baseMap: { // 基础信息
    hosname: string; // 医院名称
  };
}

// 单个排班日期的信息
export interface ScheduleRuleItem {
  workDate: string; // 工作日期，格式like "2022-04-24"
  // "workDateMd": null, // 月日格式（注释掉表示暂时不用）
  dayOfWeek: string; // 星期几，比如"周一"、"周二"
  // "docCount": 3, // 当天出诊医生数量（注释掉表示暂时不用）
  reservedNumber: number; // 当天总共放多少个号
  availableNumber: number; // 当天还剩多少个号可以预约
  // "status": null // 状态（注释掉表示暂时不用）
}

// 排班日期列表类型：多个排班日期组成的数组
export type ScheduleRuleList = ScheduleRuleItem[];

// 获取医生列表时需要的参数
// 使用Pick从GetScheduleRuleListParams中挑选需要的字段
export interface GetDoctorListParams extends Pick<GetScheduleRuleListParams, "hoscode" | "depcode"> {
  workDate: string; // 指定查看哪一天的医生排班
}

/*
  下面是医生列表数据的例子：
  显示某个科室某一天的医生排班情况
  [
    {
      "id": "6225753536a9ba1be763dc7a", // 排班记录ID
      "createTime": "2022-03-07 11:00:05", // 创建时间
      "updateTime": "2022-03-07 11:00:05", // 更新时间
      "isDeleted": 0, // 是否删除
      "param": { // 额外信息
        "dayOfWeek": "周四", // 星期几
        "depname": "多发性硬化专科门诊", // 科室名称
        "hosname": "北京协和医院" // 医院名称
      },
      "hoscode": "1000_0", // 医院编码
      "depcode": "200040878", // 科室编码
      "title": "医师", // 医生职称，比如"主任医师"、"副主任医师"
      "docname": "", // 医生姓名
      "skill": "内分泌科常见病。", // 医生擅长的疾病和技能
      "workDate": "2022-04-28", // 出诊日期
      "workTime": 0, // 出诊时段：0表示上午，1表示下午
      "reservedNumber": 33, // 总号源数量
      "availableNumber": 22, // 可预约号源数量
      "amount": 100, // 挂号费用（单位：元）
      "status": 1, // 状态：1表示可预约
      "hosScheduleId": "112" // 排班ID
    },
  ]
*/

// 单个医生排班信息类型定义
export interface DoctorItem {
  id: string; // 排班记录的唯一标识
  reservedNumber: number; // 医生当天总共有多少个号
  availableNumber: number; // 还剩多少个号可以预约
  amount: number; // 挂号费用，单位是元
  skill: string; // 医生擅长治疗的疾病，比如"心脏病、高血压"
  workDate: string; // 出诊日期
  title: string; // 医生的职称，比如"主任医师"、"副主任医师"、"医师"
  // 下面这些字段暂时不需要使用，所以注释掉
  // createTime: "2022-03-07 11:00:05"; // 创建时间
  // updateTime: "2022-03-07 11:00:05"; // 更新时间
  // isDeleted: 0; // 是否删除
  // param: { // 额外参数
  //   dayOfWeek: "周四"; // 星期几
  //   depname: "多发性硬化专科门诊"; // 科室名称
  //   hosname: "北京协和医院"; // 医院名称
  // };
  // hoscode: "1000_0"; // 医院编码
  // depcode: "200040878"; // 科室编码
  // docname: ""; // 医生姓名
  // workTime: 0; // 出诊时段
  // status: 1; // 状态
  // hosScheduleId: "112"; // 排班ID
}

// 医生列表类型：多个医生排班信息组成的数组
export type DoctorList = DoctorItem[];

// 文件总结：
// 这个文件定义了医院管理系统中所有需要用到的数据类型，包括：
// 1. 医院基本信息 - 医院名称、地址、状态等
// 2. 地区信息 - 省市区三级联动数据
// 3. 医院详情 - 包括介绍、交通路线、预约规则等
// 4. 科室信息 - 医院的科室分类和层级关系
// 5. 排班信息 - 医生的出诊时间和号源情况
// 6. 搜索和分页 - 各种查询条件和分页参数
//
// 这些类型定义就像是数据的"模板"，确保前端和后端交换数据时格式一致，
// 避免出现数据类型错误，让代码更加健壮和易于维护。
