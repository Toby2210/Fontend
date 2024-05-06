import 'antd/dist/reset.css';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row, Spin } from 'antd';
import { api } from './common/http-common';
import axios from 'axios';
import {LoadingOutlined, CloseSquareOutlined,CloseSquareFilled} from '@ant-design/icons';
import PostIcon from './posticon';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import Displaycomment from './comments';



const FavCard = (props:any) => {
  const [articles, setArticles] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [theme, setTheme] = React.useState('outlined');
  const navigate: NavigateFunction = useNavigate();
  let origin:any=localStorage.getItem('a')
   
 
 React.useEffect(()=>{
  
 // console.log(`path ${api.uri}/articles/fav`)  
  //console.log (`atoken ,Basic ${localStorage.getItem('aToken')}`)         
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `${api.uri}/articles/fav`,
    headers: { 
      'Authorization': `Basic ${localStorage.getItem('aToken')}`
    }
  };
  
  axios.request(config)
  .then((results) => {      
   //console.log(`path ${api.uri}/articles/fav`) 
   //console.log('results.data ', JSON.stringify(results.data))
   //console.log('filterting....')
    let filterArticle = filterPosts(results.data, JSON.parse(origin))
    console.log("filterArticle ", filterArticle)
    setArticles(filterArticle )
    
  })    
    .then(()=>{   
    setLoading(false); })
 },[])
  
  
  console.log('after filter article ',articles)
  
  function getIcon (theme:string) {
    let Icon;
  
    if (theme === 'filled') 
      Icon=CloseSquareFilled
     else
      Icon=CloseSquareOutlined
    return Icon;
  }



  function filterPosts(filterarray:any[], originarray:any[]) 
  { let resArr:any=[];
 
 //  console.log("filterarray.length  ",filterarray.length)
 //  console.log("originarray.length  ",originarray.length)
    for(let i=0; i<filterarray.length;i++)
      for( let j=0; j<originarray.length;j++)
        {
          console.log("articleid,originarray", filterarray[i].articleid, originarray[j].id)
         if(filterarray[i].articleid== originarray[j].id)
          {resArr.push(originarray[j])
          break
          }  
        }
   return resArr 
      }
    
  const handleDelete = (fav:any) => {
  
    setTheme('filled')
// console.log('fav link arr ', fav.links.fav)
// console.log('fav link ', fav)
  axios.delete(fav.links.fav, {
       
        headers: {
            "Authorization": `Basic ${localStorage.getItem('aToken')}`
          }
        }        
    )
      .then((results) =>{ console.log('respone ',JSON.stringify(results.data.message))
        if(results.data.message==="removed")
      {  
          alert("This article is removed from your favorite list")
          navigate("/favpage");
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
  } else {
    if(!articles){
      return(<div>There is no article available now.</div>)
    } else {
       
     
      const Icon = getIcon(theme)
      return(<>
      
        <Row gutter={[16,16]}>
          {
            articles && articles.map(({id, title, alltext, imageurl, links})=> (
            <Col  key={id}>                            
             <Card title={title} style={{width: 300}}
                   cover={<img alt="example" src={imageurl} />} hoverable
                   actions={[
                    <PostIcon type="like" countLink={links.likes} id={id}/>,
                    <Displaycomment    msgLink={links.msg} id={id}/>,
                    <PostIcon type="heart"  />,
                    <Icon onClick={()=>handleDelete({links})}/>
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


export default FavCard;