'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _button = require('igroot/lib/button');

var _button2 = _interopRequireDefault(_button);

var _message2 = require('igroot/lib/message');

var _message3 = _interopRequireDefault(_message2);

var _form = require('igroot/lib/form');

var _form2 = _interopRequireDefault(_form);

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

require('igroot/lib/button/style');

require('igroot/lib/message/style');

require('igroot/lib/form/style');

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Item = _form2.default.Item;

function getDisplayName(WrappedComponent) {
	return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
/**
 * @param {}
 */

exports.default = function (_ref) {
	var _ref$defaultParams = _ref.defaultParams,
	    defaultParams = _ref$defaultParams === undefined ? {} : _ref$defaultParams,
	    queryData = _ref.queryData,
	    _ref$defaultPageInfo = _ref.defaultPageInfo,
	    defaultPageInfo = _ref$defaultPageInfo === undefined ? { current_page: 1, page_size: 30 } : _ref$defaultPageInfo,
	    _ref$pagination = _ref.pagination,
	    pagination = _ref$pagination === undefined ? true : _ref$pagination;
	return function (WrappedComponent) {
		var TablePage = function (_WrappedComponent) {
			_inherits(TablePage, _WrappedComponent);

			function TablePage() {
				_classCallCheck(this, TablePage);

				var _this = _possibleConstructorReturn(this, (TablePage.__proto__ || Object.getPrototypeOf(TablePage)).call(this));

				_this._wrapSearchComponent = function (SearchComponent) {
					var searchComponentProps = _this._assembleSearchComponentProps();
					var _SearchComponent = _react2.default.cloneElement(SearchComponent, searchComponentProps);
					return _react2.default.createElement(
						_form2.default,
						{ key: TablePage.displayName + '.Search' },
						_SearchComponent
					);
				};

				_this._wrapListComponent = function (ListComponent) {
					var listComponentProps = _this._assembleListComponentProps();
					var _ListComponent = _react2.default.cloneElement(ListComponent, listComponentProps);
					return _react2.default.createElement(
						'div',
						{ key: TablePage.displayName + '.List' },
						_ListComponent
					);
				};

				_this._assembleSearchComponentProps = function () {
					var loading = _this.state.loading;

					return {
						handleSearch: _this.handleSearch,
						handleReset: _this.handleReset,
						renderButtons: _this.renderButtons,
						loading: loading,
						form: _this.props.form,
						Item: Item
					};
				};

				_this._assembleListComponentProps = function () {
					var _this$state = _this.state,
					    loading = _this$state.loading,
					    dataSource = _this$state.dataSource,
					    total = _this$state.total;

					var tableProps = _this._tableProps();
					return {
						loading: loading,
						dataSource: dataSource,
						total: total,
						handleReload: _this.handleReload,
						tableProps: tableProps,
						setDataSource: _this._setDataSource
					};
				};

				_this._setDataSource = function (dataSource) {
					_this.setState({ dataSource: dataSource });
				};

				_this._tableProps = function () {
					var _this$state2 = _this.state,
					    loading = _this$state2.loading,
					    total = _this$state2.total,
					    current_page = _this$state2.current_page,
					    page_size = _this$state2.page_size,
					    dataSource = _this$state2.dataSource;

					var pageConfig = {
						current: current_page,
						pageSize: page_size,
						total: total,
						showTotal: function showTotal(total) {
							return '\u603B\u6761\u6570 ' + total + ' \u6761';
						},
						showSizeChanger: true,
						pageSizeOptions: ['10', '20', '30', '50', '100', '200'],
						onChange: _this.handlePageChange,
						onShowSizeChange: _this.handlePageChange
					};
					return {
						loading: loading,
						pagination: pagination ? pageConfig : null,
						rowKey: 'id',
						dataSource: dataSource
					};
				};

				_this.tablePageQueryData = function (params, pageInfo, state, cb) {
					_this.setState({ loading: true });
					var promise = queryData(params, pageInfo, state, function (res) {
						_this.setState({ loading: false });
						if (res) {
							var dataSource = res.dataSource,
							    total = res.total;

							cb && cb();
							_this.setState({
								dataSource: dataSource,
								total: total
							});
						} else {
							_message3.default.error('数据请求失败。');
						}
					});
					promise && promise.catch(function (err) {
						return _this.setState({ loading: false });
					});
				};

				_this.renderButtons = function () {
					var loading = _this.state.loading;

					return _react2.default.createElement(
						Item,
						{ style: { textAlign: 'right' } },
						_react2.default.createElement(
							_button2.default,
							{
								style: { marginRight: 10 },
								type: 'primary',
								className: 'button',
								htmlType: 'submit',
								loading: loading,
								onClick: _this.handleSearch
							},
							'\u641C\u7D22'
						),
						_react2.default.createElement(
							_button2.default,
							{ className: 'button', onClick: _this.handleReset },
							'\u91CD\u7F6E'
						)
					);
				};

				_this.handlePageChange = function (current_page, page_size) {
					var cb = function cb() {
						return _this.setState({ current_page: current_page, page_size: page_size });
					};
					var getFieldsValue = _this.props.form.getFieldsValue;

					var params = getFieldsValue();
					var state = _this.state;
					_this.tablePageQueryData(params, { current_page: current_page, page_size: page_size }, state, cb);
				};

				_this.handleSearch = function (e) {
					var getFieldsValue = _this.props.form.getFieldsValue;

					var params = getFieldsValue();
					_this.excuteSearch(params);
				};

				_this.handleReset = function () {
					var _this$props$form = _this.props.form,
					    resetFields = _this$props$form.resetFields,
					    setFieldsValue = _this$props$form.setFieldsValue;

					resetFields();
					setFieldsValue(defaultParams);
					_this.excuteSearch(defaultParams);
				};

				_this.excuteSearch = function (params) {
					var current_page = defaultPageInfo.current_page;
					var page_size = _this.state.page_size;

					_this.setState({ current_page: current_page });
					var state = _this.state;
					_this.tablePageQueryData(params, { current_page: current_page, page_size: page_size }, state);
				};

				_this.handleReload = function () {
					var getFieldsValue = _this.props.form.getFieldsValue;

					var params = getFieldsValue();
					var state = _this.state;
					var current_page = state.current_page,
					    page_size = state.page_size;

					_this.tablePageQueryData(params, { current_page: current_page, page_size: page_size }, state);
				};

				_this.state = _extends({}, _this.state, defaultPageInfo, {
					dataSource: [],
					loading: false,
					defaultParams: defaultParams,
					total: 0
				});
				return _this;
			}

			_createClass(TablePage, [{
				key: 'componentDidMount',
				value: function componentDidMount() {
					_get(TablePage.prototype.__proto__ || Object.getPrototypeOf(TablePage.prototype), 'componentDidMount', this) && _get(TablePage.prototype.__proto__ || Object.getPrototypeOf(TablePage.prototype), 'componentDidMount', this).call(this);
					// 第一次调用
					this.tablePageQueryData(defaultParams, this.state);
					var setFieldsValue = this.props.form.setFieldsValue;
					// 初始化表单数据

					setFieldsValue(defaultParams);
				}

				// 处理按钮渲染


				// 搜索点击 重置页码条件


				// 重置点击 重置所有


				// 解析页码，并执行搜索


				// 数据重载 保存所有条件

			}, {
				key: 'render',
				value: function render() {
					var elementTree = _get(TablePage.prototype.__proto__ || Object.getPrototypeOf(TablePage.prototype), 'render', this).call(this);
					var SearchComponent = elementTree.props.children[0];
					var ListComponent = elementTree.props.children[1];
					var _SearchComponent = this._wrapSearchComponent(SearchComponent);
					var _ListComponent = this._wrapListComponent(ListComponent);
					return _react2.default.cloneElement(elementTree, elementTree.props, [_SearchComponent, _ListComponent]);
				}
			}]);

			return TablePage;
		}(WrappedComponent);

		TablePage.displayName = 'TablePage(' + getDisplayName(WrappedComponent) + ')';

		return _form2.default.create()(TablePage);
	};
};