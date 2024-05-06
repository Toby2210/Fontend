import 'antd/dist/reset.css';
import { Row, Col} from 'antd';
import BriefArticle from './BriefArticle'

const Landing = () => {
  return (
    <>
      <Row gutter={[16,16]} style={{marginLeft:"15px"}}>
        <Col span={8}>
          <BriefArticle />
        </Col>
        <Col span={8}>
          <BriefArticle />
        </Col>
        <Col span={8}>
          <BriefArticle />
        </Col>
      </Row>
    </>
  )
}

export default Landing;