import { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';

// nội dung Menu
const MenuOptions = [
  {
    option: 'rule',
    title: 'Rules',
    list_option: [
      {
        key: 'time-delay',
        label: 'Time delay',
        id: nanoid(8),
        type: 'default',
        icon: '/src/assets/icons/icon-time.svg',
      },
      {
        key: 'ifelse',
        label: 'Replied to conversation?',
        id: nanoid(8),
        type: 'default',
        icon: '/src/assets/icons/icon-if.svg',
        position: { x: 400, y: 290 },
      },
      {
        key: 'wait',
        label: 'Wait for trigger',
        id: nanoid(8),
        type: 'default',
        icon: '/src/assets/icons/icon-wait.svg',
      },
    ],
  },
  {
    option: 'action',
    title: 'Actions',
    list_option: [
      {
        key: 'send-email',
        label: 'Send email',
        id: nanoid(8),
        type: '',
        icon: '/src/assets/icons/icon-email.svg',
      },
      {
        key: 'send-sms',
        label: 'Send sms',
        id: nanoid(8),
        type: '',
        icon: '/src/assets/icons/icon-phone.svg',
      },
      {
        key: 'send-slack',
        branchKey: 'no',
        label: 'Send Slack',
        id: nanoid(8),
        type: 'default',
        icon: '/src/assets/icons/icon-slack.svg',
      },
      {
        key: 'send-zalo',
        branchKey: 'no',
        label: 'Send Zalo',
        id: nanoid(8),
        type: 'default',
        icon: '/src/assets/icons/icon-zalo.svg',
      },
      {
        key: 'send-survey-email',
        label: 'Send survey in email',
        id: nanoid(8),
        type: '',
        icon: '/src/assets/icons/icon-list.svg',
      },
      {
        key: 'contact-exists',
        branchKey: 'yes',
        label: 'Contact Exists',
        id: nanoid(8),
        type: 'output',
        icon: '/src/assets/icons/icon-check.svg',
      },
      {
        key: 'send-survey',
        branchKey: 'no',
        label: 'Send survey',
        id: nanoid(8),
        type: 'output',
        icon: '/src/assets/icons/icon-list.svg',
      },
    ],
  },
];

const MenuFlow = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData(
      'application/reactflow',
      JSON.stringify(nodeType)
    );
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <>
      <div className="menu-fixed">
        <b></b>
        {MenuOptions.map((option) => (
          <div className="item-flow" key={option.option}>
            <b>{option.title}</b>
            <div
              className={`list-option ${option.option == 'rule' ? 'flex' : ''}`}
            >
              {option.list_option.map((items) => (
                <div
                  className="items"
                  draggable="true"
                  key={items.id}
                  onDragStart={(event) => onDragStart(event, items)}
                >
                  <div className="step">
                    <div className="left">
                      <img src={items.icon} width="24px" height="24px" alt="" />
                    </div>
                    <div className="right">{items.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MenuFlow;
