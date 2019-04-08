import * as React from 'react'
import { Row, Col, Table } from 'igroot'
interface Iprops {
	[propName: string]: any
}

export class List extends React.Component<Iprops> {
	state = {
		expandKeys: [],
		columns: [
			{
				title: '中文名',
				dataIndex: 'cname',
				width: 150
			},
			{
				title: 'email',
				dataIndex: 'email',
				width: 150
			},
			{
				title: 'node版本',
				dataIndex: 'node',
				width: 200
			},
			{
				title: '创建时间',
				dataIndex: 'createdAt',
				width: 200
			},
			{
				title: 'sl版本',
				dataIndex: 'sl.version',
				width: 200
			},
			{
				title: '操作',
				dataIndex: 'handel',
				width: 80,
				render: (text: string, row: {}) => <div style={{ textAlign: 'center' }} />
			}
		]
	}

	render() {
		const { columns } = this.state
		return (
			<Row>
				<Col span={24} style={{ textAlign: 'right' }} />
				<Col span={24} style={{ marginTop: 8 }}>
					<Table columns={columns} {...this.props.tableProps} />
				</Col>
			</Row>
		)
	}
}
