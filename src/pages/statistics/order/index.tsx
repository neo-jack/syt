// 从 'react' 库中导入 React 核心功能和三个 "Hooks"：`useEffect`、`useState`、`useRef`。
// `useEffect`: 让我们可以在组件渲染后执行一些操作，比如初始化图表库。
// `useState`: 用于在组件中创建和管理“状态”（可以随时间变化的数据），比如存储图表实例。
// `useRef`: 用于创建一个引用，它可以直接关联到页面上的一个元素（比如一个 `div`），方便我们直接操作这个元素。
import React, { useEffect, useState, useRef } from "react";
// 从 'antd' UI库中导入一系列组件，用于构建页面的用户界面。
// `Card`: 卡片，用于将内容包裹在一个漂亮的容器里。
// `Form`: 表单，用于创建输入区域。
// `Button`: 按钮。
// `Input`: 输入框。
// `DatePicker`: 日期选择器。
import { Card, Form, Button, Input, DatePicker } from "antd";
// 从 antd 的图标库中导入“搜索”图标。
import { SearchOutlined } from "@ant-design/icons";
// 从 'echarts' 这个强大的图表库中，导入所有功能，并命名为 `echarts`。我们将用它来创建统计图表。
import * as echarts from "echarts";
// 从我们自己项目封装的 API 文件中，导入一个名为 `getCountMap` 的函数。
// 这个函数的作用是向服务器请求订单统计数据。
import { getCountMap } from "@/api/statistics/orderStatistics";

// 这里创建了一个名为 `DatePick` 的变量，并将 `DatePicker` 组件赋值给它。
// `any` 类型表示我们暂时不指定它的具体类型。这可能是一种临时的写法，或者为了解决某些特定的类型问题。
// 在功能上，`DatePick` 就等同于 `DatePicker`。
const DatePick: any = DatePicker;

