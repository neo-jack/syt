// 从 "react" 库中导入 useEffect 和 useState 这两个核心的 Hook。
// useEffect 用于处理组件的副作用，比如在组件加载后请求数据。
// useState 用于在函数组件中添加和管理状态（state），比如存储从服务器获取的数据。
import { useEffect, useState } from "react";
// 从 "antd" UI 库中导入 Card 和 Table 组件。
// Card 用于创建一个卡片式容器，让页面布局更美观。
// Table 用于显示结构化的数据列表。
import { Card, Table } from "antd";
// 从 antd 的表格组件库中导入 ColumnsType 类型。
// 这是一个 TypeScript 类型，用于定义表格的列配置，能提供代码提示和类型检查，让代码更健壮。
import type { ColumnsType } from "antd/lib/table";

// 从 antd 的图标库中导入 RightOutlined（向右的箭头）和 DownOutlined（向下的箭头）图标。
// 这两个图标将用于表示表格行的展开和折叠状态。
import { RightOutlined, DownOutlined } from "@ant-design/icons";

// 导入封装好的 API 请求函数和相关的 TypeScript 类型。
// reqGetCityList 是一个函数，用于根据父级 ID 获取数据字典（或城市列表）的数据。
import { reqGetCityList } from "@api/hospital/hospitalList";
// CityList 是整个数据列表的类型。
// CityItem 是列表中单条数据的类型。
import { CityList, CityItem } from "@api/hospital/model/hospitalListTypes";

// 定义表格的列（columns）配置。这是一个数组，数组中的每个对象代表一列。
const columns: ColumnsType<CityItem> = [
  {
    title: "名称", // 列的标题。
    dataIndex: "name", // 指定这一列显示的数据来源于数据源中每条记录的 `name` 属性。
  },
  {
    title: "编码",
    dataIndex: "dictCode", // 指定显示 `dictCode` 属性。
  },
  {
    title: "值",
    dataIndex: "value", // 指定显示 `value` 属性。
  },
  {
    title: "创建时间",
    dataIndex: "createTime", // 指定显示 `createTime` 属性。
  },
];

