import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  Form,
  Input,
  Cascader,
  Checkbox,
  Button
} from "antd";
import { availableCarsData } from "../../mockingData";
import { Redirect } from "react-router-dom";

const { Title } = Typography;

interface Option {
  value: string;
  label?: React.ReactNode;
  disabled?: boolean;
  children?: Option[];
}

/**
 * Función para "parsear" la información de los automoviles para poder
 * mostrarlo en el input cascader
 */
const generateCarsData = () => {
  const data = availableCarsData;
  const parsedData: Option[] = [];

  data.map(marca => {
    const item: Option = {
      value: marca.marca,
      label: marca.marca,
      children: []
    };
    if (marca.modelos) {
      marca.modelos.map(modelo => {
        const mItem: Option = {
          value: modelo.modelo,
          label: modelo.modelo,
          children: []
        };

        if (modelo.year) {
          modelo.year.map(y => {
            if (mItem.children)
              mItem.children.push({
                value: y.year.toString() + "," + y.rendimientoLitro.toString(),
                label: y.year.toString()
              });
          });
        }
        if (item.children) item.children.push(mItem);
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
  const [cascaderValue, setCascaderValue] = useState();
  const [formLoading, setFormLoadinge] = useState<boolean>(false);
  const [redirectToResults, setRedirectToResults] = useState<boolean>(false);

  useEffect(() => {
    setCascaderOptions(generateCarsData());
  }, []);

  useEffect(() => {
    console.log(cascaderValue);
  }, [cascaderValue]);

  /**
   * Función para renderizar el contenido de la opción seleccionada del cascader
   * @param labels
   * @param selectedOptions
   */
  const displayRender = (labels: any, selectedOptions: any) =>
    labels.map((label: any, i: any) => {
      const option = selectedOptions[i];
      console.log("option", option);
      if (i === labels.length - 1) {
        return (
          <span key={option.value}>
            {label} <b> ({option.value.split(",")[1]} km/l )</b>
          </span>
        );
      }
      return <span key={option.value}>{label} / </span>;
    });

  const onFinish = (values: any) => {
    setFormLoadinge(true);
    setTimeout(() => {
      setRedirectToResults(true);
    }, 2500);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  if (redirectToResults) return <Redirect to="/results/1" />;

  return (
    <>
      <Row className="homeForm" justify="space-around" align="middle">
        <Col span={12}>
          <div style={{ textAlign: "center" }}>
            <Title>MI APLICACIÓN</Title>
            <p className="secondaryText">
              Busca rutas optimizando el consumo de combustible
            </p>
          </div>
          <Form
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
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
              label="Vehículo a utilizar"
              name="carToUse"
              rules={[
                { required: true, message: "Selecciona el vehículo a utilizar" }
              ]}
            >
              <Cascader
                options={cascaderOptions}
                onChange={value => setCascaderValue(value)}
                placeholder="Selecciona el vehículo a utilizar"
                displayRender={displayRender}
              />
            </Form.Item>
            <Form.Item name="statistics" valuePropName="checked">
              <Checkbox>Compartir Estadísticas</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={formLoading}
              >
                Buscar
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default HomeForm;
