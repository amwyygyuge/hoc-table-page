# 高阶列表页

## 配置

1. defaultParams  {object}  页面的默认参数

2. queryData {function} 列表请求函数，必填！以下是函数接受的参数

   1. params {object} 表单数据
   2. pageInfo {object} 分页信息，避免后端不同字段，可以自行组装
   3. state {object} 组件的state
   4. cb {function} 请求结果的回调函数，用true和false来传递成功和失败


3. pagination {boolean} 是否页码前端受控

4. defaultPageInfo {object} 页面的默认页码

   1. current_page  {number} 当前页码

   2. page_size {number} 每页显示条数

        

## 模块拆分于赋能

高阶列表赋能必须按照 Page 、Search 、List 三个组件划分。

Page 包裹 Search和List，高阶列表组件仅在Page引用即可。具体使用方式如下

### Page

```jsx
import React, { PureComponent } from 'react'
import { Card } from 'igroot'
import { Search } from './Search'
import { List } from './List/'
import TablePage from '@/components/TablePage/'
import { querySupplierPage } from '@/apis/supplier/supplierPage'
@TablePage({
  queryData: (params, pageInfo, state, cb) => {
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

必须按照 一个<div>包裹<Search />和<List />的格式，并且<Search />在上<List />在下。

### Search

#### 组件赋能的props

1. handleSearch {function}  列表搜索函数
2. handleReset {function} 列表重置函数
3. renderButtons {function} 返回按钮组，如果不想自己绑定函数，可以直接调用此函数
4. loading {boolean} 加载状态
5. form {object} form对象

```jsx
import React, { Component } from 'react'
import { Form, Row, Col, Input } from 'igroot'
const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

class Search extends Component {
  render() {
    const { getFieldDecorator } = this.props.form
    return <Row>
      <Col span={6}>
        <FormItem

          {...formItemLayout}
          label="厂商"
        >
          {
            getFieldDecorator('supplier_name')(
              <Input />
            )
          }
        </FormItem>
      </Col>
      <Col span={18}>
        {this.props.renderButtons()}
      </Col>
    </Row>
  }
}
export { Search }
```

### List

#### 组件赋能的props

1. loading {boolean} 加载状态
2. dataSource {Array} 列表数据
3. total {number} 总条数
4. handleReload {function} 列表变更后的数据重新请求函数
5. setDataSoruce  {function} 设置DataSoruce的函数
6. tableProps {object} 分配给table的props
   1. loading {boolean} 加载状态
   2. pagination {object} 受控分页配置
   3. rowKey {string} 默认为 id
   4. dataSource  {Array} 列表数据

```jsx
import React, { Component } from 'react'
import { Row, Col, Table, Button, message, Popconfirm } from 'igroot'
import { deleteSupplier } from '@/apis/supplier/deleteSupplier'
import SupplierEditModal from './SupplierEditModal'
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
        this.props.handleReload()
      }
    })
  }

  edit = row => {
    this.Update(row)
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
            {...this.props.tableProps}
          />
        </Col>
        <SupplierEditModal
          getCreateFunction={fun => this.Create = fun}
          getUpdateFunction={fun => this.Update = fun}
          reload={this.props.handleReload}
        />
      </Row>
    )
  }
}
```

