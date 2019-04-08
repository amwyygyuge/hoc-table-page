# 高阶列表页

## 场景
适用于绝大部分搜索列表页面，例如


## 优点
1. 规范组件化拆分思路
2. 代处理类场景的业务逻辑
3. 使用者只需关注不同业务的差异部分（搜索项、表格列头配置）
4. 低耦合，基于组件赋能思路，对UI没有任何改动。
5. 统一化场景的体验

## 手把手

首先默认大家都有用sl 安装过最新的前端模板，并且也懂得怎么配置页面路由，其他的就不多说，主要来讲讲这个场景类的高阶组件的用法，那我们先看一下项目目录
### 项目目录

简化一下，只保留我们需要的那部分	

```
.
├── apis
│   ├── customer      #api目录
│   │   ├── createFusion.js
│   │   ├── customerDomainInfo.js
│   │   ├── customerDomainList.js
│   │   ├── customerDomainSolutionViewList.js
│   │   ├── customerList.js
│   │   ├── deleteFusion.js
│   │   ├── fusionPage.js
│   │   ├── querySynTime.js
│   │   ├── realTimeDomain.js
│   │   ├── synTime.js
│   │   └── updateFusion.js
│   └── supplier
│       ├── createSupplier.js
│       ├── deleteSupplier.js
│       ├── supplierList.js
│       ├── supplierPage.js
│       └── updateSupplier.js
├── components       #组件存放的位置
│   └── TablePage
│       ├── README.md 
│       └── index.jsx # 列表高组件
├── pages
│   └── home
│       ├── App.jsx
│       ├── RelationConfigManage # 使用高阶组件的页面目录
│       │   ├── List
│       │   │   ├── index.jsx	# 表格组件
│       │   ├── Search.jsx	# 搜索栏组件
│       │   └── index.jsx	# 入口文件(容器组件)
│       ├── SupplierManage
│       │   ├── List
│       │   │   ├── SupplierEditModal.jsx
│       │   │   └── index.jsx
│       │   ├── Search.jsx
│       │   └── index.jsx
│       ├── index.html
│       ├── index.jsx
│       ├── index.scss
│       └── routerConfig.js
```

通过sl生成的最新模板后，找到pages下面的index，然后创建一个大写开头的文件夹，内部结构如下

```
│       ├── SupplierManage # 使用高阶组件的页面目录
│       │   ├── List
│       │   │   ├── index.jsx	# 表格组件
│       │   ├── Search.jsx	# 搜索栏组件
│       │   └── index.jsx	# 入口文件(容器组件)
```
现在创建完相对应的文件之后接着
### 搜索栏组件(Search.jsx)

直接贴代码

主要看这两部分代码

```react
import React, { Component } from 'react'
import { Row, Col, Input } from 'igroot'
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}
class Search extends Component {
  render() {
    // 组件接收到父级传入的 form 和Item 属性
    const { getFieldDecorator } = this.props.form
    const { Item } = this.props
    return <Row>
      <Col span={6}>
        <Item

          {...formItemLayout}
          label="厂商"
        >
          {
            getFieldDecorator('supplier_name')(
              <Input />
            )
          }
        </Item>
      </Col>
      <Col span={18}>
        // 组件接收到父级传入的 renderButtons 方法
        {this.props.renderButtons()}
      </Col>
    </Row>
  }
}
export { Search }
```

前面提到了思路是基于组件赋能，我们看得部分都是由父级组件提供给我们的方法和属性，我们只管调用就是了。其他部分的代码属于UI层面的，这一部分我们不管，每个业务都不一样。



### 表格组件（List.jsx）

先贴代码

然后还是看一下props部分

```jsx
import React, { Component } from 'react'
import { Row, Col, Table, Button, message, Popconfirm } from 'igroot'
import { deleteSupplier } from '@/apis/supplier/deleteSupplier'
export class List extends Component {
  state = {
    expandKeys: [],
    columns: [
      {
        title: '厂商',
        dataIndex: 'supplier_name',
        width: 150,
      },
      {
        title: '厂商英文名',
        dataIndex: 'supplier_ename',
        width: 150,
      },
      {
        title: '默认cname后缀',
        dataIndex: 'supplier_cname_suffix',
        width: 200,

      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
        width: 200,

      },
      {
        title: '备注',
        dataIndex: 'remark',
        width: 200

      },
      {
        title: '操作',
        dataIndex: 'handel',
        width: 80,
        render: (text, row) => <div style={{ textAlign: 'center' }}>
          <a style={{ marginRight: 8 }} onClick={() => this.edit(row)}>编辑</a>
          <Popconfirm title="确定删除？" onConfirm={() => this.del(row.id)}>
            <a>删除</a>
          </Popconfirm>
        </div>
      }
    ]
  }

  del = id => {
    if (this.delLoading) {
      return false
    }
    const loading = message.loading('删除中，请稍后....')
    deleteSupplier({ id: [id] }).then(res => {
      loading()
      this.delLoading = false
      if (res.data.deleteSupplier.result) {
        message.success('删除成功')
        // 组件接收到了父级的handleReload的方法
        this.props.handleReload()
      }
    })
  }



  render() {
    const { columns } = this.state
    return (
      <Row>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Button type="primary" onClick={() => this.Create()} style={{ marginRight: 8 }}>
            新增
          </Button>
        </Col>
        <Col span={24} style={{ marginTop: 8 }}>
          <Table
            columns={columns}
            // 组件接收到了父级的tableProps 的属性
            {...this.props.tableProps}
          />
        </Col>
      </Row>
    )
  }
}
```

