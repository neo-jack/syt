// 从 'react' 库中导入 useEffect 和 useState 这两个核心 Hooks
// useEffect 用于在组件加载后执行代码（如请求数据），useState 用于在组件中管理可变的状态
import { useEffect, useState } from "react";
// 从 'antd' UI 库中导入卡片、表单、输入框、按钮、表格、选择器等组件
import { Card, Form, Input, Button, Table, Select } from "antd";
// 从 antd 的图标库中导入搜索图标
import { SearchOutlined } from "@ant-design/icons";
// 从 antd 的 table 组件中导入类型定义(ColumnsType)，用于给表格的列配置(columns)做类型检查
import type { ColumnsType } from "antd/lib/table";
// 从 'react-router-dom' 库中导入 useNavigate Hook，用于实现页面跳转
import { useNavigate } from "react-router-dom";

// 从我们自己封装的 API 文件中，导入与服务器通信的函数
// reqGetHospitalList 用于请求获取医院列表
// reqGetCityList 用于根据父级ID获取省、市、区或医院类型的列表
// reqUpdateHospitalStatus 用于更新医院的上线/下线状态
import {
  reqGetHospitalList,
  reqGetCityList,
  reqUpdateHospitalStatus,
} from "@api/hospital/hospitalList";
// 从 API 的类型定义文件中，导入我们为数据定义的 TypeScript 类型，以获得更好的代码提示和错误检查
import {
  HospitalListType,
  HospitalItem,
  CityList,
  SearchHospitalListParams,
  Status,
} from "@api/hospital/model/hospitalListTypes";

// 导入这个组件专属的 less 样式文件
import "./index.less";

// 从 Select 组件中解构出 Option 子组件，这样我们在下面就可以直接使用 <Option> 而不是 <Select.Option>
const { Option } = Select;

