import 'antd/dist/reset.css';
import React from 'react';
import EditForm from './EditForm';
import { useParams, useNavigate } from 'react-router-dom';
import { Button,Spin, Col, Card } from 'antd';
import { api } from './common/http-common';
import axios from 'axios';
import { RollbackOutlined,LoadingOutlined,CloseSquareOutlined,CloseSquareFilled,EditOutlined,EditFilled } from '@ant-design/icons';
import { getCurrentUser } from "../services/auth.service";



const DetailArticle = () => {
const currentUser = getCurrentUser();
const { aid } = useParams();
const [article, setArticle] = React.useState({id:0, title:'', alltext:'', summary:'',imageurl:'', authorid:0, description:""}); 
const navigate= useNavigate();
const [loading, setLoading] = React.useState(true);
const [theme, setTheme] = React.useState('outlined');

React.useEffect(() => {
  console.log(`path: ${api.uri}/articles/${aid}`)
    axios.get(`${api.uri}/articles/${aid}`)
      .then((res) => {
      //  console.log('article' ,article)
        setArticle(res.data);
        localStorage.setItem('e',JSON.stringify(res.data))  
        setLoading(false);
      }).then(()=>{
        setLoading(false);
      })  
      .catch((error) => {
        console.log('Error fetching article details ')
       // console.error('Error fetching article details:', error);
      });
  }, [aid]);
  
  function getIcon (theme:string) {
    let Icon;
  
    if (theme === 'filled') 
        Icon=CloseSquareFilled      
    else 
        Icon=CloseSquareOutlined 
    return Icon;
  }
  
  
  const handleDelete = () => {
  
    setTheme('filled')
// console.log('fav link arr ', fav.links.fav)
// console.log('fav link ', fav)
  axios.delete(`${api.uri}/articles/${aid}`, {
       
        headers: {
            "Authorization": `Basic ${localStorage.getItem('aToken')}`
          }
        }        
    )
      .then((results) =>{ console.log('respone ',JSON.stringify(results.data.message))
        if(results.data.message==="removed")
      {  
          alert("This article is removed from the blog list")
          navigate("/");
          window.location.reload();}
        
      })
      .catch((err) => {
      console.log(`Check network problems pls. `);
         alert("Check network problems");
  })      
}

       
if(loading){
const antIcon = <LoadingOutlined style={{ fontSize: 48}} spin />
return(<Spin indicator={antIcon} />);
}
else {

  const Icon = getIcon(theme)
  return (
    <>
      <h2 style={{ color: 'red' }}> Welcome to Blog Dashboard</h2>   
      
            <Col  span={24} >                                   
             <Card title={article.title} style={{width: 300,marginLeft:"100px"}}
                   cover={<img alt="put image here" src={article.imageurl} />} hoverable
                  
                   actions={[
                    (currentUser&&currentUser.role==="admin"&&currentUser.id===article.authorid)&&<EditForm  isNew={false} aid={aid}/>,  
                    (currentUser&&currentUser.role==="admin"&&currentUser.id===article.authorid)&& <Icon  style={{ fontSize: '32px', }} onClick={()=>handleDelete()}/>
                  ]} 
                   >               
                  <div> <h3>About me</h3>
                   <p>{article.alltext}</p>
                   <h3>Summary</h3>
                   <p>{article.summary}</p>
                   <h3>Detail Description</h3>
                   <p> {article.description}</p>
                   <Button  
        type="primary"
        icon={<RollbackOutlined />}
        onClick={() => navigate(-1)} 
      /></div> 
                 
                </Card>
               </Col>
      
    </>
  );

 }
}

export default DetailArticle;