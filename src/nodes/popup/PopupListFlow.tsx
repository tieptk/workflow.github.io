import { describe } from 'node:test';
import { useState, useEffect } from 'react';

import { dataListFlow } from '../data/data';

const PopupListFlow = ({ hidePopup, onSelectFlow }) => {
  const [showPopup, setShowPopup] = useState(true);

  const handleOverlayClick = () => {
    setShowPopup(false);
  };

  const handleFlowClick = (flow) => {
    onSelectFlow(flow); // Gọi callback với flow đã chọn
    setShowPopup(false); // Ẩn popup
  };

  useEffect(() => {
    if (!showPopup) {
      hidePopup(); // Đảm bảo khi popup bị ẩn, nó được xử lý ở component cha
    }
  }, [showPopup, hidePopup]);

  return (
    <>
      <div className="popup-overlay" onClick={handleOverlayClick}></div>
      <div className="popup-list-flow ">
        <div className="popup-content">
          <button onClick={handleOverlayClick} className="close">
            x
          </button>
          <h3 className="title">
            These starting points are popular with other Mailchimp customers.
          </h3>
          <p className="note">
            Some starting points are coming soon or require additional setup.
          </p>
          <div className="ListNodeMain d-flex flex-wrap">
            {dataListFlow.map((option) => (
              <div
                className="item-node"
                key={option.id}
                onClick={() => handleFlowClick(option.key)}
              >
                <div className="triggerName d-flex align-items">
                  <img className="icon" src={option.icon} alt={option.name} />
                  <p className="name">{option.name}</p>
                </div>
                <div
                  className="description"
                  dangerouslySetInnerHTML={{ __html: option.description }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupListFlow;
