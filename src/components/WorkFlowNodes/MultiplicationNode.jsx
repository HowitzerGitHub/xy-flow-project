import React, { memo } from "react";
import { Handle, Position } from "reactflow";

export default memo(function MultiplicationNode(props) {
  return (
    <div className="xyflow__math-node">
      <p className="xyflow__math-node-id">{props.id}</p>
      <p>X</p>
      <Handle type="target" position={Position.Left} id="a" />
      <Handle type="source" position={Position.Right} id="b" />
    </div>
  );
});
