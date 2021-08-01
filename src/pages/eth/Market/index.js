import { Button, Form, DatePicker, message, Modal, Input } from 'antd';
import React, { useState } from 'react';
import _ from 'lodash';
import Actions from 'src/actions';
import { useStore } from 'src/Provider';
import { PageHeader } from 'src/components';
const { Item } = Form;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const required = { required: true, message: '必填' };
export default function Market() {
  const store = useStore();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { price } = store;
  if (_.isEmpty(price)) {
    return null;
  }
  return (
    <div className="market-page">
      <PageHeader title="行情" />
      <div style={{ maxWidth: '600px' }}>
        <Form
          form={form}
          {...layout}
          name="basic"
          onFinish={async (values) => {
            setLoading(true);
            await Actions.updatePrice(values);
            store.setPrice(values);
            message.success('更新成功');
            setLoading(false);
          }}
          initialValues={price}
        >
          {Object.keys(price).map((token) => {
            return (
              <Item key={token} name={token} label={`${token}价格`} rules={[required]}>
                <PriceInput />
              </Item>
            );
          })}
          <Item {...tailLayout}>
            <Button type="primary" htmlType="submit" disabled={loading}>
              更新行情
            </Button>
          </Item>
        </Form>
      </div>
    </div>
  );
}

function PriceInput(props) {
  const { value, onChange } = props;
  const [price, token] = value.split(' ');
  return (
    <Input
      value={price}
      suffix={token}
      onChange={(e) => {
        const _price = e.target.value;
        onChange(`${_price} ${token}`);
      }}
    />
  );
}
