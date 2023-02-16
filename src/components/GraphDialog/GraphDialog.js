import React, { useEffect, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  useEdgesState,
  useNodesState,
} from "reactflow";
import service from "../../service"; //eslint-disable-line
import { CircularProgress, Dialog, DialogContent } from "@mui/material";
import { useEvent } from "@nucleoidjs/synapses"; //eslint-disable-line

import "reactflow/dist/style.css"; //eslint-disable-line

const initialNodes = [
  { id: "1", data: { label: "-" }, position: { x: 100, y: 100 } },
  { id: "2", data: { label: "Node 2" }, position: { x: 100, y: 200 } },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];
const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const GraphDialog = () => {
  const [event, publish] = useEvent("GRAPH_DIALOG", { open: false });
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [loading, setLoading] = useState(true);

  const [nodeName, setNodeName] = useState("Node 1"); //eslint-disable-line
  const [nodeBg, setNodeBg] = useState("#eee"); //eslint-disable-line
  const [nodeHidden, setNodeHidden] = useState(false); //eslint-disable-line

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "1") {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            label: nodeName,
          };
        }

        return node;
      })
    );
  }, [nodeName, setNodes]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "1") {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.style = { ...node.style, backgroundColor: nodeBg };
        }

        return node;
      })
    );
  }, [nodeBg, setNodes]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "1") {
          // when you update a simple type you can just update the value
          node.hidden = nodeHidden;
        }

        return node;
      })
    );
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === "e1-2") {
          edge.hidden = nodeHidden;
        }

        return edge;
      })
    );
  }, [nodeHidden, setNodes, setEdges]);

  useEffect(() => {
    if (event.open) {
      setLoading(true);
      service
        .getGraph()
        .then((message) => console.log(message))
        .finally(() => setLoading(false));
    }
  }, [event.open]);

  const handleClose = () => {
    publish("GRAPH_DIALOG", { open: false });
  };

  if (event.open) {
    return (
      <Dialog maxWidth={"xl"} open={true} onClose={handleClose}>
        <DialogContent
          sx={{
            width: "80vw",
            height: "90vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!loading && (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              defaultViewport={defaultViewport}
              minZoom={0.2}
              maxZoom={10}
            >
              <Background variant={BackgroundVariant.Dots} />
            </ReactFlow>
          )}
          {loading && <CircularProgress />}
        </DialogContent>
      </Dialog>
    );
  } else {
    return null;
  }
};

export default GraphDialog;
