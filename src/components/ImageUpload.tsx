import React from 'react';
//import '../App.css';
import 'antd/dist/reset.css';
import { Upload, Button, message, Alert, Typography } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { api } from './common/http-common';
import { CopyOutlined } from '@ant-design/icons';

class ImageUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      uploading: false,
      imgPosted: [],
      isUploadOk: false,
      copied: false,
    };
  }

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('upload', file, file.name);
    });

    this.setState({
      uploading: true,
    });

    let requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    };

    fetch(`${api.uri}/images`, requestOptions)
      .then(response => response.json())
      .then(result => {
        message.success('Upload successfully.');
        this.setState({
          isUploadOk: true,
          imgPosted: result,
        });
      })
      .catch(error => {
        message.error('Upload failed.');
        console.error('Error:', error);
      })
      .finally(() => {
        this.setState({
          uploading: false,
        });
      });
  };

  handleCopy = () => {
    const { imgPosted } = this.state;
    const path = imgPosted.links.path;

    navigator.clipboard.writeText(path)
      .then(() => {
        message.success('Copied to clipboard!');
        this.setState({ copied: true });
      })
      .catch((error) => {
        message.error('Failed to copy to clipboard.');
        console.error('Error:', error);
      });
  };

  render() {
    const { Title } = Typography;
    const { uploading, fileList, isUploadOk, imgPosted, copied } = this.state;
    const props = {
      onRemove: file => {
        this.setState(state => {
          const index = state.fileList.indexOf(file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
      },
      beforeUpload: file => {
        this.setState(state => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <>
        <div>
          <p></p>
          <Title level={3} style={{ color: "#0032b3" }}>Select and Upload Pet Image</Title>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
          <Button
            type="primary"
            onClick={this.handleUpload}
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
              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={this.handleCopy}
                disabled={copied}
                style={{ marginTop: 16 }}
              >
                {copied ? 'Copied!' : 'Copy Path'}
              </Button>
            </div>
          )}
        </div>
      </>
    );
  }
}

export default ImageUpload;