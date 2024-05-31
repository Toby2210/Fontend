import 'antd/dist/reset.css';
import React, { useState } from "react";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import UserT from "../types/user.type";
import { Form, Input, Button } from 'antd';
import { login, register } from "../services/auth.service";
import { UserOutlined, LockOutlined ,GoogleOutlined} from '@ant-design/icons';
import { gapi } from "gapi-script"
import { useEffect } from "react"



  const googleLogin: React.FC = () => {
    const [googleLoading, setGoogleLoading] = useState(false);
    const [googleUser, setGoogleUser] = useState<any>(null);

    let navigate: NavigateFunction = useNavigate();
    const initialValues: UserT = {
      username: "",
      email: "",
      password: "",
      role: "user",
      actiCode: "",
    };

    const handleRegister = (values: UserT) => {
      const { username, email, password, actiCode } = values;


      register(username, email, password, actiCode).then(
        (response) => {
          login(username, password).then(
            () => {
              if(localStorage.getItem("user"))
                navigate("/profile");
              window.location.reload();
            })

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
    useEffect(() => {
      gapi.load("auth2", () => {
        const auth2 = gapi.auth2.init({
          client_id: "1027984227842-j76010ig3f3fdeqkpngdppjljcrnmh6g.apps.googleusercontent.com",
          scope: "email profile",
        });
        auth2.attachClickHandler("google-signin-btn", {}, (googleUser) => {
          const profile = googleUser.getBasicProfile();
          setGoogleUser({
            id: profile.getId(),
            email: profile.getEmail(),
            name: profile.getName(),
          });
          const password = `Fnw1${profile.getId()}0_29j`
          // Register the user with Google account details
          register(profile.getName(), profile.getEmail(), password, "").then(
            (response) => {
              login(profile.getName(), password).then(
                () => {
                  if(localStorage.getItem("user"))
                    navigate("/profile");
                  window.location.reload();
                })
              window.alert(`Welcome ${profile.getName()}, please login to access your account profile`);
              console.log(response.data);
            }).catch((error) => {
              window.alert(`Sorry ${profile.getName()}, registration failed. Please try again.`);
              console.log(error.toString());
              navigate("/register");
              window.location.reload();
            }
          );
        });
      });
    }, []);


    return (

      <>
        <h3> <strong>Welcome to Blog Registration</strong></h3>
        
          <div id="google-signin-btn"><button><GoogleOutlined />Sign in with Google</button></div>




   


      </>
    );
  };

  export default googleLogin;
