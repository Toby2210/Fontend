
import { Button,  List, Tooltip, Space, Input, Modal, Flex } from  'antd';
import { Comment } from '@ant-design/compatible';
import { DeleteOutlined, DeleteFilled, MessageOutlined, } from '@ant-design/icons';
import React, { useState } from 'react';
import axios from 'axios';
import { getCurrentUser } from "../services/auth.service";
import { NavigateFunction, useNavigate } from 'react-router-dom';


const DisplayComment = (props:any) => {    
const [article_comments, setComments] = React.useState<any>([]);
const [isShow, setIsShow] = React.useState(false); 
const currentUser = getCurrentUser();
const navigate: NavigateFunction = useNavigate();

let islogin =false;
let isAdmin =false;
let Icon = DeleteOutlined

if(currentUser){
  islogin =true
  if(currentUser.role=="admin" )
  isAdmin=true}
 
  React.useEffect(()=>{
  axios.get(props.msgLink)
    .then((res)=>{
      setComments(res.data);  
      console.log('no of msg ',article_comments.length)                    
    }) 
    .catch(err => {
      console.log(`icon error for msg  `)
    });   
          
}, []);
 


const addComment:any =  (event:any)  => {  
  
   console.log('event.target.value ',event.target.value)
    if(event.target.value!=null){
      const raw ={"messagetxt": `${event.target.value}`}
        console.log('raw ', raw)
      return(
          axios.post(props.msgLink, raw, {
            headers: {
              'Authorization': `Basic ${localStorage.getItem('aToken')}`
            }
          })                   
      .then(reponse =>{ if(reponse.data.message==="added")
      {
       alert("comment added")
       navigate("/");
       window.location.reload();}
         else(alert("you have post comment already"))
      })
      .catch(err => {
      console.log(`${props.msgLink} Check network problems pls. ${props.id}`);
         alert("Check network problems");
      })
      )}
                 
}


const  removeComm = (msgtxt:any) =>
{
Icon=DeleteFilled;
  const raw = JSON.stringify({"messagetxt": `${msgtxt}`})
  console.log(' msgLink  ',props.msgLink)   
  console.log(' raw  ',raw)   

  if(raw!=undefined){
   axios.delete(props.msgLink, {       
    headers: {
        "Authorization": `Basic ${localStorage.getItem('aToken')}`
      },
      data: {source:raw}
      
    }).then(response =>{ 
        console.log('msglink ',props.msgLink)
        console.log('respone ',JSON.stringify(response.data.message))
        if(response.data.message==="removed")
      {     
          alert("This article commentis removed by admin")
          navigate("/");
          window.location.reload();}       
      })
      .catch(err => {
      console.log(`${props.type} Check network problems pls. ${props.id}`);
         alert("Check network problems");
 })
    }

  
  }  

 return(
 <>
  <Button icon={<MessageOutlined />} onClick={()=>{setIsShow(true)}} />
      <Modal open={isShow} onCancel={()=>{setIsShow(false)}} title="Comments Page " footer={[]}> 
  
  <List   
    className="comment-list"
    itemLayout="horizontal"
    dataSource={article_comments}
    renderItem={(item:any) => (
    <Flex gap="middle" align='center'  justify = 'flex-start' >
     <li> 
        <Comment 
        //  actions={actions}
          author={item.username}
         // avatar={item.avatar}
        content={item.messagetxt}   
        datetime={item.datemodified} />                               
      </li>
       {isAdmin&&<Icon onClick={() =>removeComm(item.messagetxt)}  />}          
    </Flex> 
     )}
  /> 
  <Input  placeholder="Pls. login to enter your comments here" name='input_msg' disabled={islogin? false:true}  allowClear
            onPressEnter={addComment} />
   </Modal>
  </> 
)
}



export default DisplayComment