// 从 "react" 库中导入 useEffect、useState 和 Key。
// useEffect 是一个 React Hook，它能让你在函数组件中执行副作用操作（比如获取数据、设置订阅、手动更改 DOM）。
// useState 是一个 React Hook，它允许你在函数组件中添加和管理 state（状态）。
// Key 是 React 用于识别列表中哪些元素改变、添加或删除的特殊字符串属性，在渲染列表时非常重要。
import { useEffect, useState, Key } from "react";
// 从 "antd" UI 库中导入各种组件，用于快速构建美观的界面。
// Card: 卡片组件，通常用于包裹一块内容，使其有边框和阴影，看起来更清晰。
// Form: 表单组件，用于收集、校验和提交用户输入的数据。
// Input: 输入框组件，用于用户输入文本。
// Button: 按钮组件。
// Table: 表格组件，用于展示结构化的数据。
// Tooltip: 文字提示组件，当鼠标悬停在元素上时，会显示一个提示信息。
// Modal: 对话框组件，用于需要用户响应的操作，如确认删除。
// message: 全局提示组件，用于显示操作成功、失败等反馈信息。
import { Card, Form, Input, Button, Table, Tooltip, Modal, message } from "antd";
// 从 antd 的图标库中导入图标。
// SearchOutlined: 搜索图标。
// EditOutlined: 编辑图标。
// DeleteOutlined: 删除图标。
import { SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// 从 antd 的表格组件库中导入 ColumnsType 类型。
// 这个类型用于给表格的列（columns）配置提供 TypeScript 的类型检查，让代码更健壮。
import type { ColumnsType } from "antd/lib/table";
// 导入 react-i18next 库中的 useTranslation Hook。
// useTranslation 用于实现国际化（i18n），让应用支持多种语言。
import { useTranslation } from "react-i18next";

// 导入 react-router-dom 库中的 useNavigate Hook。
// useNavigate 用于在代码中进行页面跳转，实现编程式导航。
import { useNavigate } from "react-router-dom";

// 导入封装好的 API 请求函数。
// reqGetHospitalSetList: 请求获取医院设置列表数据的函数。
// reqRemoveHospital: 请求根据 ID 删除单个医院设置的函数。
// reqBatchRemoveHospitals: 请求批量删除多个医院设置的函数。
import { reqGetHospitalSetList, reqRemoveHospital, reqBatchRemoveHospitals } from "@api/hospital/hospitalSet";
// 导入与医院设置相关的 TypeScript 类型定义。
// HospitalSetList: 医院设置列表的类型。
// HospitalSetItem: 医院设置列表中单个项目的类型。
// SearchParams: 搜索参数的类型。
import { HospitalSetList, HospitalSetItem, SearchParams } from "@api/hospital/model/hospitalSetTypes";

// 导入当前组件的样式文件。
// Less 是一种 CSS 预处理器，它扩展了 CSS，增加了变量、Mixin、函数等功能，使样式更易于维护。
import "./index.less";

// 下面这部分被注释掉的代码是早期开发时可能用到的静态数据或类型定义。
// 它们通常用于在后端接口未完成时，前端进行页面布局和功能测试。
// interface DataType {
//   id: string;
//   name: string;
//   money: string;
//   address: string;
// }

// const data = [
//   {
//     // 遍历的每项元素要求有一个唯一的key属性
//     id: "1",
//     name: "John Brown",
//     money: "￥300,000.00",
//     address: "New York No. 1 Lake Park",
//   },
//   {
//     id: "2",
//     name: "Jim Green",
//     money: "￥1,256,000.00",
//     address: "London No. 1 Lake Park",
//   },
//   {
//     id: "3",
//     name: "Joe Black",
//     money: "￥120,000.00",
//     address: "Sidney No. 1 Lake Park",
//   },
// ];

// 定义并导出一个名为 HospitalSet 的函数组件。
// `export default` 表示这是模块的默认导出，其他文件可以很方便地导入它。
export default function HospitalSet() {
  // 调用 useTranslation Hook 来获取翻译函数 `t`。
  // `["hospitalSet"]` 指定了要加载的语言包文件（命名空间），这样 `t` 函数就能翻译 'hospitalSet.json' 文件中定义的键。
  const [t] = useTranslation(["hospitalSet"]);
  // 使用 useState 创建一个 state 来存储医院设置列表数据。
  // `hospitalSetList` 是当前的状态值，`setHospitalSetList` 是更新这个状态的函数。
  // `useState<HospitalSetList>([])` 初始化状态为一个空数组，并指定其类型为 `HospitalSetList`。
  const [hospitalSetList, setHospitalSetList] = useState<HospitalSetList>([]);
  // 使用 useState 创建一个布尔类型的 state，用于控制表格是否显示加载中状态。
  // `loading` 为 true 时显示加载动画，为 false 时不显示。默认为 false。
  const [loading, setLoading] = useState(false);
  // 使用 useState 创建一个 state，用于存储当前表格的页码。
  // 默认为第 1 页。
  const [current, setCurrent] = useState(1);
  // 使用 useState 创建一个 state，用于存储每页显示的条目数。
  // 默认为每页 5 条。
  const [pageSize, setPageSize] = useState(5);
  // 使用 useState 创建一个 state，用于存储数据总条数。
  // 这个值将用于分页器组件，以计算总页数。默认为 0。
  const [total, setTotal] = useState(0);

  // 使用 useState 创建 state，用于记录上一次搜索的医院名称。
  // 这是为了在用户搜索后进行分页操作时，能保持搜索条件不变。
  const [lastHosname, setLastHosname] = useState("");
  // 使用 useState 创建 state，用于记录上一次搜索的医院编码。
  // 同样是为了在分页时能记住搜索条件。
  const [lastHoscode, setLastHoscode] = useState("");

  // 定义一个异步函数 `getHospitalSetList`，用于从服务器获取医院设置列表。
  // 它接受页码、每页条数以及可选的搜索条件（医院名称和编码）作为参数。
  const getHospitalSetList = async (current: number, pageSize: number, hosname?: string, hoscode?: string) => {
    // 在发送网络请求之前，将 loading 状态设置为 true，这样界面上会显示加载动画。
    setLoading(true);
    // 调用 API 函数 `reqGetHospitalSetList` 发送网络请求。
    // `await` 关键字会暂停函数的执行，直到请求完成并返回结果。
    const res = await reqGetHospitalSetList({
      page: current, // 请求的页码。
      limit: pageSize, // 每页的数据量。
      hoscode, // 医院编码，如果未提供则为 undefined。
      hosname, // 医院名称，如果未提供则为 undefined。
    });
    // 请求成功后，更新当前页码的状态。
    setCurrent(current);
    // 更新每页条数的状态。
    setPageSize(pageSize);
    // 使用从服务器获取到的数据 `res.records` 来更新医院设置列表的状态。
    setHospitalSetList(res.records);
    // 使用从服务器获取到的总数 `res.total` 来更新总条数的状态。
    setTotal(res.total);
    // 数据更新完毕后，将 loading 状态设置回 false，隐藏加载动画。
    setLoading(false);
  };
  // 使用 useEffect Hook，在组件第一次挂载到 DOM 后执行一次。
  // 这相当于类组件中的 `componentDidMount` 生命周期方法。
  useEffect(() => {
    // 调用 `getHospitalSetList` 函数，获取第一页的初始数据。
    getHospitalSetList(current, pageSize);

    // `useEffect` 的第二个参数是一个依赖数组，用于控制 `useEffect` 的执行时机。
    // 这里传入一个空数组 `[]`，表示这个 effect 只在组件挂载时执行一次，之后不再执行。
    // 如果不传这个数组，effect 会在每次组件重新渲染后都执行，可能导致无限循环的请求。
    // 如果数组中包含变量（如 `[current, pageSize]`），那么只有当这些变量的值发生变化时，effect 才会重新执行。
    // 在这个场景下，分页器的 onChange 事件会手动调用 `getHospitalSetList`，所以不需要将 `current` 和 `pageSize` 作为依赖项。
  }, []);

  // 定义表单提交成功后的回调函数 `onFinish`。
  // antd 的 Form 组件在表单验证通过并提交时会调用这个函数。
  const onFinish = (values: SearchParams) => {
    // 从表单提交的数据 `values` 中解构出医院名称和医院编码。
    const { hosname, hoscode } = values;
    // 更新 state，保存这次的搜索条件，以便分页时使用。
    // `as string` 是 TypeScript 的类型断言，告诉编译器 `hosname` 的类型是字符串。
    setLastHosname(hosname as string);
    // 更新 state，保存这次的搜索条件。
    setLastHoscode(hoscode as string);
    // 调用 `getHospitalSetList` 函数，根据新的搜索条件从第一页开始获取数据。
    getHospitalSetList(1, 5, hosname, hoscode);
  };

  // 调用 useNavigate Hook，获取一个用于页面跳转的 `navigate` 函数。
  const navigate = useNavigate();
  // 定义一个函数 `goAddHospital`，用于跳转到添加医院设置的页面。
  const goAddHospital = () => {
    // 使用 `navigate` 函数进行页面跳转。
    navigate("/syt/hospital/hospitalSet/add");
  };

  // 定义一个高阶函数 `goUpdateHospital`，用于跳转到编辑医院设置的页面。
  // 高阶函数是指一个函数返回另一个函数。
  // 这样做的目的是为了在创建点击事件处理器时，能够方便地将当前行的 `id` 传递进去。
  const goUpdateHospital = (id: number) => {
    // 这个函数返回一个新的函数，这个返回的函数才是最终作为 `onClick` 事件的回调函数。
    return () => {
      // 在返回的函数内部，使用 `navigate` 函数进行页面跳转，并在 URL 中带上要编辑的医院的 ID。
      navigate(`/syt/hospital/hospitalSet/edit/${id}`);
    };
  };

  // 定义一个高阶函数 `showModal`，用于显示删除确认对话框。
  // 同样使用了高阶函数模式，以便将 `hosname` 和 `id` 传递给 `onClick` 事件。
  const showModal = (hosname: string, id: number) => {
    // 返回一个将要作为点击事件处理器的函数。
    return () => {
      // 调用 antd 的 `Modal.confirm` 方法，弹出一个确认对话框。
      Modal.confirm({
        // 设置对话框的标题，使用模板字符串动态地插入医院名称。
        title: `您确认要删除 ${hosname} 数据吗？`,
        // `onOk` 是一个回调函数，当用户点击“确认”按钮时会被调用。
        // 它被定义为 `async` 函数，因为内部有异步的 API 请求。
        async onOk() {
          // 调用 API 函数 `reqRemoveHospital`，发送删除请求。
          await reqRemoveHospital(id);
          // 删除成功后，使用 antd 的 `message.success` 显示一个成功的提示。
          message.success("删除医院数据成功");
          // 重新请求当前页的数据，以刷新表格，显示删除后的结果。
          // 使用之前保存的搜索条件 `lastHosname` 和 `lastHoscode` 来确保刷新后的数据依然符合搜索条件。
          getHospitalSetList(current, pageSize, lastHosname, lastHoscode);
        },
      });
    };
  };
  // 定义表格的列配置 `columns`。
  // `ColumnsType<HospitalSetItem>` 为这个配置提供了 TypeScript 类型支持，`HospitalSetItem` 是单行数据的类型。
  const columns: ColumnsType<HospitalSetItem> = [
    {
      // 设置列的标题为“序号”（通过 `t` 函数进行国际化翻译）。
      title: t("index"),
      // `render` 函数用于自定义这一列的显示内容。
      // 它接收三个参数：当前单元格的值（这里没用到，用 `_` 占位）、当前行的数据 `record`、当前行的索引 `index`。
      // 返回 `index + 1` 来显示从 1 开始的序号。
      render: (_, record, index) => (current - 1) * pageSize + index + 1,
      // 设置列的固定宽度为 70 像素。
      width: 70,
      // 设置内容居中对齐。
      align: "center",
    },
    {
      // 设置列的标题为“医院名称”。
      title: t("hosname"),
      // `dataIndex` 指定了这一列要显示的数据是 `dataSource` 中每条记录的 `hosname` 属性。
      dataIndex: "hosname",
    },
    {
      // 设置列的标题为“医院编号”。
      title: t("hoscode"),
      // 指定显示 `hoscode` 属性。
      dataIndex: "hoscode",
    },
    {
      // 设置列的标题为“api基础路径”。
      title: t("apiUrl"),
      // 指定显示 `apiUrl` 属性。
      dataIndex: "apiUrl",
    },
    {
      // 设置列的标题为“签名”。
      title: t("signKey"),
      // 指定显示 `signKey` 属性。
      dataIndex: "signKey",
    },
    {
      // 设置列的标题为“联系人姓名”。
      title: t("contactsName"),
      // 指定显示 `contactsName` 属性。
      dataIndex: "contactsName",
    },
    {
      // 设置列的标题为“联系人手机”。
      title: t("contactsPhone"),
      // 指定显示 `contactsPhone` 属性。
      dataIndex: "contactsPhone",
    },
    {
      // 设置列的标题为“操作”。
      title: t("operator"),
      // `fixed: "right"` 将这一列固定在表格的右侧，当表格水平滚动时它不会移动。
      fixed: "right",
      // 设置此操作列的宽度。
      width: 110,
      // 使用 `render` 函数自定义操作列的内容，这里是放置“编辑”和“删除”按钮。
      // 因为没有指定 `dataIndex`，`render` 函数的第一个参数 `row` 就是当前行的完整数据对象。
      render: (row) => {
        // 返回一个 React 片段 `<></>`，用于包裹多个按钮。
        return (
          <>
            {/* 使用 Tooltip 组件为编辑按钮添加文字提示。 */}
            <Tooltip placement="top" title={t("updateBtnText")}>
              {/* 创建一个蓝色的主按钮，图标为编辑图标。 */}
              {/* `onClick` 事件绑定了 `goUpdateHospital` 函数，并传入当前行的 ID，实现点击跳转到编辑页面。 */}
              <Button type="primary" icon={<EditOutlined />} onClick={goUpdateHospital(row.id)} />
            </Tooltip>
            {/* 使用 Tooltip 组件为删除按钮添加文字提示。 */}
            <Tooltip placement="top" title={t("removeBtnText")}>
              {/* 创建一个红色的危险按钮，图标为删除图标。 */}
              {/* `className="ml"` 是自定义样式，可能表示 "margin-left"。 */}
              {/* `onClick` 事件绑定了 `showModal` 函数，传入当前行的名称和 ID，实现点击弹出删除确认框。 */}
              <Button type="primary" danger icon={<DeleteOutlined />} className="ml" onClick={showModal(row.hosname, row.id)} />
            </Tooltip>
          </>
        );
      },
    },
  ];

  // 使用 useState 创建一个 state，用于存储表格中被选中的行的 key（这里是医院的 id）。
  // 初始值为空数组，表示默认没有任何行被选中。
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  // 定义表格行选择（即复选框）的配置对象 `rowSelection`。
  const rowSelection = {
    // `onChange` 是一个回调函数，当用户勾选或取消勾选复选框时触发。
    onChange: (selectedRowKeys: Key[]) => {
      // `selectedRowKeys` 参数是 antd Table 组件传入的，包含了所有当前被选中的行的 key 组成的数组。
      // 调用 `setSelectedRowKeys` 更新 state，保存最新的选中项。
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  // 定义一个函数 `showBatchRemoveModal`，用于显示批量删除的确认对话框。
  const showBatchRemoveModal = () => {
    // 同样使用 `Modal.confirm` 来创建确认框。
    Modal.confirm({
      // 设置对话框标题。
      title: `您确认要删除所有选中的数据吗？`,
      // 定义点击“确认”按钮后的异步操作。
      async onOk() {
        // 调用 API 函数 `reqBatchRemoveHospitals`，将所有选中的行ID（`selectedRowKeys`）作为参数传入，进行批量删除。
        await reqBatchRemoveHospitals(selectedRowKeys);
        // 批量删除成功后，显示成功提示。
        message.success("批量删除成功");
        // 清空已选中的行的 key 数组，这将导致表格的复选框被清空，同时“批量删除”按钮也会变为禁用状态。
        setSelectedRowKeys([]);
        // 重新获取数据，刷新表格。
        getHospitalSetList(current, pageSize, lastHosname, lastHoscode);
      },
    });
  };

  // 定义一个函数 `reset`，用于清空搜索条件并重置表单。
  const reset = () => {
    // 将当前页码和搜索条件相关的 state 重置为初始值。
    setCurrent(1);
    // 重置每页条数。
    setPageSize(5);
    // 清空上次保存的医院编码。
    setLastHoscode("");
    // 清空上次保存的医院名称。
    setLastHosname("");
    // 调用 `getHospitalSetList` 函数，不带任何搜索条件，重新获取全部数据的第一页。
    getHospitalSetList(1, 5, "", "");
    // 调用 antd 表单实例的 `resetFields` 方法，清空表单中所有输入框的内容。
    form.resetFields();
  };

  // 调用 antd 的 `Form.useForm` Hook，创建一个表单实例 `form`。
  // 这个实例可以用来控制表单，比如获取/设置表单域的值、重置表单等。
  const [form] = Form.useForm();

  // 组件的 `return` 语句定义了要渲染到屏幕上的 JSX 结构。
  return (
    // 使用 Card 组件作为页面的最外层容器，提供一个卡片式样的背景。
    <Card>
      {/* 
        创建一个 Form 表单组件。
        `layout="inline"` 属性让表单项在同一行内排列。
        `onFinish={onFinish}` 指定了表单提交（且验证通过）时要执行的回调函数。
        `form={form}` 将上面创建的 `form` 实例与这个 `Form` 组件关联起来，以便能控制它。
      */}
      <Form layout="inline" onFinish={onFinish} form={form}>
        {/*
          Form.Item 是一个表单项容器，用于包裹一个输入控件，并处理标签、验证信息等。
          `name="hosname"` 是最重要的属性，它定义了此输入框在表单数据对象中的键（key）。
          `hosname` 需要和接口文档的参数名保持一致。
        */}
        <Form.Item name="hosname">
          {/* Input 组件是文本输入框。`placeholder` 是输入框为空时显示的提示文字。 */}
          <Input placeholder={t("hosname")} />
        </Form.Item>
        {/* 这是第二个表单项，用于输入医院编码。 */}
        <Form.Item name="hoscode">
          {/* `placeholder` 同样使用 `t` 函数进行国际化。 */}
          <Input placeholder={t("hoscode")} />
        </Form.Item>
        {/* 这是放置操作按钮的表单项。 */}
        <Form.Item>
          {/* 这是一个“查询”按钮。`type="primary"` 设置为蓝色主按钮样式。 */}
          {/* `icon={<SearchOutlined />}` 给按钮添加一个搜索图标。 */}
          {/* `htmlType="submit"` 是关键，它表明这个按钮是表单的提交按钮，点击它会触发表单的 `onFinish` 事件。 */}
          <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
            {/* 按钮的文本，通过 `t` 函数翻译。 */}
            {t("searchBtnText")}
          </Button>
          {/* 这是一个“清空”按钮。`className="ml"` 是自定义样式，用于添加左边距。 */}
          {/* `onClick={reset}` 绑定了点击事件，点击时调用 `reset` 函数。 */}
          <Button className="ml" onClick={reset}>
            {t("resetBtnText")}
          </Button>
        </Form.Item>
      </Form>

      {/* 这是一个 `div` 容器，用于放置“添加”和“批量删除”按钮，`className="mtb"` 是自定义样式，可能表示 "margin-top-bottom"。 */}
      <div className="mtb">
        {/* “添加”按钮。点击时调用 `goAddHospital` 函数跳转到添加页面。 */}
        <Button type="primary" onClick={goAddHospital}>
          {t("addBtnText")}
        </Button>
        {/* “批量删除”按钮。`danger` 属性使其显示为红色警告样式。 */}
        {/* `disabled={!selectedRowKeys.length}` 是一个重要的逻辑：
            当 `selectedRowKeys` 数组的长度为 0（即 `!selectedRowKeys.length` 为 true）时，按钮被禁用。
            只有当用户至少选中了一行时，这个按钮才可用。
        */}
        {/* `onClick={showBatchRemoveModal}` 点击时调用显示批量删除确认框的函数。 */}
        <Button type="primary" danger className="ml" disabled={!selectedRowKeys.length} onClick={showBatchRemoveModal}>
          {t("batchRemoveBtnText")}
        </Button>
      </div>

      {/*
        Table 表格组件，用于显示医院设置列表。
        `columns={columns}`: 指定表格的列定义。
        `dataSource={hospitalSetList}`: 指定表格的数据源，是一个对象数组。
        `bordered`: 给表格添加边框。
        `rowKey="id"`: 指定数据记录中 `id` 字段作为每一行的唯一标识（key）。这对于 React 高效更新 DOM 和表格功能（如行选择）至关重要。
        `scroll={{ x: 1300 }}`: 设置表格的滚动属性。`x: 1300` 表示当表格内容宽度超过 1300px 时，出现水平滚动条。
        `pagination={{...}}`: 配置分页器。
        `loading={loading}`: 将表格的加载状态与 `loading` state 绑定。当 `loading` 为 true 时，表格会显示一个加载遮罩。
        `rowSelection={{...}}`: 配置行选择功能。
      */}
      <Table
        columns={columns}
        dataSource={hospitalSetList}
        bordered
        rowKey="id"
        scroll={{ x: 1300 }}
        pagination={{
          current, // 当前页码，与 state 中的 `current` 绑定。
          pageSize, // 每页条数，与 state 中的 `pageSize` 绑定。
          total, // 数据总数，与 state 中的 `total` 绑定。
          pageSizeOptions: [5, 10, 15, 20], // 设置可供用户选择的每页条数选项。
          showSizeChanger: true, // 显示一个可以改变 `pageSize` 的选择器。
          showQuickJumper: true, // 显示可以快速跳转到某一页的输入框。
          showTotal: (total) => `${t("total")}${total}`, // 自定义显示总条数的文本。
          // `onChange` 是分页器最重要的回调函数，当页码或每页条数改变时触发。
          onChange: (current, pageSize) => {
            // 在回调中，调用 `getHospitalSetList` 函数，传入新的页码和每页条数，以及之前保存的搜索条件，来获取新一页的数据。
            getHospitalSetList(current, pageSize, lastHosname, lastHoscode);
          },
        }}
        loading={loading}
        rowSelection={{
          type: "checkbox", // 指定选择类型为复选框。
          ...rowSelection, // 使用展开运算符 `...` 将前面定义的 `rowSelection` 配置对象（主要是 onChange 事件）混入。
        }}
      />
    </Card>
  );
}
