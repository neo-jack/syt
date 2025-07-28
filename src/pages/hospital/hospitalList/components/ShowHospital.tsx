// 从 'antd' 这个UI组件库中，导入了三个组件：`Card`（卡片）、`Descriptions`（描述列表）和 `Button`（按钮）。
// 这些组件将用来构建页面的外观。
import { Card, Descriptions, Button } from "antd";
// 从 'react' 库中，导入了两个重要的功能（称为 Hooks）：`useState` 和 `useEffect`。
// `useState` 用于在组件中存储和管理数据（比如医院信息）。
// `useEffect` 用于处理一些额外的操作（比如当页面加载时去请求服务器获取数据）。
import { useEffect, useState } from "react";
// 从 'react-router-dom' 这个处理页面跳转的库中，导入了两个功能：`useParams` 和 `useNavigate`。
// `useParams` 用来获取网址（URL）中的参数（比如医院的唯一ID）。
// `useNavigate` 用来控制页面的跳转（比如点击“返回”按钮后回到上一个页面）。
import { useParams, useNavigate } from "react-router-dom";

// 从项目内部的 `@api/hospital/hospitalList` 文件中，导入一个名为 `reqGetHospitalById` 的函数。
// 这个函数的作用是向服务器发送请求，根据医院的ID来获取这家医院的详细信息。
import { reqGetHospitalById } from "@api/hospital/hospitalList";

import { HospitalDetail } from "@api/hospital/model/hospitalListTypes";

