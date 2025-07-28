// 从 "react" 库中导入 useState 和 useEffect 这两个核心的 Hook。
// useState 用于在函数组件中创建和管理状态（state），比如页码、用户列表数据等。
// useEffect 用于处理组件的“副作用”，最常见的就是在组件加载完成后从服务器请求数据。
import { useState, useEffect } from "react";
// 从 "antd" UI 组件库中导入需要的组件。
// Card: 卡片组件，用于将内容包裹在一个带边框和阴影的容器里，使界面更整洁。
// Form: 表单组件，用于创建搜索区域。
// Input: 输入框组件。
// DatePicker: 日期选择器组件。
// Button: 按钮组件。
// Table: 表格组件，用于展示用户列表。
import { Card, Form, Input, DatePicker, Button, Table } from "antd";
// 从 antd 的图标库中导入“搜索”图标。
import { SearchOutlined } from "@ant-design/icons";
// 从 "react-router-dom" 库中导入 useNavigate Hook。
// 这个 Hook 能让你在代码中实现页面跳转（比如点击“查看”按钮后跳转到用户详情页）。
import { useNavigate } from "react-router-dom";
// 从封装的 API 文件中导入 `getPageList` 函数。
// 这个函数负责发送网络请求，从后端获取用户列表数据。
// `@/` 是一个路径别名，通常指向 `src` 目录，这是在项目配置中设置的，方便导入模块。
import { getPageList } from "@/api/user/userInfo";

// 从 DatePicker 组件中获取 RangePicker（范围选择器）组件。
// 这里的 `: any` 是 TypeScript 的一种写法，表示暂时不对此变量进行严格的类型检查。
// 这样做是为了方便地使用 RangePicker，它允许用户一次选择一个时间段（开始时间和结束时间）。
const RangePicker: any = DatePicker.RangePicker;

