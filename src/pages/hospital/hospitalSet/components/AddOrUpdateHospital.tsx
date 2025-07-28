// 导入 React 中的 'useEffect' hook。
// 'useEffect' 可以让你在函数组件中执行“副作用”操作，比如在组件加载后请求数据、设置订阅或手动操作DOM。
import { useEffect } from "react";
// 导入 antd 设计库中的组件。antd 是一个非常流行的 React UI 组件库，提供了丰富的预设组件。
// Card: 卡片组件，通常用于将相关内容分组显示在一个带边框的容器中。
// Form: 表单组件，用于收集、校验和提交用户输入的数据。
// Input: 输入框组件，用于接收用户输入的文本。
// Button: 按钮组件。
// message: 全局提示组件，用于向用户显示操作反馈，如成功、失败或警告信息。
import { Card, Form, Input, Button, message } from "antd";
// 导入 react-router-dom 库中的 hooks。react-router-dom 是 React 应用中用于处理路由的标准库。
// useNavigate: 一个 hook，它提供了一个函数，可以让你在代码中主动跳转到其他页面。
// useParams: 一个 hook，它能获取到当前 URL 中的动态参数。例如，如果路由路径是 /hospital/edit/:id，而实际 URL 是 /hospital/edit/123，useParams() 就会返回一个对象 { id: '123' }。
import { useNavigate, useParams } from "react-router-dom";

// 导入 API 请求函数。这些函数是预先封装好的，用于和后端服务器进行数据交互。
// reqAddHospital: 用于发送请求来“添加”一个新的医院设置。
// reqGetHospitalById: 用于发送请求来根据医院的 ID“获取”该医院的详细信息。
// reqUpdateHospital: 用于发送请求来“更新”一个已存在的医院设置。
import {
  reqAddHospital,
  reqGetHospitalById,
  reqUpdateHospital,
} from "@api/hospital/hospitalSet";
// 导入 TypeScript 的类型定义。在 TypeScript 项目中，为数据定义清晰的类型，可以增加代码的健壮性，减少错误，并提供更好的代码提示。
// AddHospitalParams: 这个类型定义了在添加新医院时，需要发送给后端的数据应该包含哪些字段以及它们的类型。
import { AddHospitalParams } from "@api/hospital/model/hospitalSetTypes";

