import React from "react";
import { Row, Col } from "antd";
interface Props {
  leftComponent: React.ReactNode;
  rightComponent: React.ReactNode;
}
const Layout: React.FC<Props> = ({ leftComponent, rightComponent }) => {
  return (
    <Row style={{ height: "100vh" }}>
      <Col md={12}>{leftComponent}</Col>
      <Col span={12}>{rightComponent}</Col>
    </Row>
  );
};

export default Layout;
