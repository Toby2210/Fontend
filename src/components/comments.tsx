import { Button, List, Tooltip, Space, Input, Modal, Flex, Row, Col } from 'antd';
import { Comment } from '@ant-design/compatible';
import { DeleteOutlined, DeleteFilled, MessageOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getCurrentUser } from '../services/auth.service';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { api } from './common/http-common';

const DisplayComment = (props: any) => {
  const [article_comments, setComments] = useState<any>([]);
  const [isShow, setIsShow] = useState(false);
  const currentUser = getCurrentUser();
  const navigate: NavigateFunction = useNavigate();

  let islogin = false;
  let isAdmin = false;
  let Icon = DeleteOutlined;

  if (currentUser) {
    islogin = true;
    if (currentUser.role === 'admin') isAdmin = true;
  }

  useEffect(() => {
    const msgLink = `${api.uri}/articles/${props.id}/msg`;
    axios
      .get(msgLink)
      .then((res) => {
        setComments(res.data);
        console.log('no of msg ', article_comments.length);
      })
      .catch((err) => {
        console.log('icon error for msg');
      });
  }, []);

  const addComment = (value: string) => {
    if (value !== '') {
      const raw = { messagetxt: value };
      const msgLink = `${api.uri}/articles/${props.id}/msg`;
      axios
        .post(msgLink, raw, {
          headers: {
            Authorization: `Basic ${localStorage.getItem('aToken')}`,
          },
        })
        .then((response) => {
          if (response.data.message === 'added') {
            alert('Comment added');
            navigate('/');
            window.location.reload();
          } else {
            alert('You have already posted a comment');
          }
        })
        .catch((err) => {
          console.log(`${props.msgLink} Check network problems please. ${props.id}`);
          alert('Check network problems');
        });
    }
  };

  const removeComm = (msgtxt: any) => {
    Icon = DeleteFilled;
    const raw = JSON.stringify({ messagetxt: `${msgtxt}` });
    console.log(' msgLink  ', props.msgLink);
    console.log(' raw  ', raw);

    if (raw !== undefined) {
      const msgLink = `${api.uri}/articles/${props.id}/msg`;
      axios
        .delete(msgLink, {
          headers: {
            Authorization: `Basic ${localStorage.getItem('aToken')}`,
          },
          data: { source: raw },
        })
        .then((response) => {
          console.log('msglink ', props.msgLink);
          console.log('response ', JSON.stringify(response.data.message));
          if (response.data.message === 'removed') {
            alert('This article comment is removed by admin');
            navigate('/');
            window.location.reload();
          }
        })
        .catch((err) => {
          console.log(`${props.type} Check network problems please. ${props.id}`);
          alert('Check network problems');
        });
    }
  };

  return (
    <>
      <Modal open={isShow} onCancel={() => setIsShow(false)} title="Comments Page " footer={[]}>
        <List
          className="comment-list"
          itemLayout="horizontal"
          dataSource={article_comments}
          renderItem={(item: any) => (
            <Flex gap="middle" align="center" justify="flex-start">
              <li>
                <Comment author={item.username} content={item.messagetxt} datetime={item.datemodified} />
              </li>
              {isAdmin && <Icon onClick={() => removeComm(item.messagetxt)} />}
            </Flex>
          )}
        />
        <Row gutter={8} align="middle">
          <Col flex="auto">
            <Input
              placeholder="Please login to enter your comments here"
              name="input_msg"
              disabled={!islogin}
              allowClear
              onPressEnter={(event) => addComment(event.target.value)}
            />
          </Col>
          <Col>
            <Button type="primary" onClick={() => addComment(document.getElementsByName('input_msg')[0].value)}>
              Add Comment
            </Button>
          </Col>
        </Row>
      </Modal>
      <Button icon={<MessageOutlined />} onClick={() => setIsShow(true)} />
    </>
  );
};

export default DisplayComment;