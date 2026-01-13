import React from 'react';
import './App.css'; 

// QUAN TRỌNG: Trỏ đúng vào folder routes nơi chứa file index.js của bạn
import AppRouter from './routes'; 
// (Hoặc import AppRouter from './routes/index'; đều được)

function App() {
  return (
    <div className="laca-app">
      <div className="laca-container">
        <AppRouter />
      </div>
    </div>
  );
}

export default App;