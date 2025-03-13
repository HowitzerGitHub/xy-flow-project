import React, { useState, useCallback, useEffect } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "reactflow";
import "reactflow/dist/style.css";
import "./WorkflowBuilder.css";
import { Sidebar } from "./components/sidebar/Sidebar";
import AdditionNode from "./components/WorkFlowNodes/AdditionNode";
import SubstractionNode from "./components/WorkFlowNodes/SubstractionNode";
import DivisionNode from "./components/WorkFlowNodes/DivisionNode";
import ModulasNode from "./components/WorkFlowNodes/ModulasNode";
import MultiplicationNode from "./components/WorkFlowNodes/MultiplicationNode";
import ValueNode from "./components/WorkFlowNodes/ValueNode";
import NodeTypes from "./components/sidebar/NodeTypes.json";
import { toast } from "react-toastify";
import EvaluatedAnswers from "./components/EvaluatedAnswers";

import { findIndividualChainCalculation } from "./utils/utils";

const initialNodes = [];

const initialEdges = [];

const nodeTypes = {
  additionNode: AdditionNode,
  substractionNode: SubstractionNode,
  divisionNode: DivisionNode,
  modulasNode: ModulasNode,
  multiplicationNode: MultiplicationNode,
  valueNode: ValueNode,
};

const WorkflowBuilder = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [calculations, setCalculations] = useState([]);

  function handleValueUpdate(id, value) {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, value: value } }
          : node
      )
    );
  }

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  const onConnect = useCallback(
    (connection) => {
      const source = nodes.find((node) => node.id === connection.source);
      const target = nodes.find((node) => node.id === connection.target);
      const sourceOperatorType = source.data.operatorType;
      const targetOperatorType = target.data.operatorType;
      if (targetOperatorType === sourceOperatorType) {
        toast(
          `Node ${source.id} of type ${sourceOperatorType} cannot be the source of Node ${target.id} type ${targetOperatorType}`
        );
        return;
      }
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [nodes]
  );

  useEffect(() => {
    const calculations = findIndividualChainCalculation(edges, nodes);
    setCalculations(calculations);
  }, [nodes, edges]);

  const addNode = (type) => {
    const nodeMetaData = NodeTypes.find((node) => node.type === type);

    const newNode = {
      id: `${nodes.length + 1}`,
      type,
      data: { label: type, ...nodeMetaData },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
    };

    if (type === "valueNode") {
      newNode.data.handleValueUpdate = handleValueUpdate;
      newNode.data.value = 0;
    }

    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="workflow-container">
      <EvaluatedAnswers calculations={calculations}></EvaluatedAnswers>
      <Sidebar addNode={addNode} />
      <div className="workflow-area">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes}
        >
          <MiniMap className="minimap" />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
    </div>
  );
};

export default WorkflowBuilder;
