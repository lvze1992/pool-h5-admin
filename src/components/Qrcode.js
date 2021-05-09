import React, { useEffect, useState } from 'react';
import qrcode from 'qrcode';
export default function Qrcode(props) {
  const { title, text } = props;
  const [imgData, setImg] = useState('');
  useEffect(() => {
    (async function () {
      setImg(await qrcode.toDataURL(text));
    })();
  }, []);
  return (
    <div
      style={{
        color: '#fff',
        textAlign: 'center',
      }}
    >
      <p>
        <b>{title}</b>
      </p>
      <p>{text}</p>
      <img src={imgData} alt="qrcode" />
    </div>
  );
}
