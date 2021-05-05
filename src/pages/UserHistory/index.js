import React from 'react';
import { useHistory } from 'react-router-dom';
import './style.scss';
export default function UserHistory() {
  const history = useHistory();
  return <div className="userHistory-page">UserHistory</div>;
}
