import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  Controls,
  Background,
  BackgroundVariant,
  MarkerType,
  useReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../assets/css/style.css';
import Tabbar from './Tabbar.tsx';
import ShowPopup from './ShowPopup.tsx';
import { nanoid } from 'nanoid';
import CustomEdge from './CustomEdge';
import MenuFlow from './MenuFlow';

// Nội dung cho mỗi node
const nodeContents = {
  'send-email': `
    <label for="email-subject">Subject:</label>
    <input type="text" id="email-subject" name="email-subject" placeholder="Enter subject">
    <label for="email-body">Body:</label>
    <textarea id="email-body" name="email-body" rows="4" placeholder="Enter email body"></textarea>
  `,
  'customer-sign': `
    <label for="customer-name">Customer Name:</label>
    <input type="text" id="customer-name" name="customer-name" placeholder="Enter customer name">
    <label for="customer-email">Customer Email:</label>
    <input type="email" id="customer-email" name="customer-email" placeholder="Enter customer email">
  `,
  ifelse: `
    <label for="reply-status">Reply Status:</label>
    <select id="reply-status" name="reply-status">
      <option value="replied">Replied</option>
      <option value="not-replied">Not Replied</option>
    </select>
  `,
  'contact-exists': `
    <label for="contact-id">Contact ID:</label>
    <input type="text" id="contact-id" name="contact-id" placeholder="Enter contact ID">
  `,
  'send-survey': `
    <label for="survey-question">Survey Question:</label>
    <input type="text" id="survey-question" name="survey-question" placeholder="Enter survey question">
    <label for="survey-options">Options (comma-separated):</label>
    <input type="text" id="survey-options" name="survey-options" placeholder="Option 1, Option 2, ...">
  `,
};

