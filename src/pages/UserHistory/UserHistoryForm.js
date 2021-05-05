import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, message, Tooltip } from 'antd';
import Actions from 'src/actions';
const { Item } = Form;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const required = { required: true, message: '必填' };
const onFinish = async (values, { setShowDraw }) => {
  try {
    await Actions.insertDayPower(values);
    message.success('添加成功');
    setShowDraw(false);
  } catch (e) {
    message.warning(e.rawMessage || '异常：PHF18');
  }
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
export default function UserHistoryForm(props) {
  const [loading, setLoading] = useState(false);
  const { setShowDraw } = props;
  return (
    <Form
      {...layout}
      name="basic"
      onFinish={async (values) => {
        setLoading(true);
        await onFinish(values, { setShowDraw });
        setLoading(false);
      }}
      onFinishFailed={onFinishFailed}
    >
      <Item name="date" label="录入日期：" rules={[required]}>
        <DatePicker />
      </Item>
      <Item name="totalPower" label="总算力/T：">
        <Input type="number" />
      </Item>
      <Item name="availablePower" label="有效算力/T：">
        <Input type="number" />
      </Item>
      <Item name="todayProfit" label="当日收益/XCH：">
        <Input type="number" />
      </Item>
      <Item name="perTProfit" label="单T收益/XCH：" rules={[required]}>
        <Input type="number" />
      </Item>
      <Item
        name="totalProfit"
        label={
          <span>
            <Tooltip
              placement="left"
              title={
                <div>
                  <p>会影响累计收益的计算。</p>
                  <p>
                    如设定了5月1日的累计收益为X
                    <br />
                    5月2日当日收益为Y。
                  </p>
                  <p>则5月2日的累计收益为X+Y，不再累计5月1日前的收益</p>
                </div>
              }
            >
              <i className="iconfont icontishi" />
            </Tooltip>
            累计收益/XCH：
          </span>
        }
      >
        <Input type="number" />
      </Item>
      <Item {...tailLayout}>
        <Button type="primary" htmlType="submit" disabled={loading}>
          添加
        </Button>
      </Item>
    </Form>
  );
}
