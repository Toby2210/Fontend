import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Col, Row, Spin, Input, Select } from 'antd';
import { api } from './common/http-common';
import axios from 'axios';
import { LoadingOutlined } from '@ant-design/icons';
import PostIcon from './posticon';
import Displaycomment from './comments';

const { Search } = Input;
const { Option } = Select;

const Article = () => {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchField, setSearchField] = useState('title');

  useEffect(() => {
    axios.get(`${api.uri}/articles`)
      .then((res) => {
        setArticles(res.data);
        localStorage.setItem('a', JSON.stringify(res.data))
      })
      .then(() => {
        setLoading(false);
      })
  }, []);

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleFieldChange = (value) => {
    setSearchField(value);
  };

  const filteredArticles = articles && articles.filter((article) =>
    article[searchField].toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
    return <Spin indicator={antIcon} />;
  } else {
    if (!articles) {
      return <div>There is no article available now.</div>;
    } else {
      return (
        <>
          <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
            <Col span={8}>
              <Select defaultValue="title" style={{ width: '100%' }} onChange={handleFieldChange}>
                <Option value="title">Title</Option>
                <Option value="location">Location</Option>
              </Select>
            </Col>
            <Col span={16}>
              <Search
                placeholder="Search articles"
                allowClear
                enterButton="Search"
                size="large"
                onSearch={handleSearch}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginLeft: '15px' }}>
            {filteredArticles.length > 0 ? (
              filteredArticles.map(({ id, title, imageurl, links, location }) => (
                <Col key={id}>
                  <Card
                    title={title}
                    style={{ width: 300 }}
                    cover={<img alt="example" src={imageurl} />}
                    hoverable
                    actions={[
                      <PostIcon type="like" countLink={links.likes} id={id} />,
                      <Displaycomment msgLink={links.msg} id={id} />,
                      <PostIcon type="heart" FavLink={links.fav} id={id} />,
                    ]}
                  >
                    <p>location: {location}</p>
                    <Link to={`/${id}`}>Details</Link>
                  </Card>
                </Col>
              ))
            ) : (
              <div>No articles found.</div>
            )}
          </Row>
        </>
      );
    }
  }
};

export default Article;