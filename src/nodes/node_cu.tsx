import { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  Controls,
  Background,
  BackgroundVariant,
  SelectionMode,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../assets/css/style.css';
import Tabbar from './Tabbar.tsx';
import ShowPopup from './ShowPopup.tsx';
import { nanoid } from 'nanoid';
import CustomEdge from './CustomEdge';
import MenuFlow from './MenuFlow';

const initialNodes = [
  {
    key: 'customer-sign',
    id: '1',
    type: 'input',
    data: {
      label: (
        <div className="step">
          <div className="left">
            <img
              src="/src/assets/icons/icon-time.svg"
              width="24px"
              height="24px"
              alt=""
            />
          </div>
          <div className="right">Customer signs up to</div>
        </div>
      ),
    },
    position: { x: 250, y: 100 },
  },
  {
    id: '2',
    key: 'add-node',
    type: 'output',
    data: {
      label: (
        <div className="add-node">
          <i>+</i> <span>Add a journey point</span>
        </div>
      ),
    },
    position: { x: 250, y: 220 },
  },
];

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

const connectEdges = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
];

const NoteFlow = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(connectEdges);
  const [showTabBar, setShowTabBar] = useState(false);
  const [lastNodeId, setLastNodeId] = useState('1');
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedNodeContent, setSelectedNodeContent] = useState('');
  const [addNodeCallback, setAddNodeCallback] = useState(() => () => {});
  const [isTabbarVisible, setIsTabbarVisible] = useState(false);

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
    console.log(node);
    if (node.key === 'add-node') {
      console.log(node);
      // Check if the clicked node is "Add Node"
      setShowTabBar(true);
      setIsTabbarVisible(true);
    } else {
      // Hiển thị popup khi click vào bất kỳ node nào
      const content = nodeContents[node.key]; // Lấy nội dung tương ứng của node
      setSelectedNodeContent(content); // Cập nhật nội dung cho popup
      setShowPopup(true); // Mở popup
    }
  };

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault(); // Ngăn không cho menu chuột phải mặc định hiện ra
    setNodeToDelete(node);
  }, []);

  const handleNodeDelete = () => {
    if (nodeToDelete) {
      setNodes((nds) => nds.filter((node) => node.id !== nodeToDelete.id));
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== nodeToDelete.id && edge.target !== nodeToDelete.id
        )
      );
      setNodeToDelete(null);
    }
  };

  // Function to get a unique y position
  const getUniqueYPosition = (xPosition, baseY, spacing) => {
    const existingYPositions = nodes
      .filter((node) => node.position.x === xPosition)
      .map((node) => node.position.y);

    let newYPosition = baseY;

    while (existingYPositions.includes(newYPosition)) {
      newYPosition += spacing;
    }

    return newYPosition;
  };

  const getNextYPosition = (xPosition, spacing) => {
    const nodesInColumn = nodes.filter((node) => node.position.x === xPosition);
    if (nodesInColumn.length === 0) return 0; // Return 0 if there are no nodes
    const lastNode = nodesInColumn[nodesInColumn.length - 1];
    return lastNode.position.y + spacing;
  };

  const removeEdgesRelatedToNode = (nodeId) => {
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    );
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

  const onDrop = (event) => {
    event.preventDefault();

    const type = JSON.parse(
      event.dataTransfer.getData('application/reactflow')
    );
    const reactFlowBounds = event.target.getBoundingClientRect();
    const position = {
      x: event.clientX - reactFlowBounds.left - 100,
      y: event.clientY - reactFlowBounds.top + 5,
    };

    const newNodeId = nanoid(8);
    // Xử lý add-node với id '2'
    const addNodeId = '2';
    const addNode = nodes.find((node) => node.id === addNodeId);

    // Tìm các edge nối với node có id '2'
    const targetEdge = edges.find(
      (edge) => edge?.source === '2' || edge?.target === '2'
    );
    const targetNodeId =
      targetEdge?.source === '2' ? targetEdge?.target : targetEdge?.source;

    const targetNode = nodes.find((node) => node.id === targetNodeId);

    // Cập nhật vị trí của node mới để cách node đang kết nối 200 đơn vị
    const newNodePosition = {
      x: targetNode?.position.x,
      y: targetNode?.position.y + 110,
    };

    // Tạo node mới
    const newNode = {
      id: newNodeId,
      key: type.key,
      type: type.type || 'default',
      data: {
        label: (
          <div className="step">
            <div className="left">
              <img src={type.icon} width="24px" height="24px" alt="" />
            </div>
            <div className="right">{type.label}</div>
          </div>
        ),
      },
      position: newNodePosition,
    };

    // Loại bỏ các edge liên quan đến node '2'
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== '2' && edge.target !== '2')
    );

    // Kiểm tra điều kiện node là 'ifelse'
    if (type.key === 'ifelse') {
      setNodes((nds) => nds.filter((node) => node.id !== addNodeId));
      const yesNodeId = nanoid(8);
      const noNodeId = nanoid(8);

      // Tạo node Yes
      const yesNode = {
        id: yesNodeId,
        key: 'add-node',
        brand: 'yes',
        data: {
          label: (
            <div className="add-node">
              <i>+</i> <span>Add a journey point</span>
            </div>
          ),
        },
        position: {
          x: newNode.position.x - 200, // Điều chỉnh vị trí của nhánh Yes
          y: newNode.position.y + 150, // Điều chỉnh vị trí của nhánh Yes
        },
      };

      // Tạo node No
      const noNode = {
        id: noNodeId,
        key: 'add-node',
        brand: 'no',
        data: {
          label: (
            <div className="add-node">
              <i>+</i> <span>Add a journey point</span>
            </div>
          ),
        },
        position: {
          x: newNode?.position.x + 200, // Điều chỉnh vị trí của nhánh No
          y: newNode?.position.y + 150, // Điều chỉnh vị trí của nhánh No
        },
      };

      // Tạo các edge nối từ node ifelse đến Yes và No
      const ifelseEdges = [
        {
          id: nanoid(8),
          source: targetNodeId,
          target: newNodeId,
        },
        {
          id: nanoid(8),
          source: newNodeId,
          target: yesNodeId,
          type: 'custom',
          data: {
            label: 'Yes',
          },
        },
        {
          id: nanoid(8),
          source: newNodeId,
          target: noNodeId,
          type: 'custom',
          data: {
            label: 'No',
          },
        },
      ];

      // Thêm node yes, no và edge vào danh sách node và edges
      setNodes((nds) => [...nds, newNode, yesNode, noNode]);
      setEdges((eds) => [...eds, ...ifelseEdges]);
    } else {
      // Nếu không phải 'ifelse', kiểm tra các điều kiện của node bình thường
      if (targetNode) {
        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) => [
          ...eds,
          {
            id: nanoid(8),
            source: targetNodeId,
            target: newNodeId,
          },
          {
            id: nanoid(8),
            source: newNodeId,
            target: '2',
          },
        ]);

        if (addNode) {
          const addNodePosition = {
            x: addNode.position.x,
            y: addNode.position.y + 110,
          };

          setNodes((nds) =>
            nds.map((node) =>
              node.id === addNodeId
                ? { ...node, position: addNodePosition }
                : node
            )
          );

          setEdges((eds) =>
            eds.filter(
              (edge) => edge.source !== addNodeId && edge.target !== addNodeId
            )
          );

          // Thêm edge mới nối add-node và node mới
          setEdges((eds) => [
            ...eds,
            {
              id: nanoid(8),
              source: newNodeId,
              target: addNodeId,
            },
          ]);

          // Kiểm tra nếu node mới là 'contact-exists', ẩn add-node
          if (type.key === 'contact-exists') {
            setNodes((nds) => nds.filter((node) => node.id !== addNodeId));
          }
        }
      } else {
        const newNodeNew = {
          id: newNodeId,
          key: type.key,
          type: type.type || 'default',
          data: {
            label: (
              <div className="step">
                <div className="left">
                  <img src={type.icon} width="24px" height="24px" alt="" />
                </div>
                <div className="right">{type.label}</div>
              </div>
            ),
          },
          position: position,
        };

        setNodes((nds) => [...nds, newNodeNew]);
      }
    }
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

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
    return Math.sqrt(
      Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2)
    );
  };

  // Hàm xử lý khi dừng kéo node
  const onNodeDragStop = useCallback(
    (event, node) => {
      const threshold = 50; // khoảng cách cho phép để node bị "đè"
      let closestNode = null;
      let closestDistance = Infinity;

      nodes.forEach((item) => {
        if (item.id !== node.id) {
          const distance = getDistance(node.position, item.position);
          if (distance < closestDistance && distance <= threshold) {
            closestNode = item;
            closestDistance = distance;
          }
        }
      });

      if (closestNode) {
        // Thay thế node cũ bằng node mới
        const updatedEdges = edges.map((edge) => {
          if (edge.source === closestNode.id) {
            return { ...edge, source: node.id }; // Nối node mới làm source
          }
          if (edge.target === closestNode.id) {
            return { ...edge, target: node.id }; // Nối node mới làm target
          }
          return edge;
        });
        if (node.type != 'output') {
          // Tạo một node mới với nội dung "Add a journey point" ngay dưới node thay thế
          const newNode = {
            id: nanoid(8),
            key: 'add-node',
            brand: node.brand,
            position: {
              x: node.position.x, // Giữ nguyên vị trí x
              y: node.position.y + 100, // Đặt node mới xuống dưới 150 đơn vị y
            },
            data: {
              label: (
                <div className="add-node">
                  <i>+</i> <span>Add a journey point</span>
                </div>
              ),
            },
          };

          // Thay thế node cũ bằng node mới
          setNodes((nds) => [
            ...nds.map((n) =>
              n.id === closestNode.id
                ? { ...closestNode, ...node, position: node.position }
                : n
            ),
            newNode, // Thêm node mới
          ]);

          // Cập nhật edges
          setEdges([
            ...updatedEdges,
            {
              id: nanoid(8), // ID của edge mới
              source: node.id, // Nối từ node vừa thay thế
              target: newNode.id, // Đến node "Add a journey point"
            },
          ]);
        } else {
          // Thay thế node cũ bằng node mới
          setNodes((nds) => [
            ...nds.map((n) =>
              n.id === closestNode.id
                ? { ...closestNode, ...node, position: node.position }
                : n
            ),
          ]);

          // Cập nhật edges
          setEdges(updatedEdges);
        }
      } else {
        // Không có node gần, cập nhật node vào vị trí mới
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id ? { ...n, position: node.position } : n
          )
        );
      }
    },
    [nodes, edges, setNodes, setEdges]
  );

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
            onNodeContextMenu={onNodeContextMenu}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onDrop={onDrop}
            onDragOver={onDragOver}
            panOnScroll
            defaultEdgeOptions={defaultEdgeOptions}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
          >
            <Controls position="right-bottom" />
            <Background variant={BackgroundVariant.Lines} color="#ccccc" />
          </ReactFlow>
          <button>Save</button>
        </div>
      </div>

      {isTabbarVisible && (
        <Tabbar addNode={addNode} closeTabbar={closeTabbar} />
      )}

      {nodeToDelete && (
        <div
          style={{
            position: 'absolute',
            top: nodeToDelete.position.y - 12,
            left: nodeToDelete.position.x + 260,
            zIndex: 10,
          }}
        >
          <button
            onClick={handleNodeDelete}
            style={{
              background: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            X
          </button>
        </div>
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

export default NoteFlow;
