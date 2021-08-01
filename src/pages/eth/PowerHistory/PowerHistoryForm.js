import React, { useState } from 'react';
import { Form, Input, Button, DatePicker, message, Tooltip } from 'antd';
import { useStore } from 'src/Provider';
import Actions from 'src/actions';
import Utils from 'src/utils';
import _ from 'lodash';
const { Item } = Form;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const required = { required: true, message: '必填' };
const onFinish = async (values, { setShowDraw, store }) => {
  try {
    await Actions.insertETHDayPower(values, store.eth.ethConfig);
    message.success('添加成功');
    setShowDraw(false);
  } catch (e) {
    message.warning(e.rawMessage || '异常：PHF22');
  }
};

const onFinishFailed = (errorInfo) => {};
function calcPowerFeeMD(perMPowerCost, powerFee, price) {
  if (!perMPowerCost || !powerFee || !price) {
    return '';
  }
  const usdt_cny = +price['USDT'].split(' ')[0];
  return Utils.cutNumber(Utils.calc(`${perMPowerCost}*${powerFee}/${usdt_cny}*24`), 9) + '';
}
export default function PowerHistoryForm(props) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const store = useStore();
  const { price } = store;
  const { setShowDraw } = props;
  const perMPowerCost = '0.001454166';
  const powerFee = '0.69';
  const ManageFee = '0.15';
  if (_.isEmpty(price)) {
    return null;
  }
  return (
    <Form
      form={form}
      {...layout}
      name="basic"
      onFinish={async (values) => {
        setLoading(true);
        await onFinish(values, { setShowDraw, store });
        setLoading(false);
      }}
      initialValues={{
        perMPowerCost,
        powerFee,
        powerFeeMD: calcPowerFeeMD(perMPowerCost, powerFee, price),
        ManageFee,
      }}
      onValuesChange={(changedValues, allValues) => {
        console.log('changedValues', changedValues);
        if (changedValues.perMPowerCost || changedValues.powerFee) {
          form.setFieldsValue({
            powerFeeMD: calcPowerFeeMD(allValues.perMPowerCost, allValues.powerFee, price),
          });
        }
      }}
      onFinishFailed={onFinishFailed}
    >
      <Item name="date" label="录入日期：" rules={[required]}>
        <DatePicker />
      </Item>
      <Item name="totalPower" label="总算力/M：" rules={[required]}>
        <Input type="number" />
      </Item>
      <Item name="todayProfit" label="当日收益/ETH：" rules={[required]}>
        <Input type="number" />
      </Item>
      <Item name="perMProfit" label="单M收益/ETH：" rules={[required]}>
        <Input type="number" />
      </Item>
      <Item name="perMPowerCost" label="单M功耗/w：" rules={[required]}>
        <Input type="number" />
      </Item>
      <Item name="powerFee" label="电费 元/KWH：" rules={[required]}>
        <Input type="number" />
      </Item>
      <Item name="powerFeeMD" label="单M单日电费/U：" rules={[required]}>
        <Input type="number" disabled />
      </Item>
      <Item name="ManageFee" label="管理费：" rules={[required]}>
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
            累计收益/ETH：
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
