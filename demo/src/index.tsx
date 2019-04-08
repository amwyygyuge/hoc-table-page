import * as React from 'react'
import { Card } from 'igroot'
import { Search } from './Search'
import { List } from './List'
import TablePage from '../../dist'
import { FormComponentProps } from 'antd/lib/form'

import './index.less'
const getUserList = () =>
	fetch('http://119.29.134.187:8000/user/query', {
		method: 'get'
	}).then(res => res.json())
interface FormProps extends FormComponentProps {
	[propName: string]: any
}
class TableHocPage extends React.PureComponent<FormProps> {
	render() {
		return (
			<Card bodyStyle={{ padding: 10 }}>
				<Search />
				<List />
			</Card>
		)
	}
}

export default TablePage({
	// 默认搜索参数 默认 {}
	defaultParams: {},
	// 是否前端受控分页 默认 true
	pagination: true,
	// 默认页码  默认 { current_page: 1, page_size: 30 }
	defaultPageInfo: { current_page: 1, page_size: 30 },
	// 列表请求函数
	queryData: (params, pageInfo, state, cb) => {
		return getUserList().then(res => {
			if (res) {
				cb({
					// dataSource: res.data.supplierPage.supplier_list,
					dataSource: res,
					total: res.total || 10
				})
			} else {
				cb(false)
			}
		})
	}
})(TableHocPage)
