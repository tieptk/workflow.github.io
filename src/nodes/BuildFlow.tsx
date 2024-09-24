import React, { useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { ReactFlow, ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../assets/css/style.css';
import imageStart from '../assets/images/ILLO_MiniSpot_2-Paths-v2_1080x1080.png';
import PopupListFlow from '../nodes/popup/PopupListFlow';
import { mainNode } from './data/data';
import NodeFlow from './NodeFlow';

const BuildFlow = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  const [selectedFlow, setSelectedFlow] = useState(null);
  const query = new URLSearchParams(location.search);
  const flowName = query.get('flowName');

  const handleAddStartPointClick = () => {
    setShowPopup(true);
  };

  const hidePopup = () => {
    setShowPopup(false);
  };

  const handleSelectFlow = (flow) => {
    setSelectedFlow(flow); // Lưu flow đã chọn
    hidePopup(); // Ẩn popup sau khi chọn flow

    // Tìm node khớp với flow trong mainNode
    const selectedMainNode = mainNode.find((node) => node.key === flow);

    if (selectedMainNode) {
      // Tạo một node từ mainNode
      const newNode = {
        id: `${selectedMainNode.id}`, // Sử dụng id từ mainNode
        type: 'input',
        data: {
          label: (
            <div className="step">
              <div className="left">
                <img
                  src={selectedMainNode.icon}
                  width="24px"
                  height="24px"
                  alt=""
                />
              </div>
              <div className="right"> {selectedMainNode.name}</div>
            </div>
          ),
        },
        position: { ...selectedMainNode.position }, // Vị trí từ mainNode
      };

      // Tạo node add-node
      const addNode = {
        id: '2',
        key: 'add-node',
        type: 'default',
        data: {
          label: (
            <div className="add-node">
              <i>+</i> <span>Add a journey point</span>
            </div>
          ),
        },
        position: {
          x: selectedMainNode.position.x,
          y: selectedMainNode.position.y + 100,
        },
      };

      // Kết nối giữa node và add-node
      const newEdge = {
        id: `edge-${selectedMainNode.id}-add-node`,
        source: `${selectedMainNode.id}`,
        target: '2',
      };

      // Cập nhật state với node mới, add-node, và edge
      setNodes((nds) => [newNode, addNode]);
      setEdges((eds) => [newEdge]);
    }
  };

  return (
    <>
      {!selectedFlow ? (
        <>
          <ReactFlow />
          <div className="container">
            <h2>Building Flow: {flowName}</h2>

            <div className="content-start">
              <img src={imageStart} className="imageStart" alt="" />
              <h2 className="title">How will a contact start their journey?</h2>
              <p className="note">
                This is what kicks off your contact's journey. You choose the
                starting point, then contacts who meet the criteria will enter
                your map and begin their journey.
              </p>
            </div>
            <button onClick={handleAddStartPointClick} className="btn-start">
              Choose A Starting Point
            </button>

            {showPopup && (
              <PopupListFlow
                onSelectFlow={handleSelectFlow}
                hidePopup={() => setShowPopup(false)}
              />
            )}
          </div>
        </>
      ) : (
        <ReactFlowProvider>
          <NodeFlow initialNodes={nodes} initialEdges={edges} />
        </ReactFlowProvider>
      )}
    </>
  );
};

export default BuildFlow;
