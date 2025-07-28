// 这个文件定义了医院设置相关的数据类型
// TypeScript 中的 interface 就像是一个模板，告诉我们数据应该长什么样子

// 搜索参数类型 - 用户在搜索医院时可以输入的条件
export interface SearchParams {
  hosname?: string; // 医院名称，比如"北京协和医院"（?表示这个字段可有可无）
  hoscode?: string; // 医院编码，每个医院都有唯一的编号，比如"001"（?表示这个字段可有可无）
}

// 获取医院设置列表时需要传递的参数类型
// extends SearchParams 的意思是：除了包含搜索条件，还要加上分页信息
export interface GetHospitalSetListParams extends SearchParams {
  page: number;   // 当前页码，比如第1页、第2页
  limit: number;  // 每页显示多少条数据，比如每页10条
}

// 获取医院设置列表时，服务器返回的数据格式说明
// 下面这段注释是从实际接口返回的数据复制过来的，让我们知道真实数据长什么样
/*
  只需要定义data中数据结构
  定义数据类型：可以只定义需要使用的数据，其他数据可以不定义
  {
    "records": [               // records 是一个数组，里面放着医院信息
      {
        "id": 119,             // 医院设置的唯一标识号
        "createTime": "2022-06-06 12:24:22",    // 创建时间
        "updateTime": "2022-06-06 12:24:22",    // 最后修改时间
        "isDeleted": 0,        // 是否已删除（0表示未删除，1表示已删除）
        "param": {},           // 额外参数，通常是空对象
        "hosname": "整容医院", // 医院名称
        "hoscode": "6666",     // 医院编码
        "apiUrl": null,        // API接口地址
        "signKey": "d5a01be2fc7a3bb0b0c799d907c29bbe",  // 签名密钥，用于安全验证
        "contactsName": "周杰伦",     // 联系人姓名
        "contactsPhone": "15966057118",  // 联系人电话
        "status": 1            // 医院状态（1表示启用，0表示禁用）
      }
    ],
    "total": 7,               // 总共有多少条医院数据
    "size": 1,                // 当前页面大小
    "current": 1,             // 当前页码
    "orders": [],             // 排序信息
    "hitCount": false,        // 是否命中计数
    "searchCount": true,      // 是否搜索计数
    "pages": 7                // 总页数
  }
*/

// 单个医院设置项的数据结构
// 这里只定义我们程序中实际要用到的字段
export interface HospitalSetItem {
  id: number;                    // 医院设置的唯一标识号，用来区分不同的医院
  // createTime: "2022-06-06 12:24:22";  // 创建时间 - 暂时不需要，所以注释掉
  // updateTime: "2022-06-06 12:24:22";  // 更新时间 - 暂时不需要，所以注释掉
  // isDeleted: 0;                       // 删除标记 - 暂时不需要，所以注释掉
  // param: {};                          // 参数对象 - 暂时不需要，所以注释掉
  hosname: string;               // 医院名称，比如"北京协和医院"
  hoscode: string;               // 医院编号，每个医院的唯一编码，比如"10001"
  apiUrl: string;                // API基础路径，医院系统的接口地址
  signKey: string;               // 签名密钥，用于接口调用时的安全验证
  contactsName: string;          // 联系人姓名，医院的主要联系人
  contactsPhone: string;         // 联系人电话，联系人的手机号码
  // status: 1;                          // 状态信息 - 暂时不需要，所以注释掉
}

// 医院设置列表类型 - 就是多个医院设置项组成的数组
// HospitalSetItem[] 表示这是一个数组，数组里的每个元素都是 HospitalSetItem 类型
export type HospitalSetList = HospitalSetItem[];

// 获取医院设置列表时，服务器返回给我们的完整数据格式
export interface GetHospitalSetListResponse {
  // 可以只定义需要使用的数据，不需要的字段可以不写
  records: HospitalSetList;      // 医院列表数据，是一个数组，包含所有医院信息
  total: number;                 // 数据库中总共有多少条医院记录
  size: number;                  // 当前页面显示了多少条数据
  current: number;               // 当前是第几页
  // "orders": [],               // 排序规则 - 暂时不需要，所以注释掉
  // "hitCount": boolean,        // 命中计数 - 暂时不需要，所以注释掉
  // "searchCount": boolean,     // 搜索计数 - 暂时不需要，所以注释掉
  // "pages": number             // 总页数 - 暂时不需要，所以注释掉
}

// 添加新医院时需要提供的参数类型
// 注意：添加医院时不需要提供id，因为id是由数据库自动生成的
export interface AddHospitalParams {
  apiUrl: string;                // API基础路径，医院系统的接口地址
  contactsName: string;          // 联系人姓名，医院的主要联系人
  contactsPhone: string;         // 联系人电话，联系人的手机号码
  hoscode: string;               // 医院编号，医院的唯一编码
  hosname: string;               // 医院名称，医院的正式名称
  // "id": 0,                    // id一定由服务器生成，所以添加时不需要提供
}

// 修改医院信息时需要提供的参数类型
// extends AddHospitalParams 的意思是：除了添加医院的所有字段，还要加上id字段
// 因为修改时需要知道要修改哪个医院，所以必须提供id
export interface UpdateHospitalParams extends AddHospitalParams {
  id: number;                    // 要修改的医院的唯一标识号
}
