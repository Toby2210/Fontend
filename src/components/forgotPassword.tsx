import 'antd/dist/reset.css';
import React, { useState } from "react";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import UserT from "../types/user.type";
import { Form, Input, Button } from 'antd';
import { login, register } from "../services/auth.service";
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { gapi } from "gapi-script"
import { useEffect } from "react"
import axios from "axios";
import { api } from './common/http-common';

const forgotPassword: React.FC = () => {
  let navigate: NavigateFunction = useNavigate();

  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const initialValues = {
    email: '',
    password: '',
    confirmPassword: '',
  }

  const handleCompare = (values: UserT) => {
    const Values = {
      username: values.username,
      email: values.email,

    };
    console.log(Values)
    axios.post(`${api.uri}/users/forgot`, Values)
      .then((res) => {
        if (res.status === 200) {
          setShowPasswordFields(true);
        } else {
          alert(`These username and email is not match`)
        }
      })
      .catch((error) => {
        alert(error.message)
      });
  };

  const handleForgetPassword = (values: UserT) => {
    const Values = {
      username: values.username,
      email: values.email,
      password: values.password,
    };
    console.log(Values)
    axios.post(`${api.uri}/users/forgot`, Values)
      .then((res) => {
        console.log(res)
        if (res.status === 200) {
          axios.put(`${api.uri}/users/${res.data.id}`, Values)
            .then((putRes) => {
              alert(`Youre password has been changed`)
              navigate("/");
              window.location.reload();
            })
            .catch((putError) => {
              alert(putError.message)
            });
        }
      })
      .catch((getErr) => {
        alert(getErr.message)
      });
  };

  return (
    <>


      {!showPasswordFields ? (<Form
        layout="vertical" name="forgot_password"
        initialValues={initialValues}
        onFinish={handleCompare}
      >
        <Form.Item
          name="username"
          label="Username"
          rules={[
            {
              required: true,
              message: 'Please input your Username!'
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              type: 'email',
              message: 'The input is not valid E-mail!',
            },
            {
              required: true,
              message: 'Please input your E-mail!',
            },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Submit
          </Button>
        </Form.Item>
      </Form>
      ) : (
        <Form
          layout="vertical" name="update_password"
          initialValues={initialValues}
          onFinish={handleForgetPassword}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!'
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Update Password
            </Button>
          </Form.Item>
        </Form>
      )}

    </>
  );
};

export default forgotPassword;