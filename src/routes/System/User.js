import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Popconfirm, Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider } from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import CreateForm from './UserForm';
import styles from './User.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const userMap = {
  1: '超级管理员',
  2: '管理员',
  3: '普通用户',
};
// const CreateForm = Form.create()(UserForm);

@connect(({ user, loading }) => ({
  user,
  loading: loading.models.user,
}))
@Form.create()
export default class UserList extends PureComponent {
  state = {
    modalVisible: false,
    userEdit: false,
    formValues: {},
    columns: [
      {
        title: '工号',
        sorter: true,
        dataIndex: 'userCode',
      },
      {
        title: '创建时间',
        dataIndex: 'updateTm',
        sorter: true,
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '角色',
        sorter: true,
        dataIndex: 'roleId',
        render: val => <span>{userMap[val]}</span>,
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => { this.editRow(record); }}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除该用户吗？" onConfirm={() => { this.deleteRow(record); }}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetch',
    });
  }
  deleteRow = async (row) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'user/remove',
      payload: {
        key: row.key,
      },
    });
    await dispatch({
      type: 'user/fetch',
      payload: {},
    });
  }

  editRow = (row) => {
    this.setState({
      modalVisible: true,
      userEdit: row.key,
    });
    this.userForm.props.form.setFieldsValue({
      userCode: row.userCode,
      roleId: row.roleId,
    });
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'user/edit',
    //   payload: {
    //     id: row.id,
    //   },
    // });
  }
  addRow = () => {
    this.setState({
      modalVisible: true,
      userEdit: false,
    });
    this.userForm.props.form.resetFields();
  }
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'user/fetch',
      payload: params,
    });
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'user/fetch',
      payload: {},
    });
  }

  handleSearch = (e) => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'user/fetch',
        payload: values,
      });
    });
  }

  handleModalVisible = (flag) => {
    this.setState({
      modalVisible: !!flag,
    });
  }

  handleAdd = async (fields) => {
    const { userEdit } = this.state;

    if (userEdit) {
      const obj = Object.assign(fields, { key: userEdit });
      await this.props.dispatch({
        type: 'user/edit',
        payload: obj,
      });
    } else {
      await this.props.dispatch({
        type: 'user/add',
        payload: fields,
      });
    }
    await this.props.dispatch({
      type: 'user/fetch',
      payload: {},
    });
    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="查找用户">
              {getFieldDecorator('userCode')(
                <Input placeholder="请输入" type="number" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="角色">
              {getFieldDecorator('roleId')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value={1}>超级管理员</Option>
                  <Option value={3}>普通用户</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a> */}
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  renderForm() {
    return this.renderSimpleForm();
  }

  render() {
    const { user: { data }, loading } = this.props;
    const { modalVisible, columns } = this.state;

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderForm()}
            </div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.addRow()}>
                新建
              </Button>
            </div>
            <StandardTable
              // selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              // onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          wrappedComponentRef={inst => this.userForm = inst}
          edit={this.state.userEdit}
        />
      </PageHeaderLayout>
    );
  }
}
