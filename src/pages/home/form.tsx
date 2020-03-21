import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  Row,
  Typography
} from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router-dom";
import { MapboxSearchFeature, DataToBackend, Center } from "../../interfaces";
import { availableCarsData } from "../../mockingData";
const accessToken = process.env.REACT_APP_MAPBOX_API as string | "noApi";
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

  data.forEach(marca => {
    const item: Option = {
      value: marca.marca,
      label: marca.marca,
      children: []
    };
    if (marca.modelos) {
      marca.modelos.forEach(modelo => {
        const mItem: Option = {
          value: modelo.modelo,
          label: modelo.modelo,
          children: []
        };

        if (modelo.year) {
          modelo.year.forEach(y => {
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

  return parsedData;
};

/**
 * Agrega un debounce para los input de busqueda
 */
function debounce(func: any, wait: any) {
  let timeout: any;
  return function(...args: any) {
    //@ts-ignore
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

interface Props {}
const HomeForm: React.FC<Props> = () => {
  const [cascaderOptions, setCascaderOptions] = useState<Option[]>();
  const [_, setCascaderValue] = useState<string[]>();
  const [formLoading, setFormLoadinge] = useState<boolean>(false);
  // const [redirectToResults, setRedirectToResults] = useState<boolean>(false);
  const [startingPointOptions, setStartingPointOptions] = useState<any>();
  const [destinationOptions, setDestinationsOptions] = useState<any>();
  const [searchingStartingPoint, setSearchingStartingPoint] = useState<boolean>(
    false
  );
  const [searchingDestination, setSearchingDestination] = useState<boolean>(
    false
  );
  const [startingPoint, setStartingPoint] = useState<[number, number]>([0, 0]);
  const [destination, setDestination] = useState<[number, number]>([0, 0]);
  const [routesResult, setRoutesResult] = useState<any>(false);

  useEffect(() => {
    setCascaderOptions(generateCarsData());
  }, []);

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

  /**
   * On Form Validation success
   * @param values
   */
  const onFinish = async (values: any) => {
    setFormLoadinge(true);
    const data: DataToBackend = {
      destination: {
        placeName: values.destination,
        center: destination
      },
      startingPoint: {
        placeName: values.startingPoint,
        center: startingPoint
      },
      car: {
        marca: values.carToUse[0],
        modelo: values.carToUse[1],
        year: {
          year: values.carToUse[2].split(",")[0] as number,
          rendimientoLitro: values.carToUse[2].split(",")[1] as number
        }
      },
      statistics: values.statistics
    };
    generarRutaBackend(data);
  };

  /**
   * Función en la cual se consultará al backend para
   * que genere la mejor ruta.
   */
  const generarRutaBackend = async (values: DataToBackend) => {
    // Por el momento solo se usará la API para consultar las rutas y esas son
    // las que se usarán, cuando se implemente el backend entonces en el back se
    // hará la consulta a la API y se implementará el algoritmo.
    const routes = await tmpGetRoutesFromAPI([
      values.startingPoint.center,
      values.destination.center
    ]);
    setRoutesResult(routes);
  };

  /**
   * Función temporal para "simular" lo que haría el back al momento de regresar rutas.
   * @param coordinates
   */
  const tmpGetRoutesFromAPI = async (
    coordinates: [Center, Center]
  ): Promise<[]> => {
    try {
      const { data } = await axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${encodeURIComponent(
          coordinates.join(";")
        )}?alternatives=true&geometries=geojson&language=es&steps=true&access_token=${accessToken}`
      );
      return data.routes ? data.routes : [];
    } catch (err) {
      return [];
    }
  };

  /**
   * On Form Validation error
   * @param errorInfo
   */
  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  /**
   * Input de búsqueda de punto de partida
   * @param value
   */
  const handleStartingPointChange = async (value: string) => {
    if (value.length > 1) {
      setSearchingStartingPoint(true);
      const features = await searchFromAPI(value);
      setSearchingStartingPoint(false);
      setStartingPointOptions(
        features.map(f => ({ center: f.center, ...renderItem(f.placeName) }))
      );
      console.log("features on starting point", features);
    } else {
      setStartingPointOptions([]);
    }
  };

  const debounceOnChangeStartingPoint = React.useCallback(
    debounce(handleStartingPointChange, 400),
    []
  );

  /**
   * Consulta una dirección en la API y regresa todas las coincidencias
   * @param value
   */
  const searchFromAPI = async (
    value: string
  ): Promise<MapboxSearchFeature[]> => {
    try {
      const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value
        )}.json?access_token=${accessToken}`
      );
      return data.features.map((f: any) => ({
        text: f.text,
        placeName: f.place_name,
        center: f.center
      }));
    } catch (err) {
      return [];
    }
  };

  /**
   * Consultar API para traer
   * @param value
   */
  const handleDestinationChange = async (value: string) => {
    if (value.length > 1) {
      setSearchingDestination(true);
      const features = await searchFromAPI(value);
      setSearchingDestination(false);
      setDestinationsOptions(
        features.map(f => ({ center: f.center, ...renderItem(f.placeName) }))
      );
      console.log("features on destination", features);
    } else {
      setDestinationsOptions([]);
    }
  };

  const debounceOnChangeDestination = React.useCallback(
    debounce(handleDestinationChange, 400),
    []
  );

  /**
   *  Renderiza un resultado de una dirección
   * @param address {string}
   */
  const renderItem = (title: string) => {
    return {
      value: title,
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start"
          }}
        >
          {title}
        </div>
      )
    };
  };

  if (routesResult)
    return (
      <Redirect
        to={{
          pathname: "/results/1",
          state: { routes: routesResult }
        }}
      />
    );

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
              <AutoComplete
                options={startingPointOptions}
                onSelect={(value: any, option: any) =>
                  setStartingPoint(option.center)
                }
              >
                <Input.Search
                  loading={searchingStartingPoint}
                  onSearch={handleStartingPointChange}
                  onChange={e => debounceOnChangeStartingPoint(e.target.value)}
                />
              </AutoComplete>
            </Form.Item>
            <Form.Item
              label="Destino"
              name="destination"
              rules={[{ required: true, message: "Ingresa tu destino" }]}
            >
              <AutoComplete
                options={destinationOptions}
                onSelect={(value: any, option: any) =>
                  setDestination(option.center)
                }
              >
                <Input.Search
                  loading={searchingDestination}
                  onSearch={handleDestinationChange}
                  onChange={e => debounceOnChangeDestination(e.target.value)}
                />
              </AutoComplete>
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
