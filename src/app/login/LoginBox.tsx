'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Alert, Button, Form, Input } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import axiosInstance from '../lib/api';
import { LoginCard } from '../components/auth/LoginCard';
import styles from './LoginBox.module.scss';

type LoginFormValues = {
  username: string;
  password: string;
};

type SignInResponse = {
  access: string;
  refresh: string;
  is_staff: boolean;
};

export default function LoginBox() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    setErrorMessage('');

    try {
      const { status, data } = await axiosInstance.post<SignInResponse>(
        '/auth/signin/',
        values
      );

      if (status >= 200 && status < 300) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        router.push(data.is_staff ? '/admin' : '/');
      }
    } catch {
      setErrorMessage("Nom d'utilisateur ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginCard
      title="Se connecter"
      subtitle="Accédez à votre tableau de bord Agrilogy"
    >
      {errorMessage && (
        <Alert
          type="error"
          description={errorMessage}
          showIcon
          closable={{ onClose: () => setErrorMessage('') }}
          style={{ marginBottom: '1rem' }}
        />
      )}

      <Form<LoginFormValues>
        layout="vertical"
        size="large"
        autoComplete="on"
        requiredMark={false}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          label={<span className={styles.label}>Nom d&apos;utilisateur</span>}
          rules={[
            {
              required: true,
              message: "Veuillez saisir votre nom d'utilisateur.",
            },
          ]}
        >
          <Input
            className={styles.input}
            prefix={<UserOutlined />}
            placeholder="Votre nom d'utilisateur"
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={<span className={styles.label}>Mot de passe</span>}
          rules={[
            {
              required: true,
              message: 'Veuillez saisir votre mot de passe.',
            },
          ]}
        >
          <Input.Password
            className={styles.input}
            prefix={<LockOutlined />}
            placeholder="Votre mot de passe"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Se connecter
          </Button>
        </Form.Item>
      </Form>
    </LoginCard>
  );
}
