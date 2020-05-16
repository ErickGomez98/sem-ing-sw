import React, { useState, useEffect } from "react";
import { Row, Col, Menu } from "antd";
import { Link } from "react-router-dom";
interface Props {
  leftComponent: React.ReactNode;
  rightComponent: React.ReactNode;
}
const Layout: React.FC<Props> = ({ leftComponent, rightComponent }) => {
  const [selectedKey, setSelectedKey] = useState<string>("home");

  useEffect(() => {
    if (
      window.location.pathname === "/statistics" ||
      window.location.pathname === "/statistics/"
    ) {
      setSelectedKey("statistics");
    } else if (window.location.pathname === "/") {
      setSelectedKey("home");
    } else {
      setSelectedKey("");
    }
  }, []);

  return (
    <Row style={{ height: "100vh" }}>
      <Col md={12}>{leftComponent}</Col>
      <Col xs={24} md={12} style={{ overflowY: "auto", height: "100vh" }}>
        <Menu
          mode="horizontal"
          className="menu-fixed"
          selectedKeys={[selectedKey]}
        >
          <Menu.Item key="home">
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item key="statistics">
            {" "}
            <Link to="/statistics">Estadísticas</Link>
          </Menu.Item>
        </Menu>
        {rightComponent}
      </Col>
    </Row>
  );
};

export default Layout;
