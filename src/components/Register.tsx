import 'antd/dist/reset.css';
import React, { useState } from "react";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import UserT from "../types/user.type";
import { Form, Input, Button } from 'antd';
import { register } from "../services/auth.service";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const Register: React.FC = () => {
  
  let navigate: NavigateFunction = useNavigate();
  const initialValues: UserT = {
    username: "",
    email: "",
    password: "",
    role: "user" ,
    actiCode:"",
  };

  

  const handleRegister =  (values: UserT) => {
    const { username, email, password,actiCode } = values;

   register(username, email, password,actiCode).then(
      (response) => {
        
        window.alert(`Welcome ${username} pls login to access your account profile`)
        console.log(response.data);
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
                 window.alert(`Sorry ${username} Something wrong with your registration! Pls try again with another username`)
         console.log(error.toString());
      
        navigate("/register");
        window.location.reload();
      }
    );
  };

  return (
    
         <>
           <h3> <strong>Welcome to Blog Registration</strong></h3>
             <Form style={{margin: "5px",width:"900px"}} 
  layout="vertical"             name="normal_register"
               className="register-form"

               initialValues={initialValues}
               onFinish={handleRegister}>
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
                <Form.Item name="email"
    label= "Email"              
                   rules={[
                     {type: 'email',
                       message: 'The input is not valid E-mail!',
                     },
                     {required: true,
                       message: 'Please input your E-mail!',
                     },
                   ]} >
                 <Input  placeholder="emails" />
                 </Form.Item>
                 
                 <Form.Item
                   name="password"
label= "Password"                 
                   rules={[
                     {
                       required: true,
                       message: 'Please input your password!',
                     },
                   ]}
                   hasFeedback
                 >
                   <Input.Password  placeholder="Password"/>
                 </Form.Item>

                 <Form.Item
                   name="confirm"
label= "Confirm Password"                  
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
                         return Promise.reject(new Error('The new password that you entered do not match!'));
                       },
                     }),
                   ]}
                 >
                   <Input.Password  placeholder="Confirm Password"/>
                 </Form.Item>
                <Form.Item
                 name="actiCode" 
 label= "Activation Code"                 
                  
               >
                 <Input.Password
                   prefix={<LockOutlined className="site-form-item-icon" />}
                   type="password"
                   placeholder="secret code for internal staff(optional)"
                 />
               </Form.Item>
              
               <Form.Item>
                 <Button type="primary" htmlType="submit" className="login-form-button">
                   Register
                 </Button>
                 
               </Form.Item>
   

            
          </Form>
         
         </>
  );
};

export default Register;
