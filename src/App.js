import React from 'react';
import logo from './logo.svg';
import './App.css';
import RefGraphComponent from "./components/RefGraphComponent.js";
import { BrowserRouter, Route } from "react-router-dom";

function App() { 
  return (

  <BrowserRouter>
    <div id="graphbody" className="App">
      <header className="App-header">
          <Route path="/:owner/:project/:id" component={RefGraphComponent}>
          </Route>
      </header>
    </div>
  </BrowserRouter>
  );
}


export default App;
