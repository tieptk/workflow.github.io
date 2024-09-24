import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/test.css';
import Customer from '../assets/images/Customer-Journey_Animation.gif';

const CreateFlow = () => {
  const [flowName, setFlowName] = useState('');
  const navigate = useNavigate();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (flowName.trim() !== '') {
      // Chuyển hướng đến trang build với tham số build=1
      navigate(`/build?build=1&flowName=${encodeURIComponent(flowName)}`);
    } else {
      alert('Bạn chưa nhập tên cho tiến trình');
    }
  };

  return (
    <div className="container">
      <div className="content-create">
        <img src={Customer} className="image-header" alt="" />
        <h2 className="title">Create a map of your contact's journey</h2>
        <p className="note">
          Put your contacts on a path that’s right for them. With a customer
          journey, you can always be there for your contacts when they need you
          most.
        </p>
        <form onSubmit={handleSave} className="style-form">
          <label>Flow Name:</label>
          <input
            type="text"
            value={flowName}
            onChange={(e) => setFlowName(e.target.value)}
          />
          <button type="submit" className="btn-submit">
            Start Building
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateFlow;
