import { useCallback } from "react";
import ReactFlow, {
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css"; //eslint-disable-line

export const initialNodes = [
  {
    id: "1",
    type: "input",
    data: {
      label: "Order Placed",
    },
    position: { x: 150, y: 150 },
    sourcePosition: Position.Right,
    style: {
      background: "rgba(64, 188, 216, 0.5)",
      color: "black",
      width: 80,
      height: 80,
      padding: "20px",
      borderRadius: "50%",
    },
  },
  {
    id: "2",
    data: {
      label: "Intake Calculation",
    },

    position: { x: 400, y: 170 },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  },
  {
    id: "3",
    data: {
      label: "Inventory Allocation",
    },

    position: { x: 600, y: 80 },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  },
  {
    id: "4",
    data: {
      label: "Labelling",
    },

    position: { x: 600, y: 250 },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  },
  {
    id: "5",
    data: {
      label: "Order Processing",
    },

    position: { x: 600, y: 170 },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  },
  {
    id: "6",
    data: {
      label: "Shipment",
    },

    position: { x: 800, y: 170 },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  },
  {
    id: "7",
    type: "output",
    data: {
      label: "Compeleted",
    },
    position: { x: 1050, y: 150 },
    targetPosition: Position.Left,
    style: {
      background: "rgba(22, 219, 147, 0.5)",
      color: "black",
      width: 80,
      height: 80,
      paddingTop: "30px",
      paddingLeft: "8px",
      borderRadius: "50%",
    },
  },
];

export const initialEdges = [
  { id: "e1-2", source: "1", target: "2", label: "call" },
  { id: "e2-3", source: "2", target: "3", animated: true },
  { id: "e2-4", source: "2", target: "4", animated: true },
  { id: "e3-5", source: "2", target: "5", animated: true },
  { id: "e3-6", source: "3", target: "6", animated: true },
  { id: "e4-6", source: "4", target: "6", animated: true },
  { id: "e5-6", source: "5", target: "6", animated: true },
  { id: "e6-7", source: "6", target: "7" },
];

function Flow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
    ></ReactFlow>
  );
}

export default Flow;