表格组件也接收到了父级的方法和属性，你只需要知道具体提供了哪些，然后你需要在哪里用就好了。剩下的代码是UI层面和表格自己的一些业务逻辑，这部分差异性也比较大。

### 容器组件（index.jsx）

贴代码

```jsx
import React, { PureComponent } from 'react'
import { Card } from 'igroot'
import { Search } from './Search'
import { List } from './List/'
import TablePage from '@/components/TablePage/'
import { querySupplierPage } from '@/apis/supplier/supplierPage'
@TablePage({
  queryData: (params, pageInfo, state, cb) =>
    querySupplierPage({ ...params, ...pageInfo }).then(res => {
      if (res) {
        cb(
          {
            dataSource: res.data.supplierPage.supplier_list,
            total: res.data.supplierPage.pagination.total
          }
        )
      } else {
        cb(false)
      }
    })
})
export class SupplierManage extends PureComponent {
  render() {
    return (
      <Card bodyStyle={{ padding: 10 }} >
        <Search />
        <List />
      </Card>
    )
  }
}
```

这部分代码分为两个步骤，第一创建一个容器组件包装上面提到的两个组件 一个是Search 和List ，在这里我是使用Card组件，你也可以用div或者其他。

务必Search在上，List在下。

务必Search在上，List在下。

务必Search在上，List在下。

```jsx
export class SupplierManage extends PureComponent {
  render() {
    return (
      <Card bodyStyle={{ padding: 10 }} >
        <Search />
        <List />
      </Card>
    )
  }
}


```

创建完容器组件之后最后才会请出我们的高阶组件。

在这边做个简单介绍，其实所谓高阶组件就是一个函数，函数的入参是一些业务相关的配置和一个组件，函数根据对应的配置改造传入的组件赋予我们抽象出来的业务逻辑，返回一个新的组件。

下面是装饰器写法，

我传入的是一个对象里面有一个叫queryData的函数，这个函数用来请求列表数据，里面我只简单的写了一下入参的格式和请求成功后应该返回什么。之后这个函数应该在什么时候调用就不用我们操心了。

然后再传入对应的组件，完事。

```jsx
@TablePage({
  queryData: (params, pageInfo, state, cb) =>
    querySupplierPage({ ...params, ...pageInfo }).then(res => {
      if (res) {
        cb(
          {
            dataSource: res.data.supplierPage.supplier_list,
            total: res.data.supplierPage.pagination.total
          }
        )
      } else {
        cb(false)
      }
    })
})
export class SupplierManage extends PureComponent {
  render() {
    return (
      <Card bodyStyle={{ padding: 10 }} >
        <Search />
        <List />
      </Card>
    )
  }
}
```

不用装饰器的使用

```jsx
const config ={
  queryData: (params, pageInfo, state, cb) =>
    querySupplierPage({ ...params, ...pageInfo }).then(res => {
      if (res) {
        cb(
          {
            dataSource: res.data.supplierPage.supplier_list,
            total: res.data.supplierPage.pagination.total
          }
        )
      } else {
        cb(false)
      }
    })
}
class SupplierManage extends PureComponent {
  render() {
    return (
      <Card bodyStyle={{ padding: 10 }} >
        <Search />
        <List />
      </Card>
    )
  }
}

export default TablePage(config)(SupplierManage)
```



## 配置

| 参数名          | 类型     | 默认值                             | 描述             |
| --------------- | -------- | ---------------------------------- | ---------------- |
| defaultParams   | object   | {}                                 | 搜索栏的默认参数 |
| queryData       | function | 无/必填                            | 列表请求函数     |
| pagination      | boolean  | true                               | 是否页码前端受控 |
| defaultPageInfo | object   | { current_page: 1, page_size: 30 } | 页面的默认页码   |

### queryData 接受的参数

| 参数名   | 类型     | 描述                                                         |
| -------- | -------- | ------------------------------------------------------------ |
| params   | object   | 表单数据                                                     |
| pageInfo | object   | 分页信息，避免后端不同字段，可以自行组装                     |
| state    | object   | 组件的state                                                  |
| cb       | function | 请求结果的回调函数，如果请求成功返回 {total,dataSource} 格式的回填数据，如果请求失败返回false |


#### Search继承的props

| 参数名        | 类型       | 描述                                                 |
| ------------- | ---------- | ---------------------------------------------------- |
| handleSearch  | function   | 列表搜索函数                                         |
| handleReset   | function   | 列表重置函数                                         |
| renderButtons | function   | 返回按钮组，如果不想自己绑定函数，可以直接调用此函数 |
| loading       | boolean    | 数据加载状态                                         |
| form          | object     | form对象                                             |
| Item          | ReactClass | 表单的Item组件                                       |

#### List继承的props


| 参数名        | 类型     | 描述                         |
| ------------- | -------- | ---------------------------- |
| handleReload  | function | 列表变更后的数据重新请求函数 |
| setDataSoruce | function | 设置DataSoruce的函数         |
| dataSource    | Array    | 列表数据                     |
| loading       | boolean  | 数据加载状态                 |
| total         | number   | 总条数                       |
| tableProps    | object   | 分配给table的props           |

### tableProps

| 参数名     | 类型    | 描述         |
| ---------- | ------- | ------------ |
| loading    | boolean | 数据加载状态 |
| pagination | object  | 受控分页配置 |
| rowKey     | string  | 默认为 id    |
| dataSource | Array   | 列表数据     |

