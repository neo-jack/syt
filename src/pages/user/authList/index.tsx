// 导入 React 库中的 'useState' 和 'useEffect' 两个核心 Hook。
// 'useState' 用于在函数组件中添加和管理组件自己的状态（可以变化的数据）。
// 'useEffect' 用于处理组件的“副作用”，比如在组件加载后从服务器请求数据。
import { useState, useEffect } from "react";
// 导入 antd 设计库中的组件，用于快速搭建美观的界面。
// Card: 卡片容器，用于展示块状内容。
// Form: 表单，用于收集用户的输入数据。
// Input: 输入框。
// DatePicker: 日期选择器。
// Button: 按钮。
// Table: 表格，用于展示结构化的数据列表。
import { Card, Form, Input, DatePicker, Button, Table } from "antd";
// 从 antd 的图标库中导入“搜索”图标。
import { SearchOutlined } from "@ant-design/icons";
// 导入 'useNavigate' Hook，它是 React Router 库的一部分，用于在代码中实现页面跳转。
import { useNavigate } from "react-router-dom";
// 从封装好的 API 文件中导入 'getPageList' 函数，这个函数专门负责调用后端接口，获取用户列表数据。
import { getPageList } from "@/api/user/userInfo";

// 从 antd 的 DatePicker 组件中获取 RangePicker，它是一个可以选择日期范围的组件。
// 这里使用 `any` 类型可能是为了快速解决 TypeScript 的类型检查问题，但在正式项目中最好提供更准确的类型。
const RangePicker: any = DatePicker.RangePicker;

