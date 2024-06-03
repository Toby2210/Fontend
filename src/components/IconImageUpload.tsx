import React, { useState } from 'react';
import { Upload, Button, message, Alert, Typography } from 'antd';
import { UploadOutlined, CopyOutlined } from '@ant-design/icons';
import { api } from './common/http-common';
import axios from 'axios';
import { getCurrentUser } from "../services/auth.service";
import { NavigateFunction, useNavigate } from 'react-router-dom';


const IconImageUpload = () => {
  const { Title } = Typography;
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [imgPosted, setImgPosted] = useState([]);
  const [isUploadOk, setIsUploadOk] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('upload', file, file.name);
    });

    setUploading(true);

    let requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    };

    fetch(`${api.uri}/images`, requestOptions)
      .then(response => response.json())
      .then(result => {
        handleDatabase();
        message.success('Upload successfully.');
        setIsUploadOk(true);
        setImgPosted(result);
      })
      .catch(error => {
        message.error('Upload failed.');
        console.error('Error:', error);
      })
      .finally(() => {
        setUploading(false);

      });




  };
  const handleDatabase = (path) => {
    const currentUser = getCurrentUser();
    const newIcon = {
      avatarurl: path
    };
    
    console.log(newIcon)
    axios.put(`${api.uri}/users/${currentUser.id}`, newIcon, {
      headers: {
        'Authorization': `Basic ${localStorage.getItem('aToken')}`
      }
    }).then((res) => {
      console.log(res.data);
      Alert(`The avatar will be updated in next login`)
      
    }).catch((error) => {
        console.error('Error:', error);
      });
  }

  const handleCopy = () => {
    const path = imgPosted.links.path;

    navigator.clipboard
      .writeText(path)
      .then(() => {
        message.success('Copied to clipboard!');
        setCopied(true);
      })
      .catch(error => {
        message.error('Failed to copy to clipboard.');
        console.error('Error:', error);
      });
  };

  const props = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      setFileList([...fileList, file]);
      return false;
    },
    //fileList,
  };

  return (
    <>
      <div>
        <p></p>
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <Button
          type="primary"
          onClick={handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
        {isUploadOk && (
          <div>
            <p style={{ color: 'red' }}>Image uploaded successfully: </p>
            <Alert message={imgPosted.links.path} type="success" />
            {handleDatabase(imgPosted.links.path)}
          </div>
        )}
      </div>
    </>
  );
};

export default IconImageUpload;