import { useState, useCallback } from 'react';
import { FiUser, FiMail, FiCheckCircle, FiList } from 'react-icons/fi';
import { addEdge } from '@xyflow/react';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    key: 'customer-signs',
    data: {
      label: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <FiUser style={{ marginRight: 5 }} />
          <span>Customer signs up for product updates</span>
        </div>
      )
    },
    position: { x: 250, y: 100 }
  },
  {
    id: '2',
    data: { label: 'Add Note' },
    position: { x: 250, y: 250 }
  }
];
// nội dung tabbar
const tabBarOptions = [
  {
    key: 'customer-sign',
    label: 'Send email',
    id: '3',
    type: '',
    html: (
      <>
        <img
          src='/src/assets/icons/icon-email.svg'
          width='24px'
          height='24px'
          alt=''
        />
        <span>Email</span>
      </>
    ),
    htmlNode: (
      <div className='step'>
        <div className='left'>
          <img
            src='/src/assets/icons/icon-email.svg'
            width='24px'
            height='24px'
            alt=''
          />
        </div>
        <div className='right'>Send email</div>
      </div>
    ),
    position: { x: 400, y: 0 }
  },
  {
    key: 'ifelse',
    label: 'Replied to conversation?',
    id: '4',
    type: '',
    html: (
      <>
        <img
          src='/src/assets/icons/icon-if.svg'
          width='24px'
          height='24px'
          alt=''
        />
        <span>Replied to conversation?</span>
      </>
    ),
    htmlNode: (
      <div className='step'>
        <div className='left'>
          <img
            src='/src/assets/icons/icon-if.svg'
            width='24px'
            height='24px'
            alt=''
          />
        </div>
        <div className='right'>Replied to conversation?</div>
      </div>
    ),
    position: { x: 400, y: 290 }
  },
  {
    key: 'send-survey',
    branchKey: 'no',
    label: 'Send survey',
    id: '5',
    type: 'output',
    html: (
      <>
        <img
          src='/src/assets/icons/icon-list.svg'
          width='24px'
          height='24px'
          alt=''
        />
        <span>Send survey</span>
      </>
    ),
    htmlNode: (
      <div className='step'>
        <div className='left'>
          <img
            src='/src/assets/icons/icon-list.svg'
            width='24px'
            height='24px'
            alt=''
          />
        </div>
        <div className='right'>Send survey</div>
      </div>
    ),
    position: { x: 400, y: 400 }
  },
  {
    key: 'contact-exists',
    branchKey: 'yes',
    label: 'Contact Exists',
    id: '6',
    type: 'output',
    html: (
      <>
        <img
          src='/src/assets/icons/icon-check.svg'
          width='24px'
          height='24px'
          alt=''
        />
        <span>Contact Exists</span>
      </>
    ),
    htmlNode: (
      <div className='step'>
        <div className='left'>
          <img
            src='/src/assets/icons/icon-check.svg'
            width='24px'
            height='24px'
            alt=''
          />
        </div>
        <div className='right'>Contact Exists</div>
      </div>
    ),
    position: { x: 400, y: 400 }
  }
];

const Tabbar = ({ addNode, closeTabbar }) => {
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const handleTabClick = (option) => {
    addNode(option);
    // Cập nhật selectedNodeId với ID của node được chọn
    setSelectedNodeId(option.id);
    closeTabbar();
  };

  return (
    <>
      <div className='PopupTabBar'>
        <div className='header-tab'>
          <div className='close-tabbar' onClick={closeTabbar}>
            ✖
          </div>
        </div>
        <h3 className='tittle'>Action</h3>
        <div className='itemTab grid'>
          {tabBarOptions.map((option) => (
            <div
              className='items'
              key={option.id}
              onClick={() => handleTabClick(option)}
            >
              {option.html}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Tabbar;