// 定义并导出一个名为 'AuthList' 的 React 函数组件。
// 这个组件的主要功能是展示一个用户认证列表，并提供搜索和分页功能。
function AuthList() {
  // 调用 'useNavigate' Hook，获取一个 'navigate' 函数，后续可以使用它来跳转到其他页面。
  const navigate = useNavigate();
  // 使用 'useState' 创建几个状态变量来管理组件的数据。
  // 'page' 用来记录当前表格显示的是第几页，初始值为 1。
  const [page, setPage] = useState(1);
  // 'limit' 用来记录每页显示多少条数据，初始值为 10。
  const [limit, setLimit] = useState(10);
  // 'total' 用来记录总共有多少条用户数据，初始值为 0。这个值会从服务器获取。
  const [total, setTotal] = useState(0);
  // 'userList' 用来存储从服务器请求来的用户列表数据，初始值为空数组。
  const [userList, setUserList] = useState([]);
  // 调用 antd 的 'Form.useForm()' Hook，创建一个 'form' 实例，用于控制表单（比如清空表单）。
  const [form] = Form.useForm();
  // 'searchOption' 用来存储用户的搜索条件。
  // 初始时，它有一个固定的搜索条件 `authStatus: 1`，这可能意味着默认只查询“已认证”状态的用户。
  const [searchOption, setSearchOption] = useState({
    authStatus: 1,
  });

  // 定义一个名为 'getUserList' 的异步函数，负责获取用户列表数据。
  // 'async' 表示这是一个异步函数，它内部可以等待（await）其他异步操作完成。
  const getUserList = async (page: number, limit: number, searchOption: any) => {
    // 调用 API 函数 'getPageList'，并把页码、每页数量和搜索条件传给它。
    // 'await' 会暂停执行，直到从服务器拿到返回的数据。
    const data = await getPageList(page, limit, searchOption);
    // 使用 'setTotal' 函数，将从服务器返回的总记录数 'data.total' 更新到组件的状态中。
    setTotal(data.total);
    // 使用 'setUserList' 函数，将从服务器返回的用户列表 'data.records' 更新到组件的状态中。
    setUserList(data.records);
  };

  // 定义 'onFinish' 函数，它会在搜索表单成功提交（且通过校验）时被调用。
  const onFinish = (values: any) => {
    // 从 antd Form 自动收集的表单数据 'values' 中，解构出 'keyword' (姓名) 和 'date' (日期范围)。
    const { keyword, date } = values;

    // 创建一个新的搜索条件对象 'newSearchOption'。
    const newSearchOption = {
      // 使用扩展运算符 '...'，先复制所有旧的搜索条件（比如那个固定的 `authStatus: 1`）。
      ...searchOption,
      // 然后添加或覆盖新的搜索条件。
      keyword, // 用户在输入框里输入的姓名。
      // 如果用户选择了日期（`date` 存在），就格式化起始日期。
      createTimeBegin: date && date[0].format("YYYY-MM-DD"),
      // 如果用户选择了日期（`date` 存在），就格式化结束日期。
      createTimeEnd: date && date[1].format("YYYY-MM-DD"),
    };

    // 使用 'setSearchOption' 更新组件的搜索条件状态。
    setSearchOption(newSearchOption);
    // 调用 'getUserList' 函数，使用新的搜索条件去服务器请求过滤后的用户列表数据。
    getUserList(page, limit, newSearchOption);
  };

  // 定义 'handleChange' 函数，它会在表格的分页器发生变化（用户切换页面或改变每页数量）时被调用。
  const handleChange = (page: number, limit: number) => {
    // 更新组件状态中的当前页码。
    setPage(page);
    // 更新组件状态中的每页显示数量。
    setLimit(limit);
    // 调用 'getUserList' 函数，使用新的页码和每页数量去获取对应页的数据。
    getUserList(page, limit, searchOption);
  };

  // 定义 'clear' 函数，用于清空搜索条件并重置列表。
  const clear = () => {
    // 使用 'form' 实例的 'resetFields' 方法，清空表单中所有输入框的内容。
    form.resetFields();
    // 将搜索条件状态重置为初始值。
    setSearchOption({
      authStatus: 1,
    });
    // 将页码重置为第一页。
    setPage(1);
    // 将每页数量重置为 10。
    setLimit(10);
    // 重新调用 'getUserList' 函数，加载第一页的、未经过滤的数据列表。
    getUserList(1, 10, { authStatus: 1 });
  };

  // 使用 'useEffect' Hook，在组件第一次加载到页面后执行一次操作。
  // 第二个参数是 `[]`（一个空数组），表示这个 effect 只在组件首次渲染后运行，之后不再运行。
  useEffect(() => {
    // 调用 'getUserList' 函数，获取初始的用户列表数据。
    getUserList(page, limit, searchOption);
  }, []); // 空数组依赖项，确保只在挂载时调用一次。

  // 定义 'columns' 数组，这个数组是 antd Table 组件的“图纸”，规定了表格有多少列，以及每一列如何展示。
  const columns = [
    {
      title: "序号", // 表头显示的文字。
      key: "index", // 这一列的唯一标识。
      // 'render' 函数用于自定义这一列单元格的显示内容。
      // 它接收三个参数：当前单元格的值(_a)，当前行的数据(_b)，当前行的索引(index)。
      render: (_a: any, _b: any, index: number) => {
        // 返回 `index + 1`，这样序号就能从 1 开始，而不是从 0 开始。
        return index + 1;
      },
    },
    {
      title: "姓名",
      key: "name",
      dataIndex: "name", // 'dataIndex' 指明这一列要显示的数据是 `userList` 中每个对象的 'name' 属性。
    },
    {
      title: "证件类型",
      key: "certificatesTypeString",
      // 这里也用 'render' 来自定义，因为证件类型的数据在 `param` 对象的下一层。
      render: (row: any) => row.param.certificatesTypeString,
    },
    {
      title: "证件号",
      key: "certificatesNo",
      dataIndex: "certificatesNo",
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "操作", // 这一列用来放置操作按钮。
      key: "operator",
      width: 300, // 固定这一列的宽度为 300 像素。
      // 'render' 函数接收当前行的数据 'row' 作为参数。
      render: (row: any) => {
        // 返回 JSX，包含三个按钮。
        return (
          <>
            <Button type="primary" style={{ marginRight: 10 }} onClick={() => navigate(`/syt/user/userInfo/show/${row.id}`)}>
              查看
            </Button>
            <Button type="primary" disabled style={{ marginRight: 10 }}>
              通过
            </Button>
            <Button type="primary" danger disabled>
              不通过
            </Button>
          </>
        );
      },
    },
  ];

  // 组件的最终渲染输出。
  return (
    // 使用 Card 组件包裹整个页面内容。
    <Card>
      {/* 搜索表单 */}
      <Form layout="inline" onFinish={onFinish} form={form}>
        {/* 姓名输入框的表单项 */}
        <Form.Item name="keyword">
          <Input placeholder="姓名" />
        </Form.Item>

        {/* 创建时间选择器的表单项 */}
        <Form.Item label="创建时间" name="date">
          <RangePicker />
        </Form.Item>

        {/* 操作按钮的表单项 */}
        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ marginRight: 10 }}>
            查询
          </Button>
          <Button onClick={clear}>清空</Button>
        </Form.Item>
      </Form>

      {/* 数据展示表格 */}
      <Table
        style={{ marginTop: 20 }} // 给表格添加一点上边距，和搜索框分开。
        columns={columns} // 使用上面定义好的 'columns' 来配置表格的列。
        dataSource={userList} // 'dataSource' 指定了表格要展示的数据源，即我们从服务器获取并存放在 'userList' 状态中的数据。
        bordered // 'bordered' 属性给表格添加边框。
        rowKey="id" // 'rowKey' 告诉表格使用每条数据中的 'id' 字段作为唯一的行标识，这对于 React 高效更新列表很重要。
        pagination={{
          current: page, // 'current' 控制分页器当前显示在第几页，与我们的 'page' 状态绑定。
          pageSize: limit, // 'pageSize' 控制每页显示多少条，与我们的 'limit' 状态绑定。
          total, // 'total' 告诉分页器总共有多少条数据，与我们的 'total' 状态绑定。
          showQuickJumper: true, // 显示快速跳转到某页的输入框。
          showSizeChanger: true, // 显示可以改变每页显示数量的下拉框。
          showTotal: (total) => `总共 ${total} 条`, // 自定义显示总条数的文本。
          onChange: handleChange, // 当页码或每页数量改变时，调用我们的 'handleChange' 函数。
        }}
      />
    </Card>
  );
}

// 导出 AuthList 组件，以便在项目的其他地方（如路由配置中）使用它。
export default AuthList;
