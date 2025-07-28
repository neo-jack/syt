// 这个文件是用来定义英文（en_US）语言环境下，和“路由”或“菜单”相关的文本翻译。
// 当用户把网站语言切换到英语时，系统就会从这个文件里查找对应的英文单词来显示。

// 定义一个名为 `route` 的常量对象。
// 这个对象就像一个字典，专门存放路由（菜单项）的翻译。
// 对象的“键”（key，冒号左边的部分，如 `dashboard`）是在代码中使用的标识符，通常不会改变。
// 对象的“值”（value，冒号右边的部分，如 `"Dashboard"`）是最终要显示在界面上的英文文本。
const route = {
  // 键 `dashboard` 对应的值是 "Dashboard"。在英文界面上，菜单会显示 "Dashboard"。
  dashboard: "Dashboard",

  // 键 `hospital` 对应的值是 "Hospital"。这是一个一级菜单的名称。
  hospital: "Hospital",
  // 键 `hospitalSet` 对应的值是 "Hospital Set"。这是 "Hospital" 菜单下的一个子菜单。
  hospitalSet: "Hospital Set",
  // 键 `hospitalList` 对应的值是 "Hospital List"。这是 "Hospital" 菜单下的另一个子菜单。
  hospitalList: "Hospital List",

  // 键 `data` 对应的值是 "Data"。
  data: "Data",
  // 键 `dict` 对应的值是 "Data Dict" (数据字典)。
  dict: "Data Dict",

  // 键 `member` 对应的值是 "Member"。
  member: "Member",
  // 键 `memberList` 对应的值是 "Member List" (会员列表)。
  memberList: "Member List",
  // 键 `certificationList` 对应的值是 "Certification List" (认证列表)。
  certificationList: "Certification List",

  // 键 `order` 对应的值是 "Order"。
  order: "Order",
  // 键 `orderList` 对应的值是 "Order List" (订单列表)。
  orderList: "Order List",

  // 键 `statistics` 对应的值是 "Statistics"。
  statistics: "Statistics",
  // 键 `statisticsList` 对应的值是 "Statistics List" (统计列表)。
  statisticsList: "Statistics List",
};

// 使用 `export default` 将 `route` 这个对象导出。
// 这样，项目中负责国际化配置的文件（通常在 `locales` 文件夹的入口文件中）就可以导入这个对象，
// 并把它整合到整个英文语言包里，从而让整个应用知道在需要显示菜单时应该用哪些英文单词。
export default route;
