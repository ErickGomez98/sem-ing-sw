import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Form, Input, Cascader } from "antd";
import { availableCarsData } from "../../mockingData";

const { Title } = Typography;
const options = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake"
          }
        ]
      }
    ]
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men"
          }
        ]
      }
    ]
  }
];

const generateCarsData = () => {
  const data = availableCarsData;
  const parsedData: any = [];

  data.map(marca => {
    const item: { value: string; label: string; children?: undefined | any } = {
      value: marca.marca,
      label: marca.marca.toLowerCase(),
      children: []
    };
    if (marca.modelos) {
      marca.modelos.map(modelo => {
        const mItem: {
          value: string;
          label: string;
          children?: undefined | any;
        } = {
          value: modelo.modelo,
          label: modelo.modelo.toLowerCase(),
          children: []
        };

        if (modelo.year) {
          modelo.year.map(y => mItem.children.push({ value: y, label: y }));
        }
        item.children.push(mItem);
      });
    }
    parsedData.push(item);
  });

  console.log(parsedData);
  return parsedData;
};

interface Props {}
const HomeForm: React.FC<Props> = () => {
  const [cascaderOptions, setCascaderOptions] = useState();

  useEffect(() => {
    setCascaderOptions(generateCarsData());
  }, []);

  return (
    <>
      <Row className="homeForm" justify="space-around" align="middle">
        <Col span={12}>
          <div>
            <Title>MI APLICACIÓN</Title>
            <p className="secondaryText">
              Busca rutas optimizando el consumo de combustible
            </p>
          </div>
          <Form labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
            <Form.Item
              label="Punto de Partida"
              name="startingPoint"
              rules={[
                { required: true, message: "Ingresa tu punto de partida" }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Destino"
              name="destination"
              rules={[{ required: true, message: "Ingresa tu destino" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Destino"
              name="destination"
              rules={[{ required: true, message: "Ingresa tu destino" }]}
            >
              <Cascader options={cascaderOptions} />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default HomeForm;
