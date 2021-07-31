import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, message, Tooltip } from 'antd';
import Actions from 'src/actions';
import { useStore } from 'src/Provider';
import { UserSelector } from 'src/components';
const { Item } = Form;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const required = { required: true, message: '必填' };
const onFinish = async (values, { success }) => {
  try {
    await Actions.insertUserBuyEth(values);
    message.success('添加成功');
    success(false);
  } catch (e) {
    message.warning(e.rawMessage || '异常：PHF18');
  }
};

const onFinishFailed = (errorInfo) => {};
export default function UserHistoryForm(props) {
  const [loading, setLoading] = useState(false);
  const store = useStore();
  const { setShowDraw } = props;
  const [form] = Form.useForm();
  return (
    <Form
      form={form}
      {...layout}
      name="basic"
      onFinish={async (values) => {
        setLoading(true);
        await onFinish(values, {
          success: () => {
            form.resetFields();
            setShowDraw();
          },
        });
        setLoading(false);
      }}
      onValuesChange={(changedValues) => {
        console.log('changedValues', changedValues);
        if (changedValues.date) {
          form.setFieldsValue({
            startDate: changedValues.date.clone().add(7, 'day'),
            endDate: changedValues.date.clone().add(7 + 720, 'day'),
          });
        }
      }}
      onFinishFailed={onFinishFailed}
    >
      <Item name="userId" label="手机号：" rules={[required]}>
        <UserSelector />
      </Item>
      <Item name="buyPower" label="购买算力/M：" rules={[required]}>
        <Input type="number" />
      </Item>
      <Item name="buyPowerCost" label="购买总值/USDT：" rules={[required]}>
        <Input type="number" />
      </Item>
      <Item name="date" label="购买日期：" rules={[required]}>
        <DatePicker />
      </Item>
      <Item name="startDate" label="生效日期：" rules={[required]}>
        <DatePicker />
      </Item>
      <Item name="endDate" label="到期日期：" rules={[required]}>
        <DatePicker />
      </Item>
      <Item {...tailLayout}>
        <Button type="primary" htmlType="submit" disabled={loading}>
          添加
        </Button>
      </Item>
    </Form>
  );
}
