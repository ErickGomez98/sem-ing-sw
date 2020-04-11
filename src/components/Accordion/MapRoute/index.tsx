import React from "react";
import { Center } from "../../../interfaces";
import { Timeline } from "antd";
import {
  CarOutlined,
  EnvironmentOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  RedoOutlined,
} from "@ant-design/icons";
export interface Step {
  name: string;
  type: string;
  modifier: string;
  instruction: string;
  location: Center;
}

interface Props {
  steps: Step[];
  changeOnHover: (location: Center) => void;
  resetOnLeave: () => void;
}

const MapRouteItem: React.FC<Props> = (props) => {
  console.log(props);
  return (
    <Timeline mode="alternate">
      {props.steps.map((step: any, k: number) => {
        let dot;
        let color;
        if (step.type === "depart") {
          dot = <CarOutlined />;
        } else if (step.type === "arrive") {
          dot = <EnvironmentOutlined />;
          color = "green";
        } else if (step.type === "turn") {
          if (step.modifier === "right") {
            dot = <ArrowRightOutlined />;
          } else if (step.modifier === "left") {
            dot = <ArrowLeftOutlined />;
          }
        } else if (step.type === "rotatory" || step.type === "roundabout") {
          dot = <RedoOutlined />;
        } else {
          dot = null;
          color = "blue";
        }

        return (
          <Timeline.Item dot={dot} key={k} color={color}>
            <div
              onMouseEnter={() => props.changeOnHover(step.location)}
              onMouseLeave={props.resetOnLeave}
            >
              {step.instruction}
            </div>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
};

export default MapRouteItem;
