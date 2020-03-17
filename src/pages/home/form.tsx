import React from "react";
import { Row, Col, Typography } from "antd";
interface Props {}

const { Title } = Typography;

const HomeForm: React.FC<Props> = () => {
  return (
    <>
      <Row className="homeForm" justify="space-around" align="middle">
        <Col span={12}>
          <Title>MI APLICACIÓN</Title>
          <p className="secondaryText">
            Busca rutas optimizando el consumo de combustible
          </p>
        </Col>
      </Row>
    </>
  );
};

export default HomeForm;
