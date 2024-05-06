import 'antd/dist/reset.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row, Spin } from 'antd';
//import articles from './articles.json';
import { api } from './common/http-common';
import axios from 'axios';
import {LoadingOutlined} from '@ant-design/icons';
import PostIcon from './posticon';
import Displaycomment from './comments';



const Article = () => {
  const [articles, setArticles] = React.useState(null);  
  const [loading, setLoading] = React.useState(true);    
  React.useEffect(()=>{
    axios.get(`${api.uri}/articles`)
      .then((res)=>{
        setArticles(res.data);   
        localStorage.setItem('a',JSON.stringify(res.data))                        
      })
      .then(()=>{
        setLoading(false);
      })  
            
  }, []);
   
  
 
  if(loading){
    const antIcon = <LoadingOutlined style={{ fontSize: 48}} spin />
    return(<Spin indicator={antIcon} />);
  } else {
    if(!articles){
      return(<div>There is no article available now.</div>)
    } else {
       
    
      return(<>
        <Row gutter={[16,16]} style={{marginLeft:"15px"}}>
          {
            articles && articles.map(({id, title, imageurl, links})=> (
            <Col key={id}>                                          
             <Card title={title} style={{width: 300}}
                   cover={<img alt="example" src={imageurl} />} hoverable
                   actions={[
                    <PostIcon type="like" countLink={links.likes} id={id} />,
                    <Displaycomment    msgLink={links.msg} id={id}/>,
                    <PostIcon type="heart" FavLink={links.fav} id={id}/>
                  
                  ]} 
                   >               
                  <Link to= {`/${id}`}>Details</Link>
                 
                </Card>
                
              </Col>
            ))
          }
        </Row></>
      )
    }
  }
}


export default Article;