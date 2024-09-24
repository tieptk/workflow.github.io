import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactFlowProvider } from '@xyflow/react';

import NoteFlow from './nodes/NoteFlow';
import './index.css';
import CreateFlow from './nodes/CreateFlow';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <ReactFlowProvider>
      <NoteFlow />
    </ReactFlowProvider> */}

    <CreateFlow />
  </React.StrictMode>
);
