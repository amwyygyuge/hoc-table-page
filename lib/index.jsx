import React from 'react'
import { Form, Button, message } from 'igroot'
const { Item } = Form
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component'
}
/**
 * @param {}
 */
export default (
  {
    // 默认参数
    defaultParams = {},
    // 必填 请求函数
    queryData,
    // 默认页码
    defaultPageInfo = { current_page: 1, page_size: 30 },
    // 受控页码
    pagination = true
  }
) => WrappedComponent => {
  class TablePage extends WrappedComponent {
    static displayName = `TablePage(${getDisplayName(WrappedComponent)})`
    constructor() {
      super()
      this.state = {
        ...this.state,
        ...defaultPageInfo,
        dataSource: [],
        loading: false,
        defaultParams,
        total: 0
      }
    }
    componentDidMount() {
      super.componentDidMount && super.componentDidMount()
      // 第一次调用
      this.tablePageQueryData(defaultParams, this.state)
      const { setFieldsValue } = this.props.form
      // 初始化表单数据
      setFieldsValue(defaultParams)
    }


    _wrapSearchComponent = SearchComponent => {
      const searchComponentProps = this._assembleSearchComponentProps()
      const _SearchComponent = React.cloneElement(SearchComponent, searchComponentProps)
      return <Form key={`${TablePage.displayName}.Search`}>{_SearchComponent}</Form>
    }

    _wrapListComponent = ListComponent => {
      const listComponentProps = this._assembleListComponentProps()
      const _ListComponent = React.cloneElement(ListComponent, listComponentProps)
      return <div key={`${TablePage.displayName}.List`}>{_ListComponent}</div>
    }

    _assembleSearchComponentProps = () => {
      const { loading } = this.state
      return {
        handleSearch: this.handleSearch,
        handleReset: this.handleReset,
        renderButtons: this.renderButtons,
        loading,
        form: this.props.form,
        Item
      }
    }
    _assembleListComponentProps = () => {
      const { loading, dataSource, total } = this.state
      const tableProps = this._tableProps()
      return {
        loading,
        dataSource,
        total,
        handleReload: this.handleReload,
        tableProps,
        setDataSource: this._setDataSource
      }
    }

    _setDataSource = dataSource => {
      this.setState({ dataSource })
    }

    _tableProps = () => {
      const { loading, total, current_page, page_size, dataSource } = this.state
      const pageConfig = {
        current: current_page,
        pageSize: page_size,
        total,
        showTotal: total => `总条数 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '50', '100', '200'],
        onChange: this.handlePageChange,
        onShowSizeChange: this.handlePageChange,
      }
      return {
        loading,
        pagination: pagination ? pageConfig : null,
        rowKey: 'id',
        dataSource
      }
    }

    tablePageQueryData = (params, pageInfo, state) => {
      this.setState({ loading: true })
      const promise = queryData(params, pageInfo, state, res => {
        this.setState({ loading: false })
        if (res) {
          const { dataSource, total } = res
          this.setState({
            dataSource,
            total
          })
        } else {
          message.error('数据请求失败。')
        }
      })
      promise && promise.catch(err => this.setState({ loading: false }))
    }

    // 处理按钮渲染
    renderButtons = () => {
      const { loading } = this.state
      return <Item style={{ textAlign: 'right' }}>
        <Button
          style={{ marginRight: 10 }}
          type="primary"
          className="button"
          htmlType="submit"
          loading={loading}
          onClick={this.handleSearch}
        >
          搜索
        </Button>
        <Button className="button" onClick={this.handleReset} >
          重置
        </Button>
      </Item>
    }

    handlePageChange = (current_page, page_size) => {
      this.setState({ current_page, page_size })
      const { getFieldsValue } = this.props.form
      const params = getFieldsValue()
      const state = this.state
      this.tablePageQueryData(params, { current_page, page_size }, state)

    }

    // 搜索点击 重置条码条件
    handleSearch = e => {
      const { getFieldsValue } = this.props.form
      const [params, state] = [getFieldsValue(), this.state]
      this.setState({ ...defaultPageInfo })
      this.tablePageQueryData(params, defaultPageInfo, state)
    }

    // 重置点击 重置所有
    handleReset = () => {
      const { resetFields, setFieldsValue } = this.props.form
      resetFields()
      setFieldsValue(defaultParams)
      this.setState({
        current_page: 1,
        page_size: 30
      })
      const state = this.state
      this.tablePageQueryData(defaultParams, defaultPageInfo, state)
    }

    // 数据重载 保存所有条件
    handleReload = () => {
      const { getFieldsValue } = this.props.form
      const params = getFieldsValue()
      const state = this.state
      const { current_page, page_size } = state
      this.tablePageQueryData(params, { current_page, page_size }, state)
    }

    render() {
      const elementTree = super.render()
      const SearchComponent = elementTree.props.children[0]
      const ListComponent = elementTree.props.children[1]
      const _SearchComponent = this._wrapSearchComponent(SearchComponent)
      const _ListComponent = this._wrapListComponent(ListComponent)
      return React.cloneElement(
        elementTree,
        elementTree.props,
        [_SearchComponent, _ListComponent]
      )
    }
  }
  return Form.create()(TablePage)
}