// CustomEdge.js
import React from 'react';
import { getBezierPath } from '@xyflow/react'; // hoặc một hàm tương tự nếu có

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data }) => {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    curvature: 0.5
  });

  return (
    <>
      <defs>
        <marker
          id={`arrowhead-${id}`}
          markerWidth='10'
          markerHeight='7'
          refX='4'
          refY='3'
          orient='auto'
          markerUnits='strokeWidth'
        >
          <polygon points='0 0, 5 3.2, 0 7' fill='#222' />
        </marker>
      </defs>
      <path
        id={id}
        d={path}
        style={{ stroke: '#222', strokeWidth: 1.5, fill: 'transparent' }}
        markerEnd={`url(#arrowhead-${id})`}
      />
      {data?.label1 && data?.label2 ? (
        <>
          <foreignObject
            width={50}
            height={8}
            x={(sourceX + targetX) / 2 - 20}
            y={sourceY - 2}
          >
            <div
              xmlns='http://www.w3.org/1999/xhtml'
              style={{
                background: 'white',
                padding: '3px 5px',
                borderRadius: '0.8px',
                cursor: 'pointer',
                fontSize: '13px',
                border: '1px solid #ddd',
                textAlign: 'center',
                fontWeight: '700'
              }}
            >
              {data.label1}
            </div>
          </foreignObject>
          <foreignObject
            width={90}
            height={30}
            x={(sourceX + targetX) / 2 - 38}
            y={(sourceY + targetY) / 2 - 15}
          >
            <div
              xmlns='http://www.w3.org/1999/xhtml'
              style={{
                background: 'white',
                padding: '5px',
                borderRadius: '0.8px',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              {data.label2}
            </div>
          </foreignObject>
        </>
      ) : (
        <foreignObject
          width={30}
          height={30}
          x={(sourceX + targetX) / 2 - 15}
          y={(sourceY + targetY) / 2 - 15}
        >
          <div
            xmlns='http://www.w3.org/1999/xhtml'
            style={{
              background: '#007c89',
              width: '30px',
              height: '30px',
              lineHeight: '30px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '13px',
              color: 'white',
              textAlign: 'center'
            }}
          >
            {data?.label}
          </div>
        </foreignObject>
      )}
    </>
  );
};

export default CustomEdge;
