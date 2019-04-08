import * as React from 'react'
import { Form, Button, message } from 'igroot'
import { FormComponentProps } from 'antd/lib/form'
const { Item } = Form
function getDisplayName(WrappedComponent: React.ComponentClass<FormProps>) {
	return WrappedComponent.displayName || 'Component'
}
interface PageInfo {
	current_page: number
	page_size: number
}
type dataSource = {}[]
interface callBackRes {
	dataSource: dataSource
	total?: number
}
interface callBack {
	(res: callBackRes | boolean): void
}
interface queryData {
	(params: any, pageInfo: PageInfo, state: any, callBack: callBack): Promise<void>
}
interface TablePageParams {
	defaultParams?: {}
	queryData: queryData
	defaultPageInfo: PageInfo
	pagination: boolean
}
interface HocComponent {
	(WrappedComponent: React.ComponentClass<FormProps>): any
}
interface HocTablePage {
	(TablePageParams: TablePageParams): HocComponent
}
interface FormProps extends FormComponentProps {
	[propName: string]: any
}
const HocTablePage: HocTablePage = (
	TablePageParams: TablePageParams = {
		defaultParams: {},
		pagination: true,
		defaultPageInfo: {
			current_page: 1,
			page_size: 30
		},
		queryData: (params, pageInfo, state, callback) => Promise.resolve()
	}
) => (WrappedComponent: React.ComponentClass<FormProps>) => {
	class TablePage extends WrappedComponent {
		static displayName = `TablePage(${getDisplayName(WrappedComponent)})`
		public constructor(props: any) {
			super(props)
			const { defaultPageInfo, defaultParams } = TablePageParams
			this.state = {
				...this.state,
				...defaultPageInfo,
				dataSource: [],
				loading: false,
				defaultParams,
				total: 0
			}
		}
		public componentDidMount() {
			super.componentDidMount && super.componentDidMount()
			// 第一次调用
			this.tablePageQueryData(TablePageParams.defaultParams, TablePageParams.defaultPageInfo, this.state)
			const { setFieldsValue } = this.props.form
			// 初始化表单数据
			setFieldsValue(TablePageParams.defaultParams || {})
		}

		private _wrapSearchComponent = (SearchComponent: JSX.Element) => {
			const searchComponentProps = this._assembleSearchComponentProps()
			const _SearchComponent = React.cloneElement(SearchComponent, searchComponentProps)
			return <Form key={`${TablePage.displayName}.Search`}> {_SearchComponent} </Form>
		}

		private _assembleSearchComponentProps = () => {
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

		private _wrapListComponent = (ListComponent: React.ReactElement) => {
			const listComponentProps = this._assembleListComponentProps()
			const _ListComponent = React.cloneElement(ListComponent, listComponentProps)
			return <div key={`${TablePage.displayName}.List`}>{_ListComponent}</div>
		}

		private _assembleListComponentProps = () => {
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

		_tableProps = () => {
			const { loading, total, current_page, page_size, dataSource } = this.state
			const pageConfig = {
				current: current_page,
				pageSize: page_size,
				total,
				showTotal: (total: number) => `总条数 ${total} 条`,
				showSizeChanger: true,
				pageSizeOptions: [ '10', '20', '30', '50', '100', '200' ],
				onChange: this.handlePageChange,
				onShowSizeChange: this.handlePageChange
			}
			return {
				loading,
				pagination: TablePageParams.pagination ? pageConfig : null,
				rowKey: 'id',
				dataSource
			}
		}

		// 处理按钮渲染
		public renderButtons = () => {
			const { loading } = this.state
			return (
				<Item style={{ textAlign: 'right' }}>
					<Button
						style={{ marginRight: 10 }}
						type='primary'
						className='button'
						htmlType='submit'
						loading={loading}
						onClick={this.handleSearch}
					>
						搜索
					</Button>
					<Button className='button' onClick={this.handleReset}>
						重置
					</Button>
				</Item>
			)
		}

		private _setDataSource = (dataSource: dataSource) => {
			this.setState({ dataSource })
		}

		public handlePageChange = (pageInfo: PageInfo) => {
			const { current_page, page_size } = pageInfo
			const cb = () => this.setState({ current_page, page_size })
			const { getFieldsValue } = this.props.form
			const params = getFieldsValue()
			const state = this.state
			this.tablePageQueryData(params, { current_page, page_size }, state, cb)
		}

		// 搜索点击 重置页码条件
		public handleSearch: React.MouseEventHandler<HTMLButtonElement> = e => {
			const { getFieldsValue } = this.props.form
			const params = getFieldsValue()
			this.executeSearch(params)
		}

		// 重置点击 重置所有
		public handleReset = () => {
			const { resetFields, setFieldsValue } = this.props.form
			resetFields()
			setFieldsValue(TablePageParams.defaultParams || {})
			this.executeSearch(TablePageParams.defaultParams)
		}

		// 解析页码，并执行搜索
		public executeSearch = (params: {} | undefined) => {
			const { current_page } = TablePageParams.defaultPageInfo
			const { page_size } = this.state
			this.setState({ current_page })
			const state = this.state
			this.tablePageQueryData(params, { current_page, page_size }, state)
		}

		// 数据重载 保存所有条件
		public handleReload = () => {
			const { getFieldsValue } = this.props.form
			const params = getFieldsValue()
			const state = this.state
			const { current_page, page_size } = state
			this.tablePageQueryData(params, { current_page, page_size }, state)
		}

		public tablePageQueryData = (params: {} | undefined, pageInfo: PageInfo, state: {}, cb?: () => void) => {
			this.setState({ loading: true })
			const promise = TablePageParams.queryData(params, pageInfo, state, callback => {
				this.setState({ loading: false })
				if (callback) {
					const { dataSource, total } = callback as callBackRes
					cb && cb()
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
		render() {
			const elementTree: any = super.render()
			const [ SearchComponent, ListComponent ] = elementTree.props.children as any[]
			const _SearchComponent = this._wrapSearchComponent(SearchComponent)
			const _ListComponent = this._wrapListComponent(ListComponent)
			return React.cloneElement(elementTree as any, elementTree.props, [ _SearchComponent, _ListComponent ])
		}
	}
	return Form.create<FormComponentProps>()(TablePage)
}

export default HocTablePage
