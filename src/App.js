import React, { useState } from 'react';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import KanbanBoard from './components/Kanban/KanbanBoard';

function App() {
  const [groupBy, setGroupBy] = useState('status');

  return (
    <div className="App">
      <Navbar setGroupBy={setGroupBy} />
      <KanbanBoard groupBy={groupBy} />
    </div>
  );
}

export default App;