// 定义并导出一个名为 Dict 的函数组件。
// `export default` 表示这是模块的默认导出。
export default function Dict() {
  // 使用 useState 创建一个状态 `dictList`，用于存储表格要显示的数据。
  // `setDictList` 是一个函数，用于更新 `dictList` 的值。
  // `useState<CityList>([])` 表示初始值是一个空数组，并且这个状态的类型是 `CityList`。
  const [dictList, setDictList] = useState<CityList>([]);

  // 定义一个异步函数 `getCityList`，用于获取第一层级的数据。
  const getCityList = async (id: number) => {
    // 调用 API 函数 `reqGetCityList`，传入 id=1 来获取根节点下的数据。
    // `await` 会等待网络请求完成，并将结果赋值给 `dictList` 变量。
    const dictList = await reqGetCityList(id);

    // 调用 `setDictList` 来更新组件的状态。
    // 在更新之前，使用 `map` 方法遍历获取到的每一个数据项 `item`。
    setDictList(
      dictList.map((item) => {
        // 返回一个新的对象，这个对象包含了原始 item 的所有属性（使用扩展运算符 `...item`）。
        return {
          ...item,
          // 额外添加一个 `children` 属性，并设置为空数组 `[]`。
          // 这是告诉 antd 的 Table 组件：这一行数据是可展开的，即使现在还没有子数据。
          // Table 组件看到 `children` 属性后，会自动在该行前面显示一个可展开的图标。
          children: [],
        };
      })
    );
  };

  // 使用 useEffect Hook，在组件第一次渲染到屏幕后执行。
  // 第二个参数是空数组 `[]`，表示这个 effect 只会执行一次，类似于类组件的 `componentDidMount`。
  useEffect(() => {
    // 调用 `getCityList` 函数，并传入 `1` 作为参数，获取顶层数据。
    // 在这个项目中，id 为 1 通常代表数据字典的根节点。
    getCityList(1);
  }, []);

  // 定义一个类型别名，用于描述 antd 表格展开事件处理函数的类型。
  type TriggerEventHandler<T> = (record: T, event: React.MouseEvent<HTMLElement>) => void;
  
  // 定义一个高阶函数 `handleIconExpand`，用于处理点击“展开”图标的事件，实现懒加载。
  // 它接收当前行的数据 `record` 和 antd Table 提供的 `onExpand` 函数作为参数。
  const handleIconExpand = (record: CityItem, onExpand: TriggerEventHandler<CityItem>) => {
    // 这个函数会返回另一个函数，返回的这个函数才是最终的 `onClick` 事件处理器。
    return async (e: React.MouseEvent<HTMLElement>) => {
      // 检查当前行的 `children` 数组是否为空。如果不为空，说明子数据已经加载过了，就没必要重新请求。
      if (!record.children.length) {
        // 如果子数据为空，说明是第一次展开，需要发送请求去获取子数据。
        // 使用当前行的 `id` 作为参数，去获取它的下一级列表。
        let list = await reqGetCityList(record.id);

        // 遍历新获取的子列表 `list`。
        list = list.map((item) => {
          // 检查每个子项 `item` 是否自己也拥有子节点（由 `hasChildren` 属性判断）。
          return item.hasChildren
            ? // 如果它也有子节点，那么同样给它添加一个空的 `children` 数组，为下一次展开做准备。
              {
                ...item,
                children: [],
              }
            : // 如果它没有子节点，就直接返回它本身。
              item;
        });

        // 这是关键的一步：将获取到的子列表数据 `list` 赋值给当前行 `record` 的 `children` 属性。
        // 注意：这里是直接修改了 `record` 对象。在 antd 的树形表格懒加载场景中，这是一种常见且有效的做法。
        record.children = list;
      }
      // 不论是否请求了新数据，最后都必须调用 antd 提供的 `onExpand` 函数。
      // 这个函数会通知 Table 组件更新界面，从而展开或折叠对应的行。
      onExpand(record, e);
    };
  };

  // 组件的 `return` 语句定义了要渲染到屏幕上的 JSX 结构。
  return (
    <Card>
      {/* 使用 Table 组件来展示数据 */}
      <Table
        columns={columns} // `columns` 属性：指定表格的列配置。
        dataSource={dictList} // `dataSource` 属性：指定表格的数据源，即我们用 useState 管理的 `dictList`。
        bordered // `bordered` 属性：给表格添加边框。
        rowKey="id" // `rowKey` 属性：指定数据记录中 `id` 字段作为每一行的唯一标识（key）。这对于 React 高效更新 DOM 至关重要。
        pagination={false} // `pagination` 属性：设置为 `false` 来禁用分页功能，因为树形结构通常不使用分页。
        expandable={{ // `expandable` 属性：用于配置可展开行的相关功能。
          // `expandIcon` 是一个自定义渲染展开/折叠图标的函数。
          expandIcon: ({ expanded, record, onExpand }) => {
            /*
              `expanded`: 一个布尔值，表示当前行是否已经展开。
              `record`: 当前行的数据对象。
              `onExpand`: 一个函数，调用它可以触发展开或折叠操作。
            */
            // 如果当前行的数据表明它没有子节点（`!record.hasChildren`），
            if (!record.hasChildren) {
              // 则不渲染任何图标，只渲染一个占位用的 div，以保证对齐。
              return <div style={{ display: "inline-block", width: 24, height: 10 }}></div>;
            }

            // 如果当前行是展开状态 (`expanded` 为 true),
            return expanded ? (
              // 就渲染一个向下的箭头图标。点击这个图标会折叠该行。
              // `onClick` 事件直接调用 `onExpand` 函数来触发折叠。
              <DownOutlined style={{ marginRight: 10 }} onClick={(e) => onExpand(record, e)} />
            ) : (
              // 如果当前行是折叠状态 (`expanded` 为 false),
              // 就渲染一个向右的箭头图标。点击这个图标需要展开该行并加载子数据。
              // `onClick` 事件调用我们自己封装的 `handleIconExpand` 函数，来实现懒加载逻辑。
              <RightOutlined style={{ marginRight: 10 }} onClick={handleIconExpand(record, onExpand)} />
            );
          },
        }}
      />
    </Card>
  );
}