// 定义并默认导出 HospitalList 组件，这是医院列表页面的主组件
export default function HospitalList() {
  // --- State 管理 ---
  // 使用 useState 创建一个 'hospitalList' state，用于存储从服务器获取到的医院列表数据，初始值为空数组
  const [hospitalList, setHospitalList] = useState<HospitalListType>([]);
  // 创建 'current' state，用于管理表格分页器的当前页码，默认为第 1 页
  const [current, setCurrent] = useState(1);
  // 创建 'pageSize' state，用于管理分页器每页显示的条数，默认为 5 条
  const [pageSize, setPageSize] = useState(5);
  // 创建 'total' state，用于存储医院总数，以便分页器显示总条目
  const [total, setTotal] = useState(0);
  // 创建 'loading' state，用于控制表格是否显示加载中的效果，默认为 false (不加载)
  const [loading, setLoading] = useState(false);

  // --- API 调用函数 ---
  // 定义一个异步函数 getHospitalList，用于封装获取医院列表的逻辑
  const getHospitalList = async (
    current: number,
    pageSize: number,
    searchParams: SearchHospitalListParams
  ) => {
    // 在开始发送网络请求之前，将 loading 状态设置为 true，表格会显示加载中动画
    setLoading(true);
    // 调用 API 函数 reqGetHospitalList，并传入页码、每页条数以及所有搜索条件
    const res = await reqGetHospitalList({
      page: current,
      limit: pageSize,
      ...searchParams,
    });
    // 请求成功后，使用 setHospitalList 更新医院列表数据
    setHospitalList(res.content);
    // 更新当前页码
    setCurrent(current);
    // 更新每页条数
    setPageSize(pageSize);
    // 更新总数据条数
    setTotal(res.totalElements);
    // 数据加载完毕，将 loading 状态设置回 false，表格加载动画消失
    setLoading(false);
  };

  // 创建 'hostypeList' state，用于存储所有医院类型的列表（如“三甲医院”、“社区医院”等）
  const [hostypeList, setHostypeList] = useState<CityList>([]);
  // 定义一个异步函数 getHostypeList，用于获取医院类型数据
  const getHostypeList = async () => {
    // 调用 API 函数 reqGetCityList，并传入固定的父级ID 10000 来获取医院类型列表
    const hostypeList = await reqGetCityList(10000);
    // 更新医院类型列表的 state
    setHostypeList(hostypeList);
  };

  // 使用 useEffect Hook，在组件第一次渲染到屏幕后执行其中的代码
  useEffect(() => {
    // 调用 getHospitalList 获取第一页的医院数据，此时搜索条件 searchParams 是一个空对象，表示获取全部数据
    getHospitalList(current, pageSize, searchParams);
    // 调用 getProvince 获取所有省份的数据，用于填充“省”下拉选择框
    getProvince();
    // 调用 getHostypeList 获取所有医院类型的数据，用于填充“医院类型”下拉选择框
    getHostypeList();
    // 依赖数组为空 `[]`，表示这个 effect 只在组件首次挂载时执行一次
  }, []);

  /*
    关于省市区三级联动功能的说明：
    这个功能依赖于一个公共的API接口 `/admin/cmn/dict/findByParentId/{parentId}`
    - 第一次，我们用固定的父级ID `86` (代表中国) 来获取所有省份的数据。
    - 当用户选择一个省份后，我们就用这个省份的ID作为新的 `parentId` 去获取它下面的所有城市数据。
    - 当用户选择一个城市后，再用这个城市的ID作为 `parentId` 去获取它下面的所有区县数据。
  */

  // 创建 'province', 'city', 'district' 三个 state，分别用于存储省、市、区的列表数据
  const [province, setProvince] = useState<CityList>([]);
  const [city, setCity] = useState<CityList>([]);
  const [district, setDistrict] = useState<CityList>([]);

  // 定义异步函数 getProvince，用于获取省份数据
  const getProvince = async () => {
    // 调用 API，传入父级ID 86 获取省份列表
    const province = await reqGetCityList(86);
    // 更新省份列表的 state
    setProvince(province);
  };

  // --- 事件处理函数 ---
  // 当“省”下拉框的选择发生变化时，这个函数会被调用
  const handleProvinceChange = async (value: number) => {
    // 使用新选中的省份ID(value)作为父级ID，去获取对应的城市列表
    const city = await reqGetCityList(value);
    // 更新城市列表的 state
    setCity(city);
    // 由于省变了，原来的区/县列表就失效了，所以清空它
    setDistrict([]);
    // 同时，也要清空表单里已选择的“市”和“区”的值，让它们变回占位符提示
    // `form.resetFields` 可以重置表单指定字段的值
    form.resetFields(["cityCode", "districtCode"]);
  };

  // 当“市”下拉框的选择发生变化时，这个函数会被调用
  const handleCityChange = async (value: number) => {
    // 使用新选中的城市ID(value)作为父级ID，去获取对应的区/县列表
    const district = await reqGetCityList(value);
    // 更新区/县列表的 state
    setDistrict(district);
    // 重置表单里已选择的“区”的值
    form.resetFields(["districtCode"]);
  };

  // 定义一个函数，用于更新医院的上线/下线状态
  // 这是一个高阶函数，它接收 id 和 status，并返回一个真正的点击事件处理函数
  const updateHospitalStatus = (id: string, status: Status) => {
    // 返回的这个异步函数，才是最终绑定到“上线”/“下线”按钮 onClick 事件上的
    return async () => {
      // 调用 API 更新状态。如果当前 status 是 0（未上线），就传 1（要上线）；如果是 1，就传 0。
      await reqUpdateHospitalStatus(id, status === 0 ? 1 : 0);
      // 更新状态成功后，重新获取当前的医院列表，以刷新表格中的显示
      getHospitalList(current, pageSize, searchParams);
    };
  };

  // --- 表格列定义 ---
  // 定义表格的列(columns)配置，它是一个对象数组
  const columns: ColumnsType<HospitalItem> = [
    {
      title: "序号", // 列标题
      // render 函数用于自定义单元格的显示内容
      // 这里用 `index` 参数来显示行号，因为 index 从 0 开始，所以 +1
      render: (row, records, index) => index + 1,
      align: "center", // 内容居中对齐
      width: 80, // 列宽度
    },
    {
      title: "医院logo",
      // render 函数接收当前行的数据 `row` 作为参数
      // 这里我们使用 `img` 标签来显示图片
      // `src` 属性的值是一个特殊的 data URL，用于显示 Base64 编码的图片字符串
      render: (row) => (
        <img
          className="hospital-logo"
          src={`data:image/jpeg;base64,${row.logoData}`}
          alt={row.hosname}
        />
      ),
    },
    {
      title: "医院名称",
      dataIndex: "hosname", // 直接显示数据记录中 `hosname` 属性的值
    },
    {
      title: "等级",
      // `row.param.hostypeString` 是后端处理好的医院等级文字描述
      render: (row) => row.param.hostypeString,
    },
    {
      title: "详细地址",
      // `row.param.fullAddress` 是后端拼接好的完整地址
      render: (row) => row.param.fullAddress,
    },
    {
      title: "状态",
      // dataIndex: "status",
      // render 接收 `status` 值，根据 0 或 1 显示不同的文字
      render: (status) => (status === 0 ? "未上线" : "已上线"),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
    },
    {
      title: "操作",
      width: 250,
      // render 函数用于渲染操作按钮
      render: (row) => {
        return (
          <>
            <Button type="primary" onClick={goShowHospital(row.id)}>
              查看
            </Button>
            <Button
              type="primary"
              className="ml"
              onClick={goHospitalSchedule(row.hoscode)}
            >
              排班
            </Button>
            {/* 根据当前行的 status 值，动态决定按钮的文本和功能 */}
            <Button
              type="primary"
              className="ml"
              onClick={updateHospitalStatus(row.id, row.status)}
            >
              {row.status === 0 ? "上线" : "下线"}
            </Button>
          </>
        );
      },
    },
  ];

  // --- 表单处理 ---
  // 使用 antd 的 Form.useForm() hook 来创建一个 form 实例，用于控制表单
  const [form] = Form.useForm();
  // 创建 'searchParams' state，用于存储当前生效的搜索条件
  const [searchParams, setSearchParams] = useState<SearchHospitalListParams>({});

  // 当表单被提交时（点击“查询”按钮），这个函数会被调用
  const onFinish = (values: SearchHospitalListParams) => {
    // `values` 是 antd 表单自动收集到的所有表单项的值
    // 更新搜索参数的 state
    setSearchParams(values);
    // 每次执行新的搜索时，都应该从第一页开始显示结果
    getHospitalList(1, 5, values);
  };

  // 当点击“清空”按钮时，这个函数会被调用
  const reset = () => {
    // 将分页重置回第一页
    setCurrent(1);
    setPageSize(5);
    // 清空存储的搜索条件
    setSearchParams({});
    // 重新请求不带任何搜索条件的第一页数据
    getHospitalList(1, 5, {});
    // 调用 form 实例的 resetFields 方法，清空表单上所有的输入框和选择框
    form.resetFields();
  };

  // --- 页面跳转 ---
  // 使用 useNavigate hook 获取 navigate 函数
  const navigate = useNavigate();

  // 定义一个高阶函数，用于生成跳转到医院详情页的点击事件处理函数
  const goShowHospital = (id: string) => {
    return () => {
      // navigate 函数接收一个路径作为参数，实现页面跳转
      navigate(`/syt/hospital/hospitalList/show/${id}`);
    };
  };

  // 定义一个高阶函数，用于生成跳转到医院排班页的点击事件处理函数
  const goHospitalSchedule = (hoscode: string) => {
    return () => {
      navigate(`/syt/hospital/hospitalList/schedule/${hoscode}`);
    };
  };

  // --- JSX 渲染 ---
  // return 语句返回的是这个组件最终要渲染到屏幕上的内容
  return (
    <Card>
      {/* antd 的 Form 组件，用于创建搜索表单 */}
      {/* layout="inline" 使表单项在一行内排列 */}
      {/* form={form} 将我们创建的 form 实例与这个表单关联起来 */}
      {/* onFinish={onFinish} 指定表单提交时要调用的函数 */}
      <Form layout="inline" form={form} onFinish={onFinish}>
        {/* Form.Item 是一个表单项容器 */}
        {/* name="provinceCode" 是这个表单项的名字，用于数据收集和后续操作 */}
        <Form.Item name="provinceCode">
          {/* antd 的 Select 选择器组件 */}
          {/* onChange={handleProvinceChange} 指定选择变化时触发的函数 */}
          <Select
            style={{ width: 200 }}
            onChange={handleProvinceChange}
            placeholder="请选择省"
          >
            {/* 使用 map 方法遍历 'province' state 数组，为每个省份生成一个 Option */}
            {province.map((provinceItem) => {
              // Option 是选择器的选项。key 是 React 列表渲染必需的，value 是选中后实际获得的值
              return (
                <Option key={provinceItem.id} value={provinceItem.id}>
                  {provinceItem.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name="cityCode">
          <Select
            style={{ width: 200 }}
            onChange={handleCityChange}
            placeholder="请选择市"
          >
            {city.map((cityItem) => {
              return (
                <Option key={cityItem.id} value={cityItem.id}>
                  {cityItem.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name="districtCode">
          <Select style={{ width: 200 }} placeholder="请选择区">
            {district.map((districtItem) => {
              return (
                <Option key={districtItem.id} value={districtItem.id}>
                  {districtItem.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item name="hosname">
          <Input placeholder="医院名称" />
        </Form.Item>

        <Form.Item name="hoscode">
          <Input placeholder="医院编号" />
        </Form.Item>

        <Form.Item className="mt" name="hostype">
          <Select style={{ width: 200 }} placeholder="医院类型">
            {hostypeList.map((hostypeItem) => {
              return (
                // 注意这里的 value 使用的是 hostypeItem.value，这是后端数据结构决定的
                <Option key={hostypeItem.id} value={hostypeItem.value}>
                  {hostypeItem.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item className="mt" name="status">
          <Select style={{ width: 200 }} placeholder="医院状态">
            {/* 对于固定的选项，可以直接写 Option */}
            {/* value={0} 和 value={1} 这样写，收集到的值是 number 类型，符合接口要求 */}
            <Option value={0}>未上线</Option>
            <Option value={1}>已上线</Option>
          </Select>
        </Form.Item>

        <Form.Item className="mt">
          {/* antd 的 Button 组件 */}
          {/* type="primary" 设置为主要按钮样式 */}
          {/* icon={<...>} 设置按钮图标 */}
          {/* htmlType="submit" 表示这个按钮是表单的提交按钮，点击它会触发表单的 onFinish 事件 */}
          <Button type="primary" icon={<SearchOutlined />} htmlType="submit">
            查询
          </Button>
          {/* onClick={reset} 绑定清空按钮的点击事件 */}
          <Button className="ml" onClick={reset}>
            清空
          </Button>
        </Form.Item>
      </Form>

      {/* antd 的 Table 表格组件 */}
      <Table
        // dataSource 指定表格的数据源
        dataSource={hospitalList}
        // columns 指定表格的列配置
        columns={columns}
        className="mt"
        bordered
        // rowKey 指定数据记录中用作唯一 key 的属性，这里是 'id'
        rowKey="id"
        // pagination 属性用于配置分页器
        pagination={{
          current, // 当前页码，受 state 控制
          pageSize, // 每页条数，受 state 控制
          total, // 总条数，受 state 控制
          pageSizeOptions: [5, 10, 15, 20], // 可选的每页条数
          showSizeChanger: true, // 显示每页条数切换器
          showQuickJumper: true, // 显示快速跳转到某页的输入框
          showTotal: (total) => `总共：${total}`, // 显示总条数
          // 当页码或每页条数改变时的回调函数
          onChange: (current, pageSize) => {
            // 调用我们的数据获取函数，传入新的页码和条数，以及当前的搜索条件
            getHospitalList(current, pageSize, searchParams);
          },
        }}
        // loading 属性控制表格的加载状态，将其与我们的 'loading' state 绑定
        loading={loading}
      />
    </Card>
  );
}
