import React, { useState } from 'react';
import { message, Input, Space, Button } from 'antd';
import Utils from 'src/utils';
import Actions from 'src/actions';
let timer = null;
async function sendSmsCode({ phone, setRemain }) {
  try {
    // await Actions.AV.Cloud.requestSmsCode(phone);
    setRemain(60);
    clearInterval(timer);
    timer = setInterval(() => {
      setRemain((pre) => {
        if (pre <= 0) {
          clearInterval(timer);
        }
        return pre - 1;
      });
    }, 1000);
  } catch (e) {
    message.warning(e.rawMessage);
  }
}
export default function ActiveKey(props) {
  const [phone, setPhone] = useState('');
  const [pwd, setPwd] = useState('');
  const [sms, setSms] = useState('');
  const [remainSeconds, setRemain] = useState(-1);
  return (
    <div className="key-page">
      <Space
        direction="vertical"
        size="large"
        style={{
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <h1>登录</h1>
        <Input
          value={phone}
          placeholder="请输入手机号"
          prefix={<i className="iconfont iconshouji" />}
          onChange={(e) => {
            setPhone(e.target.value);
          }}
        />
        <Input
          value={pwd}
          placeholder="请输入密码"
          type="password"
          prefix={<i className="iconfont iconmima" />}
          onChange={(e) => {
            setPwd(e.target.value);
          }}
        />
        <Input
          value={sms}
          placeholder="请输入短信验证码"
          prefix={<i className="iconfont iconduanxin" />}
          suffix={
            <div className="sms-tip">
              {remainSeconds > 0 ? (
                <div>
                  <span className="second">{remainSeconds}</span>秒后重新发送验证码
                </div>
              ) : (
                <div
                  className="reset-sms"
                  onClick={() => {
                    sendSmsCode({ phone, setRemain });
                  }}
                >
                  点击发送验证码
                </div>
              )}
            </div>
          }
          onChange={(e) => {
            setSms(e.target.value);
          }}
        />
        <Button
          type="primary"
          style={{ width: '100%' }}
          onClick={async () => {
            if (!phone || !pwd || !sms) {
              message.warning('请填写完整信息');
              return;
            }
            props.login({
              phone,
              pwd,
              sms,
            });
          }}
        >
          登录
        </Button>
        <Button
          style={{ width: '100%' }}
          onClick={() => {
            props.setActiveKey('');
          }}
        >
          上一步
        </Button>
      </Space>
    </div>
  );
}