// 定义并导出一个名为 'AddOrUpdateHospital' 的 React 函数组件。
// 这个组件的功能是“添加新的医院”或“修改已有的医院信息”。通过 URL 中是否带有 id 来区分这两种模式。
export default function AddOrUpdateHospital() {
  // 这部分被注释掉的代码，是早期可能使用 React 自带的 useState 来管理表单数据的一种尝试。
  // useState 是 React 的一个基础 hook，用于在组件中声明和管理状态。
  // 但对于复杂的表单，手动管理每个输入框的状态会比较繁琐，所以后来改用了 antd Form 自带的状态管理机制。
  // const [hospital, setHospital] = useState({
  //   hosname: "",
  //   hoscode: "",
  //   apiUrl: "",
  //   contactsPhone: "",
  //   contactsName: "",
  // });

  // 调用 antd 的 Form.useForm() hook 来创建一个表单的实例对象。
  // 这个 'form' 实例非常重要，它像一个遥控器，可以用来控制这个表单，比如读取表单数据、设置表单数据、手动触发校验等。
  const [form] = Form.useForm();

  // 调用 react-router-dom 的 'useParams' hook 来获取 URL 中的所有动态参数。
  // `params` 会是一个对象，包含了 URL 中所有匹配到的参数。
  const params = useParams();

  // 从 URL 参数对象中获取 'id'。
  // 'params.id' 从 URL 中取到的是一个字符串，我们使用一元加号 `+` 将它快速转换为数字类型。
  // 如果是“添加”模式，URL 中没有 id，那么 `params.id` 就是 undefined，`+undefined` 的结果是 NaN (Not-a-Number)。
  // `(params.id as string)` 是 TypeScript 的类型断言，是告诉编译器，我们开发者确定 `params.id` 在这里可以被当作字符串处理。
  const id = +(params.id as string);

  // 定义一个异步函数 'getHospitalById'，它的作用是根据 id 从服务器获取指定医院的详细信息。
  // 'async' 关键字表示这是一个异步函数，意味着函数内部可以使用 'await' 关键字来等待一个 Promise 完成。
  const getHospitalById = async () => {
    // 调用 API 函数 'reqGetHospitalById' 并传入 'id' 来请求数据。
    // 'await' 会暂停这个函数的执行，直到网络请求完成并返回数据，然后将数据赋值给 'hospital' 变量。
    const hospital = await reqGetHospitalById(id);
    // 这是一个被注释掉的调试代码，可以在浏览器控制台打印出获取到的医院数据，方便开发时确认数据是否正确。
    // console.log(hospital);
    // 这也是之前使用 useState 时用于更新组件状态的代码。
    // setHospital(hospital);
    // 使用 'form' 实例的 'setFieldsValue' 方法，将请求到的 'hospital' 数据对象，批量填充到表单的对应项中。
    // antd 的 Form 组件会智能地根据 'hospital' 对象的键名（key），去寻找 Form.Item 中 'name' 属性与之匹配的表单项，并填入对应的值。
    form.setFieldsValue(hospital);
  };

  // 使用 'useEffect' hook 来处理副作用，这里主要用于在组件加载时获取数据。
  // 'useEffect' 的第一个参数是一个函数，这个函数会在组件渲染到屏幕后执行。
  // 第二个参数 `[]` 是一个依赖数组，当数组为空时，表示这个 effect 只在组件第一次挂载时执行一次，类似于类组件中的 `componentDidMount`生命周期方法。
  useEffect(() => {
    // 判断 'id' 是否存在 (因为 `!NaN` 的结果是 `true`，所以这里能正确处理没有 id 的情况)。
    // 如果 'id' 不存在，说明当前是“添加医院”模式，就不需要从服务器获取数据，直接 `return` 结束这个 effect。
    if (!id) return;

    // 如果 'id' 存在，说明当前是“修改医院”模式，就需要调用 `getHospitalById` 函数来获取医院数据并填充表单。
    getHospitalById();
    // 依赖数组为空，保证这个 effect 只在组件初次渲染后执行一次。
  }, []);

  /*
    这是一个多行注释，用来向开发者说明：当提交表单时，发送给后端服务器的数据需要满足什么样的数据结构。
    这对于理解和调试 API 调用非常有帮助。
      {
        "apiUrl": "string", // API基础路径
        "contactsName": "string", // 联系人姓名
        "contactsPhone": "string", // 联系人电话
        "hoscode": "string", // 医院编号
        "hosname": "string", // 医院名称
        // "id": 0, // 医院的ID。在添加新医院时，这个id由服务器生成，我们不需要发送；在修改医院时，必须带上这个id，服务器才知道要修改哪一条记录。
      }
  */
  // 调用 'useNavigate' hook 来获取 'navigate' 函数。
  // 'navigate' 函数可以让我们在代码逻辑中（比如提交成功后）跳转到应用内的其他页面。
  const navigate = useNavigate();

  // 定义 'onFinish' 函数。这个函数会作为 antd Form 组件的 `onFinish` 属性的回调。
  // 当用户点击提交按钮，并且所有表单项都通过了校验规则后，Form 组件就会调用这个函数。
  // Form 组件会自动收集所有表单项的值，并作为一个对象 `values` 传给这个函数。
  // `values: AddHospitalParams` 表示我们期望 `values` 对象符合 `AddHospitalParams` 这个 TypeScript 类型。
  const onFinish = async (values: AddHospitalParams) => {
    // 通过判断 'id' 是否存在，来决定执行“修改”逻辑还是“添加”逻辑。
    if (id) {
      // 如果 'id' 存在，执行“修改医院”的逻辑。
      /*
        这里的 'values' 是 antd 的 Form 组件从表单中收集到的数据，它只包含我们定义的表单项（如 hosname, hoscode 等）。
        但是，调用更新接口时，后端需要我们明确告知要更新的是哪一条记录，所以必须把 'id' 也包含在请求数据中。
        因此，我们需要构造一个新的对象，它既包含表单的所有数据，也包含这个 'id'。
      */
      // 调用更新医院的 API 函数 'reqUpdateHospital'。
      await reqUpdateHospital({
        // 使用对象扩展运算符 `...`，它能把 `values` 对象里的所有属性和值，都复制到这个新的对象里。
        ...values,
        // 然后，我们再手动添加 `id` 属性。
        id,
      });
    } else {
      // 如果 'id' 不存在，执行“添加医院”的逻辑。
      // 直接调用添加医院的 API 函数 'reqAddHospital'，并把从表单收集到的 'values' 对象作为参数传进去。
      await reqAddHospital(values);
    }

    // 当上面的 API 请求成功完成后（因为有 await，所以会等请求结束），执行下面的代码。
    // 使用 antd 的 'message' 组件弹出一个全局的成功提示。
    // 这里用了一个三元运算符，根据 'id' 是否存在来动态地决定提示文本是“修改成功”还是“添加成功”。
    message.success(`${id ? "修改" : "添加"}医院成功`);
    // 调用 'goBack' 函数，在提示成功后，将页面跳转回医院设置列表页。
    goBack();
  };

  // 定义一个 'goBack' 函数，它的功能是返回到医院列表页面。
  const goBack = () => {
    // 使用从 `useNavigate` hook 得到的 `navigate` 函数来跳转页面。
    // 参数是目标页面的路径。
    navigate("/syt/hospital/hospitalSet");
  };

  // 这是组件的渲染部分，它返回 JSX (一种在 JavaScript 中写 HTML 的语法)。
  // 这部分代码描述了组件在页面上应该长什么样子。
  return (
    // 使用 'Card' 组件作为最外层的容器，它会给内容提供一个带标题和边框的卡片样式。
    <Card>
      {/* 
        这是 Ant Design 的 Form 组件。
        - labelCol: 用来统一设置表单项中“标签(label)”部分的布局。`{ span: 2 }` 表示标签占栅格系统24列中的2列。
        - wrapperCol: 用来统一设置表单项中“输入控件(wrapper)”部分的布局。`{ span: 22 }` 表示输入控件占22列。
        - onFinish: 这是最重要的属性之一。它接收一个函数（我们定义的 `onFinish`），在表单校验成功并提交时调用。
        - form: 将我们之前通过 `Form.useForm()` 创建的 `form` 实例和这个表单组件关联起来。这样，我们就能通过 `form` 实例来控制这个表单了。
      */}
      <Form
        labelCol={{ span: 2 }}
        wrapperCol={{ span: 22 }}
        onFinish={onFinish}
        form={form}
      >
        {/* 
          Form.Item 是一个表单项容器，它通常包裹一个标签（label）、一个输入控件（如Input），以及处理校验和错误信息显示。
          - label: 设置这个表单项的标签文字。
          - name: 这是表单项的唯一标识，非常重要。表单收集数据时，会用这个 `name` 作为键；用 `form.setFieldsValue` 设置数据时，也会根据这个 `name` 来查找对应的表单项。
          - rules: 设置这个表单项的校验规则，它是一个数组，意味着可以有多条规则。
            - { required: true, message: "..." }: 这是一条校验规则。
              - required: true 表示这个表单项是必填的，输入框前面会有一个红色的星号 `*` 提示。
              - message: '...' 是当这条规则校验失败时，要显示的错误提示信息。
            - 关于更多复杂的校验规则（如长度、类型等），可以查阅 antd 的官方文档。
        */}
        <Form.Item
          label="医院名称"
          name="hosname"
          rules={[{ required: true, message: "请输入医院名称!" }]}
        >
          {/* 在 Form.Item 内部放置一个 Input 组件，作为医院名称的输入框。 */}
          <Input />
        </Form.Item>

        <Form.Item
          label="医院编号"
          name="hoscode"
          rules={[{ required: true, message: "请输入医院编号!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="api基础路径"
          name="apiUrl"
          rules={[{ required: true, message: "请输入api基础路径!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="联系人姓名"
          name="contactsName"
          rules={[{ required: true, message: "请输入联系人姓名!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="联系人手机"
          name="contactsPhone"
          // 这条校验规则结合了“必填”和“格式验证”。
          // - required: true: 确保用户必须输入内容。
          // - pattern: /^1[3-9][0-9]{9}$/: 使用正则表达式来验证输入的内容是否符合特定格式。这个正则表达式是用来验证一个11位的中国大陆手机号码。
          // 当用户输入的内容不为空，但不匹配这个正则表达式时，也会提示 `message` 中的信息。
          rules={[
            {
              required: true,
              pattern: /^1[3-9][0-9]{9}$/,
              message: "请输入合法联系人手机号!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* 这个 Form.Item 没有 `label` 和 `name`，它只用于布局。 */}
        {/* `wrapperCol={{ offset: 2 }}` 表示这个表单项的输入控件部分，向右偏移2个栅格单位的宽度。这样做的目的是让下面的按钮和上面的输入框的左边缘对齐。 */}
        <Form.Item wrapperCol={{ offset: 2 }}>
          {/* 这是一个 antd 的 Button 组件。`type="primary"` 把它设置为“主要按钮”样式（通常是蓝色背景），用于引导用户执行主要操作。 */}
          {/* `htmlType="submit"` 是一个关键属性，它告诉浏览器这个按钮是一个表单的提交按钮。当点击它时，会触发表单的提交行为，进而触发 Form 组件的 `onFinish` 回调。 */}
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          {/* `className="ml"` 是给这个按钮添加一个CSS类名，这个类名（可能是 margin-left 的缩写）可能在某个CSS文件中定义了样式，比如 `margin-left: 10px;`，目的是让“保存”和“返回”两个按钮之间产生一些间距。 */}
          {/* `onClick={goBack}` 给这个按钮绑定了一个点击事件。当用户点击“返回”按钮时，就会调用我们之前定义的 `goBack` 函数，实现页面跳转。 */}
          <Button className="ml" onClick={goBack}>
            返回
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
