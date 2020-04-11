import React from "react";
import { Collapse } from "antd";

const { Panel } = Collapse;
interface Props {
  panels: {
    title: string;
    content: React.ReactNode;
  }[];
  onClick: (key: string | string[]) => void;
}
const Accordion: React.FC<Props> = (props) => {
  return (
    <Collapse defaultActiveKey={["0"]} accordion onChange={props.onClick}>
      {props.panels.map((p, v) => (
        <Panel key={v} header={p.title}>
          {p.content}
        </Panel>
      ))}
    </Collapse>
  );
};

export default Accordion;
