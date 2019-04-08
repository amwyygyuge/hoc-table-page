import * as React from 'react'
import { Row, Col, Input } from 'igroot'
const formItemLayout = {
	labelCol: { span: 6 },
	wrapperCol: { span: 18 }
}
interface Iprops {
	[propName: string]: any
}
class Search extends React.Component<Iprops> {
	render() {
		const { getFieldDecorator } = this.props.form
		const { Item, renderButtons } = this.props
		return (
			<Row>
				<Col span={6}>
					<Item {...formItemLayout} label='厂商'>
						{getFieldDecorator('supplier_name')(<Input />)}
					</Item>
				</Col>
				<Col span={18}>{renderButtons()}</Col>
			</Row>
		)
	}
}
export { Search }
