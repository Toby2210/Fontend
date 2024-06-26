import 'antd/dist/reset.css';
import React, { useState } from "react";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox, Modal } from 'antd';
import { LoginOutlined, UserOutlined, LockOutlined ,GoogleOutlined} from '@ant-design/icons';
import { login, register } from "../services/auth.service";

import { gapi } from "gapi-script"
import { useEffect } from "react"


const Login: React.FC = () => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState<any>(null);
  let navigate: NavigateFunction = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isShow, setIsShow] = React.useState(false);

  const handleGoogleSignIn = () => {
    setIsShow(false); // Close the modal
    navigate("/googleLogin");
  }
   

  const onFinish = (values: any) => {
    const { username, password } = values;



    setMessage("");
    setLoading(true);

    login(username, password).then(
      () => {
        if (localStorage.getItem("user"))
          navigate("/profile");
        window.location.reload();
      })
      .catch(
        (error) => {

          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          window.alert(`Sorry ${username} you may not have account in our system yet! pls try again or register first`)
          console.log(error.toString());
          setLoading(false);
          setMessage(resMessage);
          navigate("/");
          window.location.reload();

        }

      )

  }
  const forgotPassword = () => {
    setIsShow(false); // Close the modal
    navigate("/forgotPassword");
  }




  return (
    <>
      <Button icon={<LoginOutlined />} onClick={() => { setIsShow(true) }} />
      <Modal open={isShow} onCancel={() => { setIsShow(false) }} title="Welcome Blogger" footer={[]}>
        <Form style={{ margin: "5px" }}
          name="normal_login"
          layout="vertical"
          wrapperCol={{ span: 8 }}
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            label="Username"
            rules={[
              {
                required: true,
                message: 'Please input your Username!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Please input your Password!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" onClick={forgotPassword}>
              Forgot password
            </a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            Or <a href="/register">register now!</a>
          </Form.Item>
          
        </Form>
        <div id="google-signin-btn"><button onClick={handleGoogleSignIn}><GoogleOutlined />Sign in with Google</button></div>

      </Modal>
    </>
  );
};


export default Login;