// 定义并导出一个名为 UserList 的函数组件。
function UserList() {
  // 调用 useNavigate Hook，获取一个 `navigate` 函数，用于后续的页面跳转。
  const navigate = useNavigate();
  // 使用 useState 创建一个状态 `page`，用于存储当前表格所在的页码，初始值为 1。
  const [page, setPage] = useState(1);
  // 使用 useState 创建一个状态 `limit`，用于存储每页显示的条目数，初始值为 10。
  const [limit, setLimit] = useState(10);
  // 使用 useState 创建一个状态 `total`，用于存储用户总数，初始值为 0。这个值会显示在分页器上。
  const [total, setTotal] = useState(0);
  // 使用 useState 创建一个状态 `userList`，用于存储从后端获取到的用户列表数组，初始值为空数组。
  const [userList, setUserList] = useState([]);
  // 调用 antd 的 `Form.useForm` Hook 来创建一个表单实例 `form`。
  // 这个实例可以用来控制表单，例如清空表单内容。
  const [form] = Form.useForm();
  // 使用 useState 创建一个状态 `searchOption`，用于存储当前的搜索条件（如关键字、创建时间等），初始值为空对象。
  const [searchOption, setSearchOption] = useState({});

  // 定义一个异步函数 `getUserList`，用于获取用户列表数据。
  const getUserList = async (page: number, limit: number, searchOption: any) => {
    // 调用 API 函数 `getPageList`，传入页码、每页数量和搜索条件，向后端请求数据。
    // `await` 会暂停执行，直到请求完成并返回数据。
    const data = await getPageList(page, limit, searchOption);
    // 请求成功后，使用返回的总数 `data.total` 更新 `total` 状态。
    setTotal(data.total);
    // 使用返回的用户记录 `data.records` 更新 `userList` 状态，从而刷新表格显示。
    setUserList(data.records);
  };

  // 定义 `onFinish` 函数，作为搜索表单提交成功时的回调函数。
  const onFinish = (values: any) => {
    // 从表单收集到的数据 `values` 中解构出 `keyword` 和 `date`。
    const { keyword, date } = values;

    // 创建一个新的搜索条件对象。
    const searchOption = {
      keyword, // 搜索关键字。
      // 如果用户选择了日期（`date` 存在），则格式化开始时间。
      createTimeBegin: date && date[0].format("YYYY-MM-DD"),
      // 如果用户选择了日期（`date` 存在），则格式化结束时间。
      createTimeEnd: date && date[1].format("YYYY-MM-DD"),
    };

    // 更新 `searchOption` 状态，保存当前的搜索条件，以便分页时也能使用。
    setSearchOption(searchOption);

    // 调用 `getUserList` 函数，使用新的搜索条件来获取数据。
    // 注意：这里页码和每页数量仍使用当前 state 中的 `page` 和 `limit`。
    // 一个更常见的做法是，在新的搜索开始时，将页码重置为 1。
    getUserList(page, limit, searchOption);
  };

  // 定义 `handleChange` 函数，作为表格分页器页码或每页数量变化时的回调。
  const handleChange = (page: number, limit: number) => {
    // 更新 `page` 状态为新的页码。
    setPage(page);
    // 更新 `limit` 状态为新的每页数量。
    setLimit(limit);
    // 使用新的页码和每页数量，以及之前保存的搜索条件 `searchOption`，来获取新一页的数据。
    getUserList(page, limit, searchOption);
  };

  // 定义 `clear` 函数，用于清空搜索表单和搜索条件。
  const clear = () => {
    // 使用表单实例的 `resetFields` 方法，清空所有输入框的内容。
    form.resetFields();
    // 将 `searchOption` 状态重置为空对象，清除搜索条件。
    setSearchOption({});
    // 将页码和每页数量重置为初始值。
    setPage(1);
    setLimit(10);
    // 使用初始化的参数重新获取数据，相当于回到未搜索的初始状态。
    getUserList(1, 10, {});
  };

  // 使用 useEffect Hook，在组件第一次挂载到 DOM 后执行。
  // 第二个参数是空数组 `[]`，表示这个 effect 只执行一次。
  useEffect(() => {
    // 调用 `getUserList` 函数，获取初始的用户列表数据。
    getUserList(page, limit, searchOption);
  }, []); // 空数组依赖意味着此 effect 只在组件挂载时运行一次。

  // 定义表格的列（columns）配置。
  const columns = [
    {
      title: "序号", // 列标题。
      key: "index", // 列的唯一标识。
      // `render` 函数用于自定义该列单元格的显示内容。
      // 这里用它来动态计算行号。
      render: (_a: any, _b: any, index: number) => {
        return index + 1; // 返回从 1 开始的序号。
      },
    },
    {
      title: "手机号",
      dataIndex: "phone", // 告诉表格这一列显示数据源中每条记录的 `phone` 属性。
      key: "phone",
    },
    { title: "昵称", dataIndex: "nickName", key: "nickName" },
    {
      title: "姓名",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      // 使用 `render` 函数，根据 `status` 的值（通常是 1 或 0）来显示不同的文本。
      render: (status: number) => (status ? "正常" : "异常"),
    },
    {
      title: "认证状态",
      dataIndex: "authStatus",
      key: "authStatus",
      // 使用 `render` 函数，根据 `authStatus` 的值（2, 1, 或其他）显示不同的认证状态文本。
      render: (authStatus: number) => {
        if (authStatus === 2) {
          return "认证成功";
        } else if (authStatus === 1) {
          return "认证中";
        } else {
          return "未认证";
        }
      },
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "操作",
      key: "operator",
      width: 200, // 设置此列的宽度。
      // `render` 函数接收当前行的完整数据对象 `row` 作为参数。
      render: (row: any) => {
        return (
          // 使用 React 片段 `<></>` 包裹多个按钮。
          <>
            {/* “查看”按钮 */}
            <Button type="primary" style={{ marginRight: 10 }} onClick={() => navigate(`/syt/user/userInfo/show/${row.id}`)}>
              查看
            </Button>
            {/* “锁定”按钮，`disabled` 属性使其不可点击。 */}
            <Button type="primary" disabled>
              锁定
            </Button>
          </>
        );
      },
    },
  ];

  // 组件的 `return` 语句定义了要渲染到屏幕上的 JSX（HTML-like）结构。
  return (
    <Card>
      {/* 搜索表单 */}
      <Form layout="inline" onFinish={onFinish} form={form}>
        {/* 关键字输入框的表单项 */}
        <Form.Item name="keyword">
          <Input placeholder="姓名/手机" />
        </Form.Item>

        {/* 创建时间选择器的表单项 */}
        <Form.Item label="创建时间" name="date">
          <RangePicker />
        </Form.Item>

        {/* 操作按钮的表单项 */}
        <Form.Item>
          {/* 查询按钮。`htmlType="submit"` 表明它是一个提交按钮，点击会触发表单的 `onFinish` 事件。 */}
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ marginRight: 10 }}>
            查询
          </Button>
          {/* 清空按钮。点击会调用 `clear` 函数。 */}
          <Button onClick={clear}>清空</Button>
        </Form.Item>
      </Form>

      {/* 用户列表表格 */}
      <Table
        style={{ marginTop: 20 }} // 添加上边距。
        columns={columns} // 设置表格的列配置。
        dataSource={userList} // 设置表格的数据源。
        bordered // 添加边框。
        rowKey="id" // 指定 `id` 字段为行的唯一 key。
        pagination={{ // 配置分页器。
          current: page, // 当前页码，与 state 绑定。
          pageSize: limit, // 每页数量，与 state 绑定。
          total, // 总条数，与 state 绑定。
          showQuickJumper: true, // 显示快速跳转输入框。
          showSizeChanger: true, // 显示改变每页数量的选择器。
          showTotal: (total) => `总共 ${total} 条`, // 自定义总数显示文本。
          onChange: handleChange, // 绑定页码或每页数量改变时的回调函数。
        }}
      />
    </Card>
  );
}

// 导出 UserList 组件，使其可以在其他地方被导入和使用。
export default UserList;
