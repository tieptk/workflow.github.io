import { useState, useEffect } from 'react';

const ShowPopup = ({ selectedNodeContent, hidePopup }) => {
  const [showPopup, setShowPopup] = useState(true);

  const handleOverlayClick = () => {
    setShowPopup(false);
    hidePopup(); // Gọi hàm từ props để ẩn popup ở component cha
  };

  useEffect(() => {
    if (!showPopup) {
      hidePopup(); // Đảm bảo khi popup bị ẩn, nó được xử lý ở component cha
    }
  }, [showPopup, hidePopup]);

  return (
    <>
      <div className='popup-overlay' onClick={handleOverlayClick}></div>
      <div className={`popup global-popup ${showPopup ? '' : 'hidden'}`}>
        <div className='popup-header'>
          <h1 className='title'></h1>
          <div className='close-popup' onClick={handleOverlayClick}>
            x
          </div>
        </div>
        <div className='popup-content'>
          <div className='conent-form'>
            <div
              className='content-left'
              dangerouslySetInnerHTML={{ __html: selectedNodeContent }}
            />
            <div className='content-right'></div>
          </div>
        </div>
        <div className='popup-footer '>
          <button onClick={() => setShowPopup(false)} className='btn-save'>
            Lưu lại
          </button>
          <button className='btn-remove'>Xóa</button>
        </div>
      </div>
    </>
  );
};

export default ShowPopup;