const NodeFlow = ({ initialNodes, initialEdges }) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [showTabBar, setShowTabBar] = useState(false);
  const [lastNodeId, setLastNodeId] = useState(nodes[0].id);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNodeContent, setSelectedNodeContent] = useState('');
  const [addNodeCallback, setAddNodeCallback] = useState(() => () => {});
  const [isTabbarVisible, setIsTabbarVisible] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  const [showActions, setShowActions] = useState(null);

  const handleAddNoteClick = () => {
    setShowTabBar(true);
    setIsTabbarVisible(true);
    setAddNodeCallback(() => (selectedNode) => {
      addNodeBetween(selectedNode, sourceId, targetId);
    });
  };
  const closeTabbar = () => {
    setIsTabbarVisible(false); // Ẩn tabbar khi click close
  };

  const onNodeClick = (event, node) => {
    if (node.key === 'add-node') {
      // Check if the clicked node is "Add Node"
      setShowTabBar(true);
      setIsTabbarVisible(true);
    }
  };

  const getNextYPosition = (xPosition, spacing) => {
    const nodesInColumn = nodes.filter((node) => node.position.x === xPosition);
    if (nodesInColumn.length === 0) return 0; // Return 0 if there are no nodes

    const lastNode = nodesInColumn[nodesInColumn.length - 1];
    return lastNode.position.y + spacing;
  };

  const addNode = (option) => {
    const newNodeId = nanoid(8); // Generate a unique ID for the new node
    const addNoteNode = nodes.find((node) => node.key === 'add-node');
    const initialX = addNoteNode?.position.x;

    const nextY =
      nodes.length > 2
        ? getNextYPosition(initialX, 120)
        : addNoteNode?.position.y;

    // Remove existing edges from addNoteNode
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== '2' && edge.target !== '2')
    );

    if (option.id === '4') {
      const repliedNode = {
        id: newNodeId,
        key: option.key,
        data: { label: option.htmlNode },
        position: { x: initialX, y: nextY },
      };

      const yesNode = {
        id: nanoid(8),
        type: 'output',
        key: 'contact-exists',
        data: {
          label: (
            <div className="step">
              <div className="left">
                <img
                  src="/src/assets/icons/icon-check.svg"
                  width="24px"
                  height="24px"
                  alt=""
                />
              </div>
              <div className="right">Contact Exists</div>
            </div>
          ),
        },
        position: { x: initialX - 150, y: nextY + 150 },
      };

      const noNode = {
        id: nanoid(8),
        type: '',
        key: 'send-survey',
        data: {
          label: (
            <div className="step">
              <div className="left">
                <img
                  src="/src/assets/icons/icon-list.svg"
                  width="24px"
                  height="24px"
                  alt=""
                />
              </div>
              <div className="right">Send survey</div>
            </div>
          ),
        },
        position: { x: initialX + 150, y: nextY + 150 },
      };

      // Di chuyển node add-note sang nhánh no
      setNodes((nds) =>
        nds.map((node) =>
          node.id === '2'
            ? {
                ...node,
                position: {
                  x: noNode.position.x,
                  y: noNode.position.y + 150,
                },
              }
            : node
        )
      );

      // Thêm các node mới (replied, yes, no)
      setNodes((nds) => [...nds, repliedNode, yesNode, noNode]);

      // Kết nối các edges giữa các node
      setEdges((eds) => [
        ...eds,
        {
          id: nanoid(8),
          source: repliedNode.id,
          target: yesNode.id,
          label: 'yes',
        },
        {
          id: nanoid(8),
          source: repliedNode.id,
          target: noNode.id,
          label: 'no',
        },
        { id: nanoid(8), source: lastNodeId, target: repliedNode.id },
        { id: nanoid(8), source: noNode.id, target: addNoteNode.id },
      ]);

      setLastNodeId(noNode.id);
    } else {
      // Add new node logic
      if (addNoteNode) {
        const initialX = addNoteNode.position.x;
        setNodes((nds) =>
          nds.map((node) =>
            node.key === 'add-node'
              ? {
                  ...node,
                  position: {
                    x: initialX,
                    y: nextY + 130,
                  },
                }
              : node
          )
        );
      }
      const newNode = {
        id: newNodeId,
        key: option.key,
        data: { label: option.htmlNode },
        position: {
          x: initialX,
          y: nodes.length > 2 ? nextY : addNoteNode.position.y,
        },
      };

      const newEdge = {
        id: nanoid(8),
        source: lastNodeId,
        target: newNodeId,
        // data: {
        //   label: <div onClick={handleAddNoteClick}>+</div>,
        //   onClick: handleAddNoteClick
        // }
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [
        ...eds,
        newEdge,
        { id: nanoid(8), source: newNodeId, target: addNoteNode.id },
      ]);

      // setEdges((eds) => [
      //   ...eds,
      //   {
      //     id: nanoid(8),
      //     source: lastNodeId,
      //     data: {
      //       label: <div onClick={handleAddNoteClick}>Add Note</div>, // Use HTML or React component
      //       onClick: handleAddNoteClick
      //     },
      //     target: newNodeId
      //   },
      //   { id: nanoid(8), source: newNodeId, target: addNoteNode.id }
      // ]);

      // Cuộn tới node mới thêm
      setLastNodeId(newNodeId);
    }

    setShowTabBar(false);
  };

  const hidePopup = () => {
    setShowPopup(false);
  };

  const addPopup = (node) => {
    const content = nodeContents[node.id]; // Lấy nội dung từ nodeContents dựa trên ID node
    setSelectedNodeContent(content); // Cập nhật nội dung được chọn
  };

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault();

    const type = JSON.parse(
      event.dataTransfer.getData('application/reactflow')
    );
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    const newNodeId = nanoid(8);
    const addNodeId = '2';
    const addNode = nodes.find((node) => node.id === addNodeId);
    const targetEdge = edges.find(
      (edge) => edge?.source === '2' || edge?.target === '2'
    );
    const targetNodeId =
      targetEdge?.source === '2' ? targetEdge?.target : targetEdge?.source;
    const targetNode = nodes.find((node) => node.id === targetNodeId);

    const newNodePosition = targetNode
      ? { x: targetNode.position.x, y: targetNode.position.y + 110 }
      : position;

    const createNewNode = (
      nodeId: string,
      nodePosition: any,
      nodeLabel: JSX.Element
    ) => ({
      id: nodeId,
      key: type.key,
      type: type.type || 'default',
      data: { label: nodeLabel },
      position: nodePosition,
    });

    const newNode = createNewNode(
      newNodeId,
      newNodePosition,
      <div className="custom-node">
        <div className="step">
          <div className="left">
            <img src={type.icon} width="24px" height="24px" alt="" />
          </div>
          <div className="right">{type.label}</div>
        </div>
        <div className="manageStep">
          <button className="btn-show" onClick={() => toggleActions(newNodeId)}>
            <img
              src="/src/assets/icons/icon-wink.svg"
              width="20px"
              height="20px"
              alt="wink"
            />
          </button>

          <div className={`actions actions-${newNodeId}`}>
            <button
              onClick={() => handleEditNode(newNodeId)}
              className="btn-edit"
            >
              Sửa
            </button>
            <button
              onClick={() => handleDeleteNode(newNodeId)}
              className="btn-remove"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    );

    setEdges((eds) =>
      eds.filter((edge) => edge.source !== '2' && edge.target !== '2')
    );

    if (type.key === 'ifelse') {
      const yesNodeId = nanoid(8);
      const noNodeId = nanoid(8);

      const createBranchNode = (id: string, xOffset: number) => ({
        id,
        key: 'add-node',
        data: {
          label: (
            <div className="add-node">
              <i>+</i> <span>Add a journey point</span>
            </div>
          ),
        },
        position: {
          x: newNode.position.x + xOffset,
          y: newNode.position.y + 150,
        },
      });

      const yesNode = createBranchNode(yesNodeId, -200);
      const noNode = createBranchNode(noNodeId, 200);

      const ifelseEdges = [
        { id: nanoid(8), source: targetNodeId, target: newNodeId },
        {
          id: nanoid(8),
          source: newNodeId,
          target: yesNodeId,
          type: 'custom',
          data: { label: 'Yes' },
        },
        {
          id: nanoid(8),
          source: newNodeId,
          target: noNodeId,
          type: 'custom',
          data: { label: 'No' },
        },
      ];

      setNodes((nds) => [
        ...nds.filter((node) => node.id !== addNodeId),
        newNode,
        yesNode,
        noNode,
      ]);
      setEdges((eds) => [...eds, ...ifelseEdges]);
    } else {
      if (targetNode) {
        const updatedEdges = [
          { id: nanoid(8), source: targetNodeId, target: newNodeId },
          { id: nanoid(8), source: newNodeId, target: '2' },
        ];

        // Cập nhật nodes
        setNodes((nds) => {
          const updatedNodes = [...nds, newNode];

          if (addNode) {
            // Tính toán vị trí cho addNode nằm dưới newNode
            const addNodePosition = {
              x: newNode.position.x,
              y: newNode.position.y + 110, // Đặt add-node dưới newNode
            };

            // Cập nhật vị trí của addNode
            const addNodeUpdated = updatedNodes.map((node) =>
              node.id === addNodeId
                ? { ...node, position: addNodePosition }
                : node
            );

            // Đảm bảo rằng add-node nằm dưới newNode
            return addNodeUpdated.sort((a, b) => {
              if (a.id === newNodeId) return -1; // Đặt newNode lên trước
              if (b.id === newNodeId) return 1; // Đặt addNode xuống dưới
              return 0; // Giữ nguyên thứ tự cho các node khác
            });
          }

          return updatedNodes;
        });

        // Cập nhật edges
        setEdges((eds) => [...eds, ...updatedEdges]);

        if (addNode && type.key === 'contact-exists') {
          // Nếu key là 'contact-exists', xóa addNode
          setNodes((nds) => nds.filter((node) => node.id !== addNodeId));
        }
      } else {
        const newNodeNew = createNewNode(
          newNodeId,
          position,
          newNode.data.label
        );
        let closestNode = null;
        let closestDistance = Infinity;
        const threshold = 150;

        nodes.forEach((node) => {
          const distance = getDistance(newNodeNew.position, node.position);
          if (distance < closestDistance && distance <= threshold) {
            closestDistance = distance;
            closestNode = node;
          }
        });

        if (closestNode) {
          const updatedEdges = edges.map((edge) => {
            if (edge.source === closestNode.id)
              return { ...edge, source: newNodeNew.id };
            if (edge.target === closestNode.id)
              return { ...edge, target: newNodeNew.id };
            return edge;
          });

          if (newNodeNew.type !== 'output') {
            const addNodeNew = createNewNode(
              nanoid(8),
              { x: closestNode.position.x, y: closestNode.position.y + 100 },
              <div className="add-node">
                <i>+</i> <span>Add a journey point</span>
              </div>
            );

            setNodes((nds) => [
              ...nds.map((n) =>
                n.id === closestNode.id
                  ? { ...newNodeNew, position: closestNode.position }
                  : n
              ),
              addNodeNew,
            ]);
            setEdges([
              ...updatedEdges,
              { id: nanoid(8), source: newNodeNew.id, target: addNodeNew.id },
            ]);
          } else {
            setNodes((nds) => [
              ...nds.map((n) =>
                n.id === closestNode.id
                  ? { ...newNodeNew, position: closestNode.position }
                  : n
              ),
            ]);
            setEdges(updatedEdges);
          }
        } else {
          setNodes((nds) => [...nds, newNodeNew]);
        }
      }
    }

    console.log('Updated nodes:', nodes);
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const defaultEdgeOptions = {
    style: { strokeWidth: 1.5, stroke: 'black' },
    type: 'floating',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: 'black',
    },
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Hàm tính khoảng cách giữa hai node
  const getDistance = (pos1, pos2) => {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const toggleActions = (nodeId: string) => {
    setShowActions((prev) => (prev === nodeId ? null : nodeId));
    const actionsElement = document.querySelector(`.actions-${nodeId}`);
    if (actionsElement) {
      // Toggle class 'show' cho phần tử actions
      actionsElement.classList.toggle('staticNode');
    }
  };

  // Hàm xóa node
  const handleDeleteNode = useCallback(
    (nodeId) => {
      // Tìm tất cả các edges có nodeId là source hoặc target
      const connectedEdges = edges.filter(
        (edge) => edge.source === nodeId || edge.target === nodeId
      );

      console.log(connectedEdges);

      // Lấy các nodes đang nối với node bị xóa
      const sourceNode = connectedEdges.find(
        (edge) => edge.target === nodeId
      )?.source;
      const targetNode = connectedEdges.find(
        (edge) => edge.source === nodeId
      )?.target;

      // Cập nhật nodes: xóa node bị xóa
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));

      // Cập nhật edges: xóa các cạnh kết nối với node bị xóa
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );

      // Nếu có cả sourceNode và targetNode, tạo một edge mới nối 2 node này
      if (sourceNode && targetNode) {
        setEdges((eds) => [
          ...eds,
          {
            id: `new-edge-${sourceNode}-${targetNode}`,
            source: sourceNode,
            target: targetNode,
          },
        ]);
      }
    },
    [edges, setNodes, setEdges]
  );

  // Hàm sửa node
  const handleEditNode = (nodeId: string) => {
    // Logic chỉnh sửa node
    alert(`Sửa node: ${nodeId}`);
  };

  return (
    <div style={{ overflowY: 'auto', position: 'relative' }}>
      <div className="flex-flow">
        <MenuFlow />
        <div className="panelContainer">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            edgeTypes={{ custom: CustomEdge }}
            onNodeClick={onNodeClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            panOnScroll
            defaultEdgeOptions={defaultEdgeOptions}
            onConnect={onConnect}
          >
            <Controls position="right-bottom" />
            <Background variant={BackgroundVariant.Lines} color="#ccccc" />
          </ReactFlow>
        </div>
      </div>

      {isTabbarVisible && (
        <Tabbar addNode={addNode} closeTabbar={closeTabbar} />
      )}

      {showPopup && (
        <ShowPopup
          selectedNodeContent={selectedNodeContent}
          hidePopup={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default NodeFlow;