// 这里定义了一个名叫 `ShowHospital` 的组件。在React中，组件就像一个独立的、可复用的积木，用来构建用户界面。
// `export default` 表示这个组件是本文件的主要输出，可以被其他文件引用和使用。这个组件的功能就是显示单个医院的详细信息。
export default function ShowHospital() {
  // 调用 `useParams()` 函数，这个函数会返回一个对象，里面包含了当前网址（URL）中所有的动态参数。
  // 比如，如果网址是 `/hospital/123`，那么这个对象可能就是 `{ id: '123' }`。
  const params = useParams();
  // 从 `params` 对象中，取出名为 `id` 的属性值，并把它存到一个叫 `id` 的变量里。
  // 这个 `id` 就是我们要查询的医院的唯一标识。`as string` 是告诉程序，我们确定这个 `id` 是一个字符串（文本）类型。
  const id = params.id as string;

  // 这里使用了 `useState` 功能来创建一个“状态”。状态就像是组件内部的一个记忆存储区。
  // `hospital`：是用来存储医院详细信息的变量。
  // `setHospital`：是一个专门用来修改 `hospital` 变量的函数。我们不能直接修改 `hospital`，必须通过 `setHospital` 来更新它，这样React才能知道数据变了，需要重新渲染页面。
  // `<HospitalDetail>`：指定了 `hospital` 变量中存储的数据必须符合 `HospitalDetail` 这个类型模板。
  // `{...}`：这一大括号里的内容是 `hospital` 变量的初始值（默认值）。在从服务器拿到真实数据之前，页面会先使用这些空的数据，避免程序出错。
  const [hospital, setHospital] = useState<HospitalDetail>({
    // `bookingRule` 存储医院的预约规则信息
    bookingRule: {
      cycle: 0, // 预约周期（天）
      releaseTime: "", // 放号时间
      stopTime: "", // 停挂时间
      quitTime: "", // 退号时间
      rule: [], // 具体的预约规则文字描述，是一个数组
    },
    // `hospital` 存储医院的基本信息
    hospital: {
      hoscode: "", // 医院编码
      hosname: "", // 医院名称
      hostype: "", // 医院类型
      provinceCode: "", // 省份编码
      cityCode: "", // 城市编码
      districtCode: "", // 地区编码
      status: 1, // 医院状态（比如 0-未上线, 1-已上线）
      logoData: "", // 医院logo的图片数据，是Base64编码的字符串
      param: { // 额外信息
        hostypeString: "", // 医院类型的文字描述
        fullAddress: "", // 完整的地址
      },
      route: "", // 坐车路线
      intro: "", // 医院简介
    },
  });

  // 定义一个名为 `getHospitalById` 的函数。`async` 关键字表示这是一个“异步”函数，
  // 意味着它内部可以包含一些需要等待的操作（比如等待服务器返回数据）。这个函数的主要工作就是去获取医院的详细信息。
  const getHospitalById = async () => {
    // 调用我们之前导入的 `reqGetHospitalById` 函数，并把从网址中获取到的 `id` 作为参数传给它。
    // `await` 关键字表示“等待”，程序会在这里暂停，直到 `reqGetHospitalById` 函数成功从服务器拿到数据并返回结果。
    // 然后，把返回的医院数据存到 `hospital` 这个临时变量里。
    const hospital = await reqGetHospitalById(id);
    // 调用 `setHospital` 函数，把刚刚从服务器获取到的 `hospital` 数据更新到组件的状态中。
    // 一旦状态更新，React就会自动用新的数据显示在页面上。
    setHospital(hospital);
  };

  // 这里使用了 `useEffect` 功能。`useEffect` 里的代码会在组件第一次被渲染到屏幕上之后自动执行。
  useEffect(() => {
    // 在 `useEffect` 里面调用 `getHospitalById` 函数。这样就实现了“页面一加载，就自动去获取医院数据”的效果。
    getHospitalById();
    // `useEffect` 的第二个参数是一个空数组 `[]`。这个空数组非常重要，
    // 它告诉React：括号里的函数（即 `getHospitalById()`）只需要在组件第一次加载时执行一次，之后就不要再重复执行了。
  }, []);

  // 调用 `useNavigate()` 函数，它会返回一个专门用来控制页面跳转的函数，我们把它存到 `navigate` 这个变量里。
  const navigate = useNavigate();
  // 定义一个名为 `goBack` 的函数。这个函数的作用是处理“返回”按钮的点击事件。
  const goBack = () => {
    // 调用 `navigate` 函数，并告诉它要跳转到 `/syt/hospital/hospitalList` 这个路径（也就是医院列表页面）。
    navigate("/syt/hospital/hospitalList");
  };

  // `return` 关键字后面的括号里，是这个组件要渲染到页面上的内容。
  // 这部分内容是用一种叫做 JSX 的语法写的，它看起来很像 HTML。
  return (
    // 使用 `Card` 组件，它会把所有内容包裹在一个卡片样式的容器里，让界面看起来更整洁。
    <Card>
      {/*
        使用 `Descriptions` 组件来展示一组描述性的信息。
        `title="基本信息"`: 给这个描述列表设置一个标题，叫“基本信息”。
        `bordered`: 给列表添加边框，让它看起来更清晰。
        `column={4}`: 设置这个描述列表每行最多显示4个条目（`Descriptions.Item`）。
      */}
      <Descriptions title="基本信息" bordered column={4}>
        {/*
          这是描述列表中的一个条目（`Item`）。
          `label="医院名称"`: 设置这个条目的标签是“医院名称”。
          `span={2}`: 设置这个条目要占据2列的空间（因为我们设置了每行4列，所以这一项会占掉一半的宽度）。
          `labelStyle={{width: 200}}`: 这是一个行内样式，专门设置标签（label）的宽度为200像素，以确保对齐。
        */}
        <Descriptions.Item label="医院名称" span={2} labelStyle={{ width: 200 }}>
          {/* 在这里显示从 `hospital` 状态中获取到的医院名称（`hosname`）。花括号 `{}` 在 JSX 中用来嵌入 JavaScript 表达式或变量。 */}
          {hospital.hospital.hosname}
        </Descriptions.Item>
        {/* 这是显示医院logo的条目，同样占据2列。 */}
        <Descriptions.Item label="医院logo" span={2}>
          {/*
            使用 `<img>` 标签来显示图片。
            `style={{ width: 100, height: 100 }}`: 设置图片的宽度和高度都是100像素。
            `src`: 指定图片的来源。这里的数据是`Base64`格式，需要拼接一个固定的前缀 `data:image/jpeg;base64,` 才能被浏览器正确识别。
            `alt`: 当图片无法显示时，会显示的替代文本，这里是医院的名称。
          */}
          <img style={{ width: 100, height: 100 }} src={`data:image/jpeg;base64,${hospital.hospital.logoData}`} alt={hospital.hospital.hosname} />
        </Descriptions.Item>
        {/* 这是显示医院编码的条目，占据2列。 */}
        <Descriptions.Item label="医院编码" span={2}>
          {hospital.hospital.hoscode}
        </Descriptions.Item>
        {/* 这是显示医院地址的条目，占据2列。 */}
        <Descriptions.Item label="医院地址" span={2}>
          {hospital.hospital.param.fullAddress}
        </Descriptions.Item>
        {/* 这是显示坐车路线的条目，占据4列（整行）。 */}
        <Descriptions.Item label="坐车路线" span={4}>
          {hospital.hospital.route}
        </Descriptions.Item>
        {/* 这是显示医院简介的条目，占据4列（整行）。 */}
        <Descriptions.Item label="医院简介" span={4}>
          {hospital.hospital.intro}
        </Descriptions.Item>
      </Descriptions>

      {/*
        这是第二个 `Descriptions` 组件，用来显示预约规则信息。
        `className="mt"`: 给这个组件添加一个CSS类名 `mt`（通常是 margin-top 的缩写），用来增加它和上方内容的间距。
      */}
      <Descriptions title="预约规则信息" bordered column={4} className="mt">
        {/* 这是显示预约周期的条目，占据2列。 */}
        <Descriptions.Item label="预约周期" span={2}>
          {hospital.bookingRule.cycle}
        </Descriptions.Item>
        {/* 这是显示放号时间的条目，占据2列。 */}
        <Descriptions.Item label="放号时间" span={2}>
          {hospital.bookingRule.releaseTime}
        </Descriptions.Item>
        {/* 这是显示停挂时间的条目，占据2列。 */}
        <Descriptions.Item label="停挂时间" span={2}>
          {hospital.bookingRule.stopTime}
        </Descriptions.Item>
        {/* 这是显示退号时间的条目，占据2列。 */}
        <Descriptions.Item label="退号时间" span={2}>
          {hospital.bookingRule.quitTime}
        </Descriptions.Item>
        {/* 这是显示具体预约规则的条目，占据4列（整行）。 */}
        <Descriptions.Item label="预约规则" span={4}>
          {/*
            `hospital.bookingRule.rule` 是一个包含多条规则文本的数组。
            我们使用 `.map()` 方法来遍历这个数组里的每一条规则。
          */}
          {hospital.bookingRule.rule.map((rule, index) => {
            // `map` 方法要求为列表中的每一项提供一个唯一的 `key` 属性，这里我们暂时用数组的索引 `index` 作为key。
            // 返回一个 `div` 元素，里面显示规则的序号和内容。
            // `${index + 1}. ${rule}` 这种写法是模板字符串，可以方便地把变量和文本拼接在一起。
            return <div key={index}>{`${index + 1}. ${rule}`}</div>;
          })}
        </Descriptions.Item>
      </Descriptions>

      {/*
        这是一个“返回”按钮。
        `className="mt"`: 同样是给按钮添加一个向上的外边距。
        `onClick={goBack}`: 这是按钮的点击事件。当用户点击这个按钮时，就会调用我们之前定义的 `goBack` 函数，实现页面跳转。
      */}
      <Button className="mt" onClick={goBack}>
        返回
      </Button>
    </Card>
  );
}
