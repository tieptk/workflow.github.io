import React, { useMemo } from 'react';
import ReactFlow, { useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  markerEnd,
}) => {
  return (
    <g>
      <path
        id={id}
        className="react-flow__edge-path"
        d={`M${sourceX},${sourceY} C ${sourceX},${sourceY + 50} ${targetX},${
          targetY - 50
        } ${targetX},${targetY}`}
        markerEnd={markerEnd}
        style={{ stroke: 'red', strokeWidth: 2 }}
      />
      <text
        x={(sourceX + targetX) / 2}
        y={(sourceY + targetY) / 2}
        style={{ fill: 'blue' }}
      >
        {data.label}
      </text>
    </g>
  );
};

const initialNodes = [
  {
    id: '1',
    type: 'input',
    position: { x: 250, y: 100 }, // Đảm bảo có x, y
    data: { label: 'Node 1' },
  },
  {
    id: '2',
    type: 'default',
    position: { x: 250, y: 200 }, // Đảm bảo có x, y
    data: { label: 'Node 2' },
  },
];

const initialEdges = [
  {
    id: 'e1-2',
    source: '1', // ID của node nguồn
    target: '2', // ID của node đích
    type: 'custom',
    data: { label: 'Custom Edge' },
  },
];

const Flow = () => {
  const [nodes, setNodes] = useNodesState(initialNodes);
  const [edges, setEdges] = useEdgesState(initialEdges);

  // Sử dụng useMemo để memoize edgeTypes
  const edgeTypes = useMemo(
    () => ({
      custom: CustomEdge,
    }),
    []
  );

  return (
    <div style={{ height: 500 }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={setNodes}
        onEdgesChange={setEdges}
        edgeTypes={edgeTypes}
        fitView
      />
    </div>
  );
};

export default Flow;
