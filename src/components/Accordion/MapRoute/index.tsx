import React from "react";
import { Center } from "../../../interfaces";

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

const MapRouteItem: React.FC<Props> = props => {
  console.log(props);
  return (
    <div>
      {props.steps.map((step: any, k: number) => {
        return (
          <div
            onMouseEnter={() => props.changeOnHover(step.location)}
            onMouseLeave={props.resetOnLeave}
          >
            {step.name}
          </div>
        );
      })}
    </div>
  );
};

export default MapRouteItem;
