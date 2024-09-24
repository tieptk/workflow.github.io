import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CreateFlow from '../src/nodes/CreateFlow';
import BuildFlow from '../src/nodes/BuildFlow';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<CreateFlow />} />
        <Route path="/build" element={<BuildFlow />} />
      </Routes>
    </div>
  );
}

export default App;
