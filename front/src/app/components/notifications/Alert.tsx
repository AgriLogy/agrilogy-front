import React from 'react';
import "./style.css";

interface AlertProps {
  id: number;
  alert: {
    title: string;
    description: string;
    danger_level: string;
  };
  is_read: boolean;
  read_at: string | null;
}

const Alert: React.FC<AlertProps> = ({ alert, is_read }) => {
  return (
    <div className="box">
      <h4>{alert.title}</h4>
      <p>{alert.description}</p>
      <p><strong>Danger Level:</strong> {alert.danger_level}</p>
      <p>{is_read ? 'Read' : 'Unread'}</p>
    </div>
  );
};

export default Alert;
