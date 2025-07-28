// 从 antd(一个流行的React UI组件库) 中导入需要的组件，比如卡片、行、列、树形控件、标签、分页、表格、按钮
import { Card, Row, Col, Tree, Tag, Pagination, Table, Button } from "antd";
// 从 antd 的 tree 组件中导入类型定义(TreeProps)，用于给 antd 的 Tree 组件的 props 做类型检查，让代码更健壮
import type { TreeProps } from "antd/lib/tree";
// 从 react 库中导入 useEffect 和 useState 这两个核心的 Hooks（钩子函数）
// useEffect 用于处理组件中的“副作用”，最常见的就是在组件渲染后发送网络请求获取数据
// useState 用于在函数组件中定义和使用 state（状态），让组件能够“记住”一些数据，并在数据变化时自动重新渲染
import { useEffect, useState } from "react";
// 从 react-router-dom 这个库中导入 useParams 和 useNavigate 这两个 Hooks
// useParams 用于获取 URL 地址栏中的参数（比如 /hospital/123 中的 123）
// useNavigate 用于实现页面之间的跳转
import { useParams, useNavigate } from "react-router-dom";
// 从 antd 的 table 组件中导入类型定义(ColumnsType)，用于给 antd 的 Table 组件的列配置(columns)做类型检查
import type { ColumnsType } from "antd/lib/table";

// 从我们自己封装好的 API 文件中导入与服务器通信的函数
// reqGetDepartmentList 用于请求获取医院的科室列表
// reqGetScheduleRuleList 用于请求获取医院的排班规则列表
// reqGetDoctorList 用于请求获取某个科室在特定日期的医生排班列表
import {
  reqGetDepartmentList,
  reqGetScheduleRuleList,
  reqGetDoctorList,
} from "@api/hospital/hospitalList";
// 从 API 的类型定义文件中导入我们为数据定义的 TypeScript 类型
// DepartmentList 是科室列表的数据类型
// ScheduleRuleList 是排班规则列表的数据类型
// DoctorList 是医生排班列表的数据类型
// DoctorItem 是单个医生信息的数据类型
// 使用这些类型可以让我们的代码有智能提示，并且能在开发阶段就发现很多潜在的错误
import {
  DepartmentList,
  ScheduleRuleList,
  DoctorList,
  DoctorItem,
} from "@api/hospital/model/hospitalListTypes";

// const treeData... (这里是被注释掉的示例代码，我们可以忽略它)

// 定义表格的列(columns)配置
// antd的Table组件需要一个这样的数组来定义表格的表头，以及每一列应该如何展示数据
const columns: ColumnsType<DoctorItem> = [
  // 第一列的配置对象：序号
  {
    // title 设置这一列的表头显示的文字
    title: "序号",
    // render 函数用于自定义这一列单元格里显示的内容
    // 它有三个参数：(当前行的值, 当前行的数据对象, 当前行的索引)
    // 我们这里用索引(index)来显示行号，index从0开始，所以我们 +1 让它从1开始
    render: (row, records, index) => index + 1,
    // align 设置列内容的对齐方式为居中
    align: "center",
    // width 设置列的固定宽度
    width: 80,
  },
  // 第二列的配置对象：职称
  {
    title: "职称",
    // dataIndex 指定了这一列要显示的数据，对应的是数据源(dataSource)里每个对象的哪个属性
    // 这里表示显示每个医生对象的 'title' 属性
    dataIndex: "title",
  },
  // 第三列的配置对象：号源时间
  {
    title: "号源时间",
    dataIndex: "workDate",
  },
  // 第四列的配置对象：总预约数
  {
    title: "总预约数",
    dataIndex: "reservedNumber",
  },
  // 第五列的配置对象：剩余预约数
  {
    title: "剩余预约数",
    dataIndex: "availableNumber",
  },
  // 第六列的配置对象：挂号费(元)
  {
    title: "挂号费(元)",
    dataIndex: "amount",
  },
  // 第七列的配置对象：擅长技能
  {
    title: "擅长技能",
    dataIndex: "skill",
  },
];

