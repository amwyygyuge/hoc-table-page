var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define(["require", "exports", "react", "igroot"], function (require, exports, React, igroot_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Item = igroot_1.Form.Item;
    function getDisplayName(WrappedComponent) {
        return WrappedComponent.displayName || 'Component';
    }
    var HocTablePage = function (TablePageParams) {
        if (TablePageParams === void 0) { TablePageParams = {
            defaultParams: {},
            pagination: true,
            defaultPageInfo: {
                current_page: 1,
                page_size: 30
            },
            queryData: function (params, pageInfo, state, callback) { return Promise.resolve(); }
        }; }
        return function (WrappedComponent) {
            var TablePage = (function (_super) {
                __extends(TablePage, _super);
                function TablePage(props) {
                    var _this = _super.call(this, props) || this;
                    _this._wrapSearchComponent = function (SearchComponent) {
                        var searchComponentProps = _this._assembleSearchComponentProps();
                        var _SearchComponent = React.cloneElement(SearchComponent, searchComponentProps);
                        return React.createElement(igroot_1.Form, { key: TablePage.displayName + ".Search" },
                            " ",
                            _SearchComponent,
                            " ");
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
                    _this._wrapListComponent = function (ListComponent) {
                        var listComponentProps = _this._assembleListComponentProps();
                        var _ListComponent = React.cloneElement(ListComponent, listComponentProps);
                        return React.createElement("div", { key: TablePage.displayName + ".List" }, _ListComponent);
                    };
                    _this._assembleListComponentProps = function () {
                        var _a = _this.state, loading = _a.loading, dataSource = _a.dataSource, total = _a.total;
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
                    _this._tableProps = function () {
                        var _a = _this.state, loading = _a.loading, total = _a.total, current_page = _a.current_page, page_size = _a.page_size, dataSource = _a.dataSource;
                        var pageConfig = {
                            current: current_page,
                            pageSize: page_size,
                            total: total,
                            showTotal: function (total) { return "\u603B\u6761\u6570 " + total + " \u6761"; },
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '20', '30', '50', '100', '200'],
                            onChange: _this.handlePageChange,
                            onShowSizeChange: _this.handlePageChange
                        };
                        return {
                            loading: loading,
                            pagination: TablePageParams.pagination ? pageConfig : null,
                            rowKey: 'id',
                            dataSource: dataSource
                        };
                    };
                    _this.renderButtons = function () {
                        var loading = _this.state.loading;
                        return (React.createElement(Item, { style: { textAlign: 'right' } },
                            React.createElement(igroot_1.Button, { style: { marginRight: 10 }, type: 'primary', className: 'button', htmlType: 'submit', loading: loading, onClick: _this.handleSearch }, "\u641C\u7D22"),
                            React.createElement(igroot_1.Button, { className: 'button', onClick: _this.handleReset }, "\u91CD\u7F6E")));
                    };
                    _this._setDataSource = function (dataSource) {
                        _this.setState({ dataSource: dataSource });
                    };
                    _this.handlePageChange = function (pageInfo) {
                        var current_page = pageInfo.current_page, page_size = pageInfo.page_size;
                        var cb = function () { return _this.setState({ current_page: current_page, page_size: page_size }); };
                        var getFieldsValue = _this.props.form.getFieldsValue;
                        var params = getFieldsValue();
                        var state = _this.state;
                        _this.tablePageQueryData(params, { current_page: current_page, page_size: page_size }, state, cb);
                    };
                    _this.handleSearch = function (e) {
                        var getFieldsValue = _this.props.form.getFieldsValue;
                        var params = getFieldsValue();
                        _this.executeSearch(params);
                    };
                    _this.handleReset = function () {
                        var _a = _this.props.form, resetFields = _a.resetFields, setFieldsValue = _a.setFieldsValue;
                        resetFields();
                        setFieldsValue(TablePageParams.defaultParams || {});
                        _this.executeSearch(TablePageParams.defaultParams);
                    };
                    _this.executeSearch = function (params) {
                        var current_page = TablePageParams.defaultPageInfo.current_page;
                        var page_size = _this.state.page_size;
                        _this.setState({ current_page: current_page });
                        var state = _this.state;
                        _this.tablePageQueryData(params, { current_page: current_page, page_size: page_size }, state);
                    };
                    _this.handleReload = function () {
                        var getFieldsValue = _this.props.form.getFieldsValue;
                        var params = getFieldsValue();
                        var state = _this.state;
                        var current_page = state.current_page, page_size = state.page_size;
                        _this.tablePageQueryData(params, { current_page: current_page, page_size: page_size }, state);
                    };
                    _this.tablePageQueryData = function (params, pageInfo, state, cb) {
                        _this.setState({ loading: true });
                        var promise = TablePageParams.queryData(params, pageInfo, state, function (callback) {
                            _this.setState({ loading: false });
                            if (callback) {
                                var _a = callback, dataSource = _a.dataSource, total = _a.total;
                                cb && cb();
                                _this.setState({
                                    dataSource: dataSource,
                                    total: total
                                });
                            }
                            else {
                                igroot_1.message.error('数据请求失败。');
                            }
                        });
                        promise && promise.catch(function (err) { return _this.setState({ loading: false }); });
                    };
                    var defaultPageInfo = TablePageParams.defaultPageInfo, defaultParams = TablePageParams.defaultParams;
                    _this.state = __assign({}, _this.state, defaultPageInfo, { dataSource: [], loading: false, defaultParams: defaultParams, total: 0 });
                    return _this;
                }
                TablePage.prototype.componentDidMount = function () {
                    _super.prototype.componentDidMount && _super.prototype.componentDidMount.call(this);
                    this.tablePageQueryData(TablePageParams.defaultParams, TablePageParams.defaultPageInfo, this.state);
                    var setFieldsValue = this.props.form.setFieldsValue;
                    setFieldsValue(TablePageParams.defaultParams || {});
                };
                TablePage.prototype.render = function () {
                    var elementTree = _super.prototype.render.call(this);
                    var _a = elementTree.props.children, SearchComponent = _a[0], ListComponent = _a[1];
                    var _SearchComponent = this._wrapSearchComponent(SearchComponent);
                    var _ListComponent = this._wrapListComponent(ListComponent);
                    return React.cloneElement(elementTree, elementTree.props, [_SearchComponent, _ListComponent]);
                };
                TablePage.displayName = "TablePage(" + getDisplayName(WrappedComponent) + ")";
                return TablePage;
            }(WrappedComponent));
            return igroot_1.Form.create()(TablePage);
        };
    };
    exports.default = HocTablePage;
});
