import axios from "axios";
import { api } from '../components/common/http-common';
import { Buffer } from 'buffer';

export const register = async (username: string, email: string, password: string, actiCode:string) => {
  return await axios
    .post(api.uri + "/users", {
    username,
    email,
    password,
    actiCode,  
  })
};

export const login = async (username: string, password: string) => {
  console.log('username '+ username)
  console.log('password '+ password)
  const access_token:string = Buffer.from(`${username}:${password}`, 'utf8').toString('base64');
  console.log('access_token '+ access_token)
  let data = '';
  let path:string = api.uri + "/users/login";  
  console.log('path '+ path)
  let config = {
         method: 'post',
         maxBodyLength: Infinity,
         url: path,
         headers: { 
           'Authorization': `Basic ${access_token}`
          // 'Authorization': 'Basic Y3ljaGVuZzo2NTQzMjE='
         },
         data : data
       };
  console.log('config '+ config);

  await axios.request(config).then((response) => {
         console.log('response from server ' + JSON.stringify(response.data));
         localStorage.setItem("aToken",access_token), 
         localStorage.setItem("user", JSON.stringify(response.data));
     return response.data  })
   
          
    
} 


export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("aToken");
  localStorage.removeItem("a");
  localStorage.removeItem("e");
  
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  return null;
};