// 定义一个名为 `StatisticsOrder` 的函数组件。这个组件将负责显示订单统计页面。
function StatisticsOrder() {
  // 调用 antd 的 `Form.useForm()` 方法，创建一个表单的“控制器”实例，并存到 `form` 变量中。
  // 通过这个 `form` 变量，我们可以管理表单（比如获取或设置表单项的值）。
  const [form] = Form.useForm();
  // 使用 `useState` 创建一个状态来存储 ECharts 图表的实例。
  // `chart` 是存储图表实例的变量，`setChart` 是一个专门用来更新这个变量的函数。
  // 初始值是一个空对象 `{}`。
  const [chart, setChart] = useState<any>({});
  // 使用 `useRef` 创建一个引用，名为 `inputEl`，初始值为 `null`。
  // 我们将把这个引用附加到页面上用于绘制图表的 `div` 元素上。
  const inputEl = useRef<any>(null);

  // 使用 `useEffect` 来在组件第一次渲染到屏幕后执行一些初始化操作。
  useEffect(() => {
    // 调用 `echarts.init()` 方法来初始化一个 ECharts 实例。
    // `inputEl.current` 指向的就是我们用 `ref` 关联的那个 `div` 元素。
    // 这行代码的意思是：“在那个 div 上创建一个图表”。
    const myEcharts = echarts.init(inputEl.current);
    // 调用 `setChart` 函数，将刚刚创建的 `myEcharts` 实例保存到组件的状态中。
    // 这样我们就能在其他地方（比如 `onFinish` 函数里）使用这个图表实例了。
    setChart(myEcharts);
    // `useEffect` 的第二个参数是 `[]`（一个空数组），它告诉 React：这个 effect 里的代码只需要在组件首次加载时执行一次，之后就不用再执行了。
  }, []);

  // 定义一个名为 `onFinish` 的函数。这个函数会在用户提交表单时（比如点击查询按钮）被触发。
  // `async` 关键字表示这是一个异步函数，它内部可以有需要等待的操作（比如等待服务器返回数据）。
  const onFinish = async () => {
    // 调用 `getCountMap` 函数从服务器获取统计数据。
    // `await` 会暂停函数的执行，直到数据成功返回。
    // 这里传入了一个空对象 `{}`，表示目前我们是获取全部的统计数据，还没有根据表单的输入来筛选。
    const data = await getCountMap({});

    // 创建一个 `option` 对象，这是 ECharts 图表的配置项。它告诉图表应该长什么样，以及显示什么数据。
    const option = {
      // 图表的标题设置
      title: {
        text: "挂号量统计", // 标题文字
      },
      // X 轴（横轴）的配置
      xAxis: {
        data: data.dateList, // X 轴的刻度标签，使用从服务器获取的日期列表 `data.dateList`
      },
      // Y 轴（纵轴）的配置
      yAxis: {}, // 这里是一个空对象，表示使用 ECharts 的默认 Y 轴设置
      // "系列"（series）是图表中的数据集合。
      series: {
        type: "line", // 图表类型为折线图
        data: data.countList, // 折线图的数据点，使用从服务器获取的挂号数量列表 `data.countList`
      },
    };

    // 调用图表实例的 `setOption` 方法，将上面创建的配置对象 `option` 应用到图表上。
    // 这时，图表就会根据新的配置和数据进行绘制或更新。
    chart.setOption(option);
  };

  // `return` 后面是这个组件要渲染到页面上的 JSX 内容。
  return (
    // 使用 `Card` 组件把所有内容包起来，形成一个卡片布局。
    <Card>
      {/*
        使用 `Form` 组件来创建一个行内表单。
        `layout="inline"`: 让表单项在同一行内排列。
        `onFinish={onFinish}`: 当表单提交时，调用 `onFinish` 函数。
        `form={form}`: 将这个 `Form` 组件与我们之前创建的 `form` 控制器关联起来。
      */}
      <Form layout="inline" onFinish={onFinish} form={form}>
        {/* 一个表单项，用于输入医院名称。`name` 属性是这个表单项的唯一标识。 */}
        <Form.Item name="hosname">
          {/* 文本输入框 */}
          <Input placeholder="点击输入医院名称" />
        </Form.Item>

        {/* 一个表单项，用于选择开始日期。 */}
        <Form.Item name="createTimeBegin">
          {/* 日期选择器组件 */}
          <DatePick placeholder="选择开始日期" />
        </Form.Item>

        {/* 一个表单项，用于选择截止日期。 */}
        <Form.Item name="createTimeEnd">
          <DatePick placeholder="选择截止日期" />
        </Form.Item>

        {/* 最后一个表单项，里面放一个按钮。 */}
        <Form.Item>
          {/*
            查询按钮。
            `type="primary"`: 设置为主要按钮样式。
            `htmlType="submit"`: 关键属性！将按钮的类型设置为 'submit'，点击它时会自动触发表单的 `onFinish` 事件。
            `icon={<SearchOutlined />}`: 在按钮中加入一个搜索图标。
            `style={{ marginRight: 10 }}`: 设置按钮的右边距为 10 像素，与其他元素隔开一点距离。
          */}
          <Button type="primary" htmlType="submit" icon={<SearchOutlined />} style={{ marginRight: 10 }}>
            查询
          </Button>
        </Form.Item>
      </Form>

      {/*
        这是用来显示图表的 `div` 元素。
        `ref={inputEl}`: 将我们之前创建的 `inputEl` 引用附加到这个 `div` 上。这样 ECharts 库就知道在哪里画图了。
        `style`: 设置这个 `div` 的样式。图表容器必须有明确的宽度和高度，否则图表无法正常显示。
      */}
      <div ref={inputEl} style={{ width: "80%", height: 400, marginTop: 30 }}></div>
    </Card>
  );
}

// 将 `StatisticsOrder` 组件导出，这样其他文件就可以导入和使用它了。
export default StatisticsOrder;
