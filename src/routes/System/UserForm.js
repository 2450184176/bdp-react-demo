import React from 'react';
import { Form, Modal, Input, Select } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class UserForm extends React.Component {
  okHandle = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  render() {
    const { modalVisible, form, handleModalVisible } = this.props;
    return (
      <Modal
        title="新建规则"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="工号"
        >
          {form.getFieldDecorator('userCode', {
            rules: [{ required: true, message: '请输入工号' }],
          })(
            <Input placeholder="请输入" type="number" />
          )}
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="角色"
        >
          {form.getFieldDecorator('roleId', {
            rules: [{ required: true, message: '选择角色' }],
          })(
            <Select placeholder="请选择" style={{ width: '100%' }}>
              <Option value={1}>超级管理员</Option>
              <Option value={3}>普通用户</Option>
            </Select>
          )}
        </FormItem>
      </Modal>
    );
  }
}
export default UserForm;
