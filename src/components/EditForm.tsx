import 'antd/dist/reset.css';
import React, { useState } from "react";
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Modal, Typography } from 'antd';
import { EditOutlined, EditFilled } from '@ant-design/icons';
import axios from "axios";
import { api } from './common/http-common';
import { getCurrentUser } from "../services/auth.service";
const { Title } = Typography;
const { TextArea } = Input;
import { Select } from 'antd';
const { Option } = Select;

const postToFacebook = (message) => {
  const accessToken = 'EAAWojYpUNXABO75Es7kUl0tM1WK44HQC6zMZBZCb41cexort7HKOZBSrPX8s0rDMtNJgXl28pJWIn59ECDS2uznXhFdX6ZBYd6p4TIQysQTHSN2lMcTabNtGFKJ7EFDqyRKGcU7VckYecGSEsZCOYSy8VS9YHu9tZC3LX398UVL1cbBu48UnAl7pe3kCa8e7k1';
  const apiEndpoint = `https://graph.facebook.com/me/feed`;

  const postData = {
    message: message,
    access_token: accessToken
  };

  axios.post(apiEndpoint, postData)
    .then(response => {
      console.log('Message posted on Facebook:', response.data);
    })
    .catch(error => {
      console.error('Failed to post message on Facebook:', error);
    });
};

const EditForm: React.FC = (props: any) => {
  let navigate: NavigateFunction = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isShow, setIsShow] = React.useState(false);
  const aa: any = JSON.parse(localStorage.getItem('e') || "{}");
  // console.log("aa  ", aa)
  //console.log('aa.title ',aa.title)
  const contentRules = [
    { validator: (_, value) => value || value === 0 ? Promise.resolve() : Promise.reject('Please input something') }
  ];

  const goToHelper = () => {
    window.open("/breedHelper")
  }

  const handleFormSubmit = (values: any) => {
    const t = values.title;
    const a = values.alltext;
    const s = values.summary;
    const d = values.description;
    const u = values.imageurl;
    const l = values.location;
    const b = values.breed;
    const currentUser = getCurrentUser();

    // console.log('new article '+ t,a,s,d,u,currentUser.id);
    const postArticle = {
      title: t,
      alltext: a,
      summary: s,
      description: d,
      imageurl: u,
      location: l,
      breed: b,
      authorid: currentUser.id
    }

    if (props.isNew == false) {
      console.log(`path: ${api.uri}/articles${props.aid}`)
      axios.put(`${api.uri}/articles/${props.aid}`, postArticle, {
        headers: {
          'Authorization': `Basic ${localStorage.getItem('aToken')}`
        }
      })
        .then((res) => {
          alert("Article updated")
          console.log(res.data);
          localStorage.removeItem("e");
          navigate("/");
          window.location.reload();
        });
    }
    else {
      console.log(`path: ${api.uri}/articles`)
      const message = `In ${l} has a new pet!\nIt's a ${b} named ${t}!\nDescription: ${d}\nSummary: ${s}\nImage: ${u}\n`;
      postToFacebook(message);
      axios.post(`${api.uri}/articles`, postArticle, {
        headers: {
          'Authorization': `Basic ${localStorage.getItem('aToken')}`
        }
      })
        .then((res) => {
          alert("New Article created")
          console.log(res.data);
          navigate("/");
          window.location.reload();
        });
    }
  }
  return (
    <>
      <Button icon={<EditOutlined />} onClick={() => { setIsShow(true) }} />
      <Modal open={isShow} onCancel={() => { setIsShow(false) }} title="Welcome Blogger" footer={[]}>
        <p></p>
        {props.isNew ? (<Title level={3} style={{ color: "#0032b3" }}>Create New Article</Title>) : (<Title level={3} style={{ color: "#0032b3" }}>Update Article</Title>)}
        <Form name="article" onFinish={(values) => handleFormSubmit(values)}>
          <Form.Item name="title" label="Title" rules={contentRules}>
            {props.isNew ? (<Input />) : (<Input defaultValue={!props.isNew && aa.title} />)}
          </Form.Item>
          <Form.Item name="breed" label="Breed" rules={contentRules}>
            {props.isNew ? (<TextArea rows={2} />) : (<TextArea rows={2} defaultValue={!props.isNew && aa.breed} />)}
          </Form.Item>
          <div><button onClick={goToHelper}>Breed Helper</button></div>
          <Form.Item name="alltext" label="About me" rules={contentRules}>
            {props.isNew ? (<TextArea rows={2} />) : (<TextArea rows={2} defaultValue={!props.isNew && aa.alltext} />)}
          </Form.Item>
          <Form.Item name="summary" label="Summary" rules={contentRules}>
            {props.isNew ? (<TextArea rows={2} />) : (<TextArea rows={2} defaultValue={!props.isNew && aa.summary} />)}
          </Form.Item>
          <Form.Item name="description" label="Detail Description" rules={contentRules} >
            {props.isNew ? (<TextArea rows={2} />) : (<TextArea rows={2} defaultValue={!props.isNew && aa.description} />)}
          </Form.Item>
          <Form.Item name="location" label="Pet location" rules={contentRules} >
            <Select defaultValue={!props.isNew && aa.location} style={{ width: 200 }}>
              <Option value="Mong Kok">Mong Kok</Option>
              <Option value="Sha Tin">Sha Tin</Option>
              <Option value="Chai Wan">Chai Wan</Option>
            </Select>
          </Form.Item>
          <Form.Item name="imageurl" label="ImageURL" rules={contentRules} >
            {props.isNew ? (<Input />) : (<Input defaultValue={!props.isNew && aa.imageurl} />)}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};


export default EditForm;
