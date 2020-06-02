import React from 'react';
import logo from './logo.svg';
import './App.css';
import RefGraphComponent from "./components/RefGraphComponent.js";

function App() { 
  return (
    <div id="graphbody" className="App">
      <header className="App-header">
      is not defined  react/jsx-no-undef       
      <RefGraphComponent
          width={1000}
          height={500}
          graphid={'test/overtime_01'}
        />
      </header>
    </div>
  );
}

export default App;
