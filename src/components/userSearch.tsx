import 'antd/dist/reset.css';
import  { useState } from 'react';
import {  Input, message, Typography } from 'antd';
import { api } from './common/http-common';
import {Table,  Select,Col} from 'antd';
import axios from 'axios';
import { NavigateFunction, useNavigate } from 'react-router-dom';

// import { Tag, Space } from 'antd';

const { Column} = Table;
const  { Search } = Input;
const { Title } = Typography;


function SearchUser() {
 let navigate: NavigateFunction = useNavigate();
 const [press, setPress] = useState("");
 const [usersData, setUsers] = useState([]);
 const[isSearchOK,setSearch]=useState(false);
 

const onSearch= async (value:any) => {
  console.log("value ",value)
  console.log("press ",`${press}`)
 let urlPath=`${api.uri}/users`;
 if (press==="email"||press==="username") 
   urlPath+=`/?fields=${press}&q=${value}`
 else
  if(press==="username&fields=email"&&value==="")
     urlPath+=`/?fields=${press}`
 
  console.log("urlPath ",urlPath)
 
  console.log("aToken ",localStorage.getItem('aToken'))
  return(await axios.get(`${urlPath}`,{
    method: "GET",
    headers:{"Authorization": `Basic ${localStorage.getItem('aToken')}`}
})
  .then(data => { 
   console.log("user return  ",JSON.stringify(data) );
   console.log("user data  ",data );
   if(!data.data.length||data.data.length==0)
     {alert("No data found")
      navigate("/profile");
      window.location.reload();
     }
   setUsers(data.data);
   setSearch(true); 
    value="";
  })
  .catch(err => console.log("Error fetching users", err)) 
  ) 
}

const { Option } = Select;

function handleChange(value:any)  {
  message.info("Pls. enter at least three characters to search by email or username otherwise leave the input empty")
  
  setPress(value);
  console.log(`selected ${value}`);
}
   	

  return (
   <>
     <Col span={16}> 
       <Title level={3} style={{color:"#0032b3"}}>Blog Staff Admin</Title>
        <Title level={5}>Manage User Info</Title>            
       <Search placeholder="Search Users"
            allowClear
            enterButton="Search"
            size="large"
            onSearch={onSearch}/>
       <Select defaultValue="all" style={{ width: 280, marginRight:'200px' }} onChange={handleChange}>
        <Option value="username">username</Option>
        <Option value="email">email</Option>
        <Option value="username&fields=email">Get all-filter by username & email</Option>
        <Option value="all">Get all-without filter</Option>
        </Select>	      
  {isSearchOK&&<Table dataSource={usersData}>
   <Column title="ID" dataIndex="id" key="id" />
   <Column title="Username" dataIndex="username" key="username" />
   <Column title="email" dataIndex="email" key="email" />
   <Column title="Role" dataIndex="role" key="role" /> 
   </Table>}
   </Col>  

    </>  
  );
  }

export default SearchUser;

  