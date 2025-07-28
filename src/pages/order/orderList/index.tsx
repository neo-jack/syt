// 导入 React 库的核心功能，以及两个重要的“钩子”(Hooks): useState 和 useEffect
// useState 用于在组件中创建和管理“状态”(state)，也就是可以随时间变化的数据
// useEffect 用于处理“副作用”，比如在组件加载后从服务器获取数据
import React, { useState, useEffect } from "react";
// 从 'antd' UI库中导入一系列组件，antd 是一个流行的 React UI 库，提供了很多现成的界面元素
// Card: 卡片组件，用于将内容包裹在一个带边框的容器里
// Form: 表单组件，用于创建搜索、登录等表单
// Input: 输入框组件
// DatePicker: 日期选择器组件
// Button: 按钮组件
// Table: 表格组件，用于展示数据列表
// Select: 选择器（下拉菜单）组件
import { Card, Form, Input, DatePicker, Button, Table, Select } from "antd";
// 从 antd 的图标库中导入“搜索”图标
import { SearchOutlined } from "@ant-design/icons";
// 从 'react-router-dom' 库中导入 useNavigate 钩子，它能让我们在代码中控制页面跳转
import { useNavigate } from "react-router-dom";
// 从我们自己封装的 API 文件中导入两个函数
// getStatusList: 用于获取所有订单状态的列表（比如：待支付、已支付、已取消）
// getPageList: 用于分页获取订单列表数据
import { getStatusList, getPageList } from "@/api/order/orderInfo";

// 从 antd 的 Select 组件中解构出 Option 组件
// 这样在下面使用下拉选项时，就可以直接写 <Option>，而不用写 <Select.Option>
const { Option } = Select;

// 这里将 DatePicker 组件赋值给一个名为 DatePick 的新变量，并将其类型指定为 `any`
// 这可能是一种临时的解决方法，用来避免 TypeScript 的类型检查报错。`any` 类型告诉 TypeScript “不要检查这个变量的类型”
const DatePick: any = DatePicker;