// 定义并默认导出(export default)一个名为 HospitalSchedule 的 React 函数组件
// 这是这个文件的核心，它描述了医院排班页面的结构和功能
export default function HospitalSchedule() {
  // 使用 useParams hook 来获取 URL 地址中的动态参数，它会返回一个包含所有参数的对象
  const params = useParams();
  // 从 URL 参数对象中获取医院的编码(hoscode)，并使用 `as string` 告诉 TypeScript 我们确定它是一个字符串类型
  const hoscode = params.hoscode as string;

  // 使用 useState hook 定义一个名为 'doctorList' 的 state 变量，用于存储从服务器获取的医生排班列表数据
  // useState 的初始值是空数组 []
  // setDoctorList 是一个专门用来更新 doctorList 值的函数，每次调用它都会让组件重新渲染
  const [doctorList, setDoctorList] = useState<DoctorList>([]);
  // 定义一个异步函数(async function) getDoctorList，用来封装获取医生排班列表的逻辑
  // 它接收科室编码(depcode)和工作日期(workDate)作为参数
  const getDoctorList = async (depcode: string, workDate: string) => {
    // 使用 try...catch 语句来处理可能发生的错误，比如网络请求失败
    try {
      // 调用 API 函数 reqGetDoctorList 来向服务器发送网络请求，获取医生列表数据
      // await 关键字会暂停这里的代码，直到网络请求完成并返回数据
      const doctorList = await reqGetDoctorList({
        hoscode, // 医院编码 (来自URL)
        depcode, // 科室编码 (函数参数)
        workDate, // 工作日期 (函数参数)
      });

      // 请求成功后，使用 setDoctorList 函数更新组件的 state，把获取到的数据存起来
      // 这会触发 React 重新渲染页面，从而在表格中显示最新的医生列表
      setDoctorList(doctorList);
    } catch {
      // 如果 try 代码块中的任何地方发生了错误（比如请求失败），就会执行 catch 代码块
      // 说明请求失败了
      // 将医生列表设置为空数组，这样可以清空表格，避免页面因为数据格式不对而崩溃
      setDoctorList([]);
    }
  };

  // 定义 hosname 状态，用于存储医院的名称，初始值为空字符串
  const [hosname, setHosname] = useState(""); // 医院名称
  // 定义 depname 状态，用于存储当前选中的科室名称
  const [depname, setDepname] = useState(""); // 科室名称
  // 定义 workDate 状态，用于存储当前选中的排班日期
  const [workDate, setWorkDate] = useState(""); // 日期

  // 定义 depcode 状态，用于存储当前选中的科室编码
  const [depcode, setDepcode] = useState(""); // 科室编码
  // 定义 total 状态，用于存储排班规则的总条数，这个数字会用在分页组件上
  const [total, setTotal] = useState(0); // 总数
  // 定义 current 状态，用于存储分页器的当前页码
  const [current, setCurrent] = useState(1); // 当前页码
  // 定义 pageSize 状态，用于存储分页器每页显示的条数
  const [pageSize, setPageSize] = useState(5); // 每页条数
  // 定义 scheduleRuleList 状态，用于存储排班日期列表
  const [scheduleRuleList, setScheduleRuleList] = useState<ScheduleRuleList>([]); // 排班日期列表

  // 定义一个异步函数 getScheduleRuleList，用来获取排班日期列表
  const getScheduleRuleList = async (
    current: number,
    pageSize: number,
    depcode: string
  ) => {
    /*
      为什么 page 和 limit (对应 current 和 pageSize) 要设计成函数的参数？
      因为将来分页器(Pagination组件)在用户点击翻页时，会触发一个 onChange 事件，
      这个事件会自动把最新的“当前页码”和“每页条数”传给它的回调函数。
      我们把这个函数设计成能接收这些参数，就可以很方便地用最新的页码信息去请求数据。
    */
    // 调用 API 函数 reqGetScheduleRuleList 发送请求，获取排班规则数据
    const res = await reqGetScheduleRuleList({
      page: current,
      limit: pageSize,
      hoscode,
      depcode,
    });
    // 请求成功后，更新分页器相关的状态
    setCurrent(current); // 更新当前页码
    setPageSize(pageSize); // 更新每页条数
    setTotal(res.total); // 更新总条数

    // 更新排班日期列表的状态
    setScheduleRuleList(res.bookingScheduleList);

    // 从返回结果中，更新医院名称的状态
    setHosname(res.baseMap.hosname);
    // 获取排班列表中的第一个日期作为默认选中的日期
    // 这里使用了可选链操作符(?.)：如果 res.bookingScheduleList[0] 存在(即列表不为空)，就获取它的 workDate 属性；
    // 如果列表是空的，res.bookingScheduleList[0]就是undefined，表达式会直接返回undefined，从而避免程序因访问undefined的属性而报错。
    const workDate = res.bookingScheduleList[0]?.workDate;
    // 更新当前选中日期的状态
    setWorkDate(workDate);

    // 将获取到的第一个日期返回出去，这样调用这个函数的地方就能立刻拿到这个日期值，用于后续操作
    return workDate;
  };

  // 定义 departmentList 状态，用于存储从服务器获取的科室列表数据
  const [departmentList, setDepartmentList] = useState<DepartmentList>([]);
  // 定义 expandedKeys 状态，这是一个字符串数组，用于控制树形控件(Tree)中哪些节点是需要展开的
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  // 定义一个异步函数 getDepartmentList，用来获取科室列表
  const getDepartmentList = async () => {
    // 调用 API 函数 reqGetDepartmentList 发送请求，获取科室列表数据
    const departmentList = await reqGetDepartmentList(hoscode);
    // 更新科室列表的状态
    setDepartmentList(
      // 使用数组的 map 方法遍历从服务器获取到的原始科室列表
      departmentList.map((dep) => {
        // 返回一个新的对象，这个新对象包含了原始科室的所有数据（使用...dep展开语法），
        // 并且额外添加了一个 disabled: true 属性。
        return {
          ...dep,
          disabled: true, // disabled: true 的作用是将第一级科室（比如"内科"、"外科"）在树形控件中设置为灰色，不可被直接选中
        };
      })
    );
    // 同样使用 map 方法，从科室列表中提取所有一级科室的 depcode
    setExpandedKeys(
      departmentList.map((dep) => {
        return dep.depcode; // 将所有一级科室的编码组成一个数组，用于设置树形控件默认展开这些一级科室
      })
    );

    // 默认选中第一个大科室下的第一个小科室
    const depcode = departmentList[0].children[0].depcode;
    // 更新当前选中的科室编码的状态
    // 注意：setDepcode 是一个异步操作，React会“安排”一次状态更新，而不是立即执行。
    // 所以，如果你在下一行立刻打印 depcode，可能看到的还是旧的值。
    setDepcode(depcode);
    // 更新当前选中的科室名称的状态
    setDepname(departmentList[0].children[0].depname);

    // 将获取到的第一个小科室的编码返回出去，供后续使用
    return depcode;
  };

  // 定义一个统一的、获取所有页面初始数据的异步函数
  const getData = async () => {
    /*
      await 在这里起到了关键的“串行”作用，确保了异步操作按我们期望的顺序执行。
      如果没有 await，这些请求会同时发出，我们无法保证在请求排班日期时，已经拿到了正确的科室编码。
    */
    // 第一步：请求科室列表数据，并用 await 等待它完成。完成后，函数会返回默认的科室编码(depcode)
    const depcode = await getDepartmentList();
    // 第二步：现在我们有了 depcode，再用它去请求该科室的排班日期数据，并用 await 等待它完成。完成后，函数会返回默认的工作日期(workDate)
    const workDate = await getScheduleRuleList(current, pageSize, depcode);

    // 第三步：现在我们有了 depcode 和 workDate，去请求对应的医生列表数据
    // 这里的 await 可以不加，因为这是这个流程的最后一步了，后面没有其他代码需要等待它的结果。
    getDoctorList(depcode, workDate);
  };

  // 使用 useEffect hook，它的作用是在组件第一次渲染到屏幕上之后，执行一次我们提供的函数
  useEffect(() => {
    // 调用我们封装好的 getData 函数，来加载页面所需的全部初始数据
    getData();
    // useEffect 的第二个参数是一个“依赖数组”。
    // 这里我们传入一个空数组 []，意思是这个 effect 不依赖于任何 props 或 state 的变化，
    // 因此它只会在组件“挂载”时（即第一次渲染后）运行一次，之后就再也不会运行了。
    // 这正是我们加载初始数据所需要的行为。
  }, []);

  // 定义一个 onSelect 函数，这个函数会作为 antd Tree 组件的 onSelect 属性的值（一个回调函数）
  // 当用户在左侧的科室树中点击选择某个科室时，Tree 组件就会调用这个函数
  const onSelect: TreeProps["onSelect"] = async (selectedKeys, info: any) => {
    // selectedKeys 是一个数组，包含了所有被选中节点的 key 属性的值
    // info.node 则包含了被选中节点的完整数据对象
    // 因为我们是单选，所以 selectedKeys 数组里只有一个元素，就是我们选中的科室的 depcode
    const depcode = selectedKeys[0] as string;
    // 更新 state 中的科室编码
    setDepcode(depcode);
    // 从 info.node 对象中获取科室的名称(depname)，并更新 state
    setDepname(info.node.depname);
    // 当科室发生变化后，我们需要重新获取这个新科室的排班数据
    // 注意：我们总是从第一页(current=1)开始查询新科室的排班数据
    const workDate = await getScheduleRuleList(1, pageSize, depcode);
    // 接着，用新的科室编码(depcode)和获取到的新的默认工作日期(workDate)，去获取医生列表
    getDoctorList(depcode, workDate);
  };

  // 定义一个处理点击排班日期 Tag 的函数
  // 这是一个“高阶函数”，它本身不直接作为事件处理函数，而是接收一个 workDate 参数，然后返回一个真正的事件处理函数
  const handleWorkDateClick = (workDate: string) => {
    // 下面这个返回的箭头函数，才是最终会绑定到每个 Tag 的 onClick 事件上的函数
    return () => {
      // 当用户点击某个日期 Tag 时，调用 setWorkDate 更新当前选中的日期
      setWorkDate(workDate);
      // 然后，根据当前已经选中的科室(depcode)和刚刚新选中的日期(workDate)，去获取医生列表
      getDoctorList(depcode, workDate);
    };
  };

  // 使用 useNavigate hook 获取一个 navigate 函数，这个函数可以让我们手动控制页面跳转
  const navigate = useNavigate();
  // 定义一个返回上一页的函数
  const goBack = () => {
    // 调用 navigate 函数，并传入目标路径，浏览器就会跳转到那个页面
    navigate("/syt/hospital/hospitalList");
  };

  // 计算左侧树形控件的理想高度，使其能更好地适应不同大小的屏幕，避免出现双重滚动条
  // 算法是：用整个浏览器窗口的高度，减去页面上固定的其他元素的高度（比如顶部导航栏、Tabs标签页、Card的边距等）
  const treeHeight = document.documentElement.clientHeight - 64 - 34 - 48 - 36;

  // return 语句返回的是这个组件要渲染到页面上的所有内容，它使用 JSX 语法来描述界面
  return (
    // Card 是一个卡片式容器，让内容看起来更整洁
    <Card>
      {/* 这是一个段落(p)标签，用于在页面顶部显示当前选择的“面包屑”信息 */}
      <p>
        选择：{hosname} / {depname} / {workDate}
      </p>
      {/* Row 是一个行容器，用于栅格布局。gutter 属性是列(Col)与列之间的间距 */}
      <Row gutter={20}>
        {/* Col 是一个列容器。span={5} 表示它占据这一行(总共24份)中的5份宽度 */}
        <Col span={5}>
          {/* 创建一个 div 作为滚动容器，用来包裹左侧的科室树 */}
          <div
            style={{
              height: treeHeight, // style属性用于设置内联CSS样式，这里设置我们计算好的高度
              overflowY: "scroll", // 当内容超出这个div的高度时，在垂直方向上显示滚动条
              border: "1px solid silver", // 添加一个1像素宽的银色实线边框
            }}
          >
            {/* 
              关于 Tree 组件的一些说明:
              - 为什么 `treeData={departmentList as []}` 要用 `as []`?
                这是因为 antd 的类型定义有时不够灵活，它期望的类型和我们从服务器拿到的数据类型（即使我们已经用TypeScript定义了）不完全匹配。
                `as []` 是一种类型断言，相当于我们告诉 TypeScript：“别担心，我知道这不完全匹配，但请把它当作一个数组来处理”。这是一种临时的解决办法。
              - 为什么不能用 `defaultExpandAll` (默认展开所有节点)？
                因为我们的科室数据(departmentList)是异步请求回来的。组件第一次渲染时，`departmentList` 是个空数组。
                `defaultExpandAll` 只在组件第一次渲染时起作用，那时它看不到任何节点，自然也就无法展开。等数据回来时，它已经“下班”了。
              - `defaultExpandedKeys` 同理，也不能用。
                所以我们采用 `expandedKeys` 这个受控属性，手动管理哪些节点需要展开。
            */}
            {/* antd 的 Tree 组件，用于显示科室层级 */}
            <Tree
              // selectedKeys 是一个受控属性，用于指定当前选中的节点的 key。我们把它绑定到 state 中的 depcode。
              // 因为它需要一个数组，所以我们用 [depcode]
              selectedKeys={[depcode]}
              // expandedKeys 也是一个受控属性，用于指定哪些节点需要展开。我们把它绑定到 state 中的 expandedKeys。
              expandedKeys={expandedKeys}
              // onSelect 指定当用户点击选择节点时的回调函数
              onSelect={onSelect}
              // treeData 指定树形控件的数据源
              treeData={departmentList as []}
              // fieldNames 用于当我们的数据对象的属性名不是 antd 默认的 title, key, children 时，做一个映射。
              // 这里告诉 Tree 组件，请用我们数据里的 `depname` 字段作为显示的标题，`depcode` 字段作为节点的唯一 key。
              fieldNames={{ title: "depname", key: "depcode" }}
            />
          </div>
        </Col>
        {/* 这是右侧的列，占据 19/24 的宽度 */}
        <Col span={19}>
          {/* 使用数组的 map 方法遍历排班日期列表(scheduleRuleList)，为每个日期动态地生成一个 Tag 组件 */}
          {scheduleRuleList.map((scheduleRuleItem) => {
            // map方法的回调函数返回的是每个列表项对应的JSX元素
            return (
              // antd 的 Tag 标签组件
              <Tag
                // color 属性用于设置标签颜色。这里用了一个三元表达式做条件判断：
                // 如果当前这个 Tag 代表的日期(scheduleRuleItem.workDate) 等于 我们 state 中选中的日期(workDate)，
                // 那么这个 Tag 的颜色就设置为绿色("green")，否则就不设置颜色("")，显示默认样式
                color={workDate === scheduleRuleItem.workDate ? "green" : ""}
                // key 属性是 React 在渲染列表时必须的，它帮助 React 识别哪个列表项是哪个，从而在数据变化时高效地更新DOM。
                // key 的值必须在兄弟节点中是唯一的，这里用 workDate 就很合适。
                key={scheduleRuleItem.workDate}
                // style 属性设置内联样式，这里给每个 Tag 添加了10像素的下边距
                style={{ marginBottom: 10 }}
                // onClick 属性绑定点击事件。这里我们调用了之前写好的高阶函数 handleWorkDateClick，
                // 并把当前项的日期(scheduleRuleItem.workDate)传给它。这个调用会返回一个真正的点击处理函数。
                onClick={handleWorkDateClick(scheduleRuleItem.workDate)}
              >
                {/* Tag 内部要显示的内容 */}
                <div>
                  {/* 显示具体的日期 和 星期几 */}
                  {scheduleRuleItem.workDate} {scheduleRuleItem.dayOfWeek}
                </div>
                <div>
                  {/* 显示 可用号源 / 总号源 */}
                  {scheduleRuleItem.availableNumber} /{" "}
                  {scheduleRuleItem.reservedNumber}
                </div>
              </Tag>
            );
          })}

          {/* antd 的 Pagination 分页组件 */}
          <Pagination
            // style 属性，给分页组件整体设置一个上边距
            style={{ marginTop: 10 }}
            // total 属性告诉分页组件总共有多少条数据
            total={total}
            // current 属性控制当前显示的是第几页
            current={current}
            // pageSize 属性控制每页显示多少条数据
            pageSize={pageSize}
            // showSizeChanger 属性设置为 true，会显示一个可以改变每页条数的选择器
            showSizeChanger
            // pageSizeOptions 属性指定了每页条数选择器里可以有哪些选项
            pageSizeOptions={[5, 10, 15, 20]}
            // onChange 是当页码或 pageSize 发生变化时触发的回调函数
            onChange={async (current, pageSize) => {
              // 当用户翻页或改变每页条数时，我们用新的 current 和 pageSize 去重新获取排班规则列表
              const workDate = await getScheduleRuleList(
                current,
                pageSize,
                depcode
              );
              // 然后用获取到的新的默认日期去获取对应的医生列表
              getDoctorList(depcode, workDate);
            }}
          />

          {/* antd 的 Table 表格组件 */}
          <Table
            // columns 属性指定表格的列配置，就是我们在一开始定义的那个 `columns` 常量
            columns={columns}
            // dataSource 属性指定表格的数据源，我们把它绑定到 state 中的 `doctorList`
            dataSource={doctorList}
            // rowKey 属性指定数据数组中哪一个属性可以作为每一行的唯一标识(key)
            rowKey="id"
            // bordered 属性让表格显示带边框的样式
            bordered
            // className 属性可以给组件添加一个 CSS 类名，方便我们用 CSS 文件来定义样式
            className="mt"
            // pagination={false} 告诉表格不要显示它自己内置的分页器，因为我们在上面已经自定义了一个功能更全的 Pagination 组件
            pagination={false}
          />

          {/* antd 的 Button 按钮组件 */}
          <Button className="mt" onClick={goBack}>
            返回
          </Button>
        </Col>
      </Row>
    </Card>
  );
}
