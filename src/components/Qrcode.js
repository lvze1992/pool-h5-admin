import React, { useEffect, useState } from 'react';
import qrcode from 'qrcode';
console.log('qrcode', qrcode);

export default function Qrcode(props) {
  const { title, text } = props;
  const [imgData, setImg] = useState('');
  useEffect(() => {
    (async function () {
      setImg(await qrcode.toDataURL(text));
    })();
  }, []);
  console.log('imgData', imgData);

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