// 定义并导出一个名为 OrderList 的 React 函数组件
function OrderList() {
  // --- 组件状态管理 (State Management) ---

  // 调用 useNavigate hook，获取一个 navigate 函数，这个函数可以用来跳转到其他页面
  const navigate = useNavigate();
  // 使用 useState 创建一个状态 `page`，用来记录当前表格在哪一页，初始值为 1
  const [page, setPage] = useState(1);
  // 使用 useState 创建一个状态 `limit`，用来记录表格每页显示多少条数据，初始值为 10
  const [limit, setLimit] = useState(10);
  // 使用 useState 创建一个状态 `total`，用来记录订单总共有多少条，初始值为 0
  const [total, setTotal] = useState(0);
  // 使用 useState 创建一个状态 `orderList`，用来存放从服务器获取到的订单列表数据，初始值为空数组
  const [orderList, setOrderList] = useState([]);
  // 使用 useState 创建一个状态 `statusList`，用来存放订单状态的列表，用于下拉菜单，初始值为空数组
  const [statusList, setStatusList] = useState([]);
  // 调用 antd 的 Form.useForm() hook，创建一个 form 实例，用来控制表单（比如读取值、重置表单）
  const [form] = Form.useForm();
  // 使用 useState 创建一个状态 `searchOption`，用来保存用户在搜索框里输入的查询条件
  const [searchOption, setSearchOption] = useState({});

  // --- 数据请求与处理函数 ---

  // 定义一个异步函数 `getOrderList`，用来从服务器获取订单列表数据
  // `async` 表示这是一个异步函数，里面可以用 `await`
  // 参数 `page` 是页码, `limit` 是每页条数, `searchOption` 是搜索条件对象
  const getOrderList = async (
    page: number,
    limit: number,
    searchOption: any
  ) => {
    // 调用 API 函数 `getPageList`，并等待它返回结果。`await` 会暂停在这里，直到数据回来
    const data = await getPageList(page, limit, searchOption);
    // 使用返回数据中的 `total` 来更新总条数的状态
    setTotal(data.total);
    // 使用返回数据中的 `records` (订单列表) 来更新订单列表的状态
    setOrderList(data.records);
  };

  // 定义 `onFinish` 函数，当用户填写完搜索表单并点击“查询”按钮后，这个函数会被调用
  // `values` 参数是 antd Form 自动收集的表单中所有输入项的值
  const onFinish = (values: any) => {
    // 创建一个新的 `searchOption` 对象
    const searchOption = {
      ...values, // 复制所有从表单收集到的值
      // antd 的 DatePicker 返回的是一个 moment.js 对象，我们需要用 .format() 方法把它转换成 "YYYY-MM-DD" 格式的字符串，再发给后端
      createTimeBegin: values.createTimeBegin?.format("YYYY-MM-DD"), // ?. 是可选链操作符，如果 `values.createTimeBegin` 不存在，则不会报错，返回 undefined
      createTimeEnd: values.createTimeEnd?.format("YYYY-MM-DD"),
      reserveDate: values.reserveDate?.format("YYYY-MM-DD"),
    };

    // 更新 `searchOption` 状态，保存当前的搜索条件，以便翻页时使用
    setSearchOption(searchOption);

    // 调用 `getOrderList` 函数，使用新的搜索条件来获取数据，查询结果应该从第一页开始显示
    getOrderList(page, limit, searchOption);
  };

  // 定义 `handleChange` 函数，当用户在表格下方点击翻页或改变每页显示条数时被调用
  // `page` 是新的页码, `limit` 是新的每页条数
  const handleChange = (page: number, limit: number) => {
    // 更新页码状态
    setPage(page);
    // 更新每页条数状态
    setLimit(limit);
    // 使用新的页码和条数，以及之前保存的搜索条件 `searchOption`，来获取新的数据
    getOrderList(page, limit, searchOption);
  };

  // 定义 `clear` 函数，当用户点击“清空”按钮时被调用
  const clear = () => {
    // 使用 form 实例的 `resetFields` 方法，清空搜索表单的所有内容
    form.resetFields();
    // 重置搜索条件状态为空对象
    setSearchOption({});
    // 重置页码为第一页
    setPage(1);
    // 重置每页条数为10
    setLimit(10);
    // 调用 `getOrderList`，不带任何搜索条件，重新加载初始的列表数据
    getOrderList(1, 10, {});
  };

  // 使用 `useEffect` Hook，它会在组件第一次渲染到屏幕上后执行里面的代码
  useEffect(() => {
    // 1. 组件加载后，立刻调用 `getOrderList` 获取第一页的订单数据
    getOrderList(page, limit, searchOption);

    // 2. 定义一个内部的异步函数 `getStatus`，用来获取订单状态列表
    const getStatus = async () => {
      // 调用 API 函数 `getStatusList` 并等待结果
      const data = await getStatusList();
      // 将获取到的状态列表数据更新到 `statusList` 状态中
      setStatusList(data);
    };

    // 3. 调用上面定义的 `getStatus` 函数
    getStatus();
    // `[]` 是依赖数组，当它为空时，useEffect 里的代码只会在组件挂载时执行一次，避免重复请求
  }, []);

  // --- 表格列定义 (Table Columns) ---

  // 定义表格的列配置，`columns` 是一个数组，每个对象代表一列
  const columns = [
    {
      title: "序号", // 列的标题
      key: "index", // 这一列的唯一标识
      // `render` 函数用于自定义这一列显示的内容
      // `_a` 和 `_b` 是占位符，表示我们不需要用到 `render` 函数的前两个参数（当前行数据），`index` 是行的索引
      render: (_a: any, _b: any, index: number) => {
        // 返回 `索引 + 1`，这样序号就从 1 开始了
        return index + 1;
      },
    },
    {
      title: "订单交易号", // 列标题
      dataIndex: "outTradeNo", // 告诉表格这一列要显示数据源中名为 `outTradeNo` 的字段
      key: "outTradeNo", // 唯一标识
    },
    { title: "医院名称", dataIndex: "hosname", key: "hosname" },

    {
      title: "科室名称",
      key: "depname",
      dataIndex: "depname",
    },
    {
      title: "医生职称",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "安排时间",
      dataIndex: "fetchTime", // 这里可能是笔误，通常应该是 `reserveDate` 或 `scheduleTime`，`fetchTime` 字面意思是“获取时间”
      key: "fetchTime",
    },
    {
      title: "就诊人",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "预约号序",
      dataIndex: "number",
      key: "number",
    },
    {
      title: "服务费(元)",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "订单状态",
      key: "orderStatusString",
      // 使用 render 来自定义显示，因为原始数据可能是数字或编码，需要转换成用户能看懂的文字
      // `row` 是当前整行的数据对象
      render: (row: any) => row.param.orderStatusString, // 从 `row.param` 对象里取出格式化好的订单状态字符串
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime",
    },
    {
      title: "操作",
      key: "operator",
      // 自定义渲染操作按钮
      render: (row: any) => {
        return (
          // React Fragment `<>`，用来包裹多个元素，它本身不会在页面上渲染成任何标签
          <>
            {/* “查看”按钮 */}
            <Button
              type="primary"
              // 给按钮添加点击事件
              // 点击后，调用 `navigate` 函数跳转到订单详情页，URL 中包含了当前行的订单 ID (`row.id`)
              onClick={() => navigate(`/syt/order/orderInfo/show/${row.id}`)}
            >
              查看
            </Button>
          </>
        );
      },
    },
  ];

  // --- JSX 渲染 (Rendering) ---
  // `return` 后面是这个组件要渲染到屏幕上的内容
  return (
    // 使用 `Card` 组件作为最外层的容器
    <Card>
      {/* 搜索表单, `layout="inline"` 使表单项水平排列, `onFinish` 指定提交时调用的函数, `form` 关联我们创建的 form 实例 */}
      <Form layout="inline" onFinish={onFinish} form={form}>
        {/* `Form.Item` 代表一个表单项, `name` 是这个表单项的唯一标识，用于收集数据 */}
        <Form.Item name="hosname">
          <Input placeholder="医院名称" />
        </Form.Item>

        <Form.Item name="outTradeNo">
          <Input placeholder="订单号" />
        </Form.Item>

        <Form.Item name="patientName">
          <Input placeholder="就诊人姓名" />
        </Form.Item>

        <Form.Item name="createTimeBegin">
          {/* 使用我们之前定义的 `DatePick` 日期选择器组件 */}
          <DatePick placeholder="选择开始日期" />
        </Form.Item>

        <Form.Item name="createTimeEnd">
          <DatePick placeholder="选择截止日期" />
        </Form.Item>

        <Form.Item name="reserveDate">
          <DatePick placeholder="选择就诊时间" />
        </Form.Item>

        {/* 订单状态选择器 */}
        <Form.Item name="orderStatus">
          <Select placeholder="订单状态" style={{ width: 182, marginTop: 10 }}>
            {/* 使用 map 方法遍历 `statusList` 状态数组，为每个状态生成一个下拉选项 */}
            {statusList.map((item: any) => {
              return (
                // `Option` 是下拉菜单中的一个选项
                // `value` 是选中后实际提交的值，`key` 是 React 用于优化的唯一标识
                <Option value={item.status} key={item.status}>
                  {/* `item.comment` 是显示在下拉菜单中的文字 */}
                  {item.comment}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        {/* 按钮区域 */}
        <Form.Item>
          {/* “查询”按钮, `htmlType="submit"` 表示这是一个表单提交按钮, 点击会触发表单的 `onFinish` 事件 */}
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            style={{ marginRight: 10, marginTop: 10 }}
          >
            查询
          </Button>
          {/* “清空”按钮, 点击时调用 `clear` 函数 */}
          <Button onClick={clear}>清空</Button>
        </Form.Item>
      </Form>

      {/* 数据展示表格 */}
      <Table
        style={{ marginTop: 20 }} // 设置上边距
        columns={columns} // `columns` 属性接收我们上面定义的列配置
        dataSource={orderList} // `dataSource` 属性接收订单列表数据
        bordered // `bordered` 属性给表格添加边框
        rowKey="id" // `rowKey` 指定表格行的唯一标识，这里用的是订单的 `id`
        // `pagination` 属性用于配置分页器
        pagination={{
          current: page, // 当前页码，由 `page` 状态控制
          pageSize: limit, // 每页条数，由 `limit` 状态控制
          total, // 总数据条数，由 `total` 状态控制
          showQuickJumper: true, // 显示快速跳转到某一页的输入框
          showSizeChanger: true, // 显示可以改变每页条数的选择器
          showTotal: (total) => `总共 ${total} 条`, // 自定义显示总条数的文本
          onChange: handleChange, // 当页码或每页条数改变时，调用 `handleChange` 函数
        }}
      />
    </Card>
  );
}

// 将 OrderList 组件作为默认导出
export default OrderList;
