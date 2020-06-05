import React from 'react';
import logo from './logo.svg';
import './App.css';
import './style.css';
import RefGraphComponent from "./components/RefGraphComponent.js";
import { BrowserRouter, Route } from "react-router-dom";
import Navbar from './Nav';

function App() { 
  return (

  <BrowserRouter>
    <header className="header">
      <Navbar />
      <div id="graphbody" className="App">
        <Route path="/:owner/:project/:id" component={RefGraphComponent}>
        </Route>
      </div>
    </header>
  </BrowserRouter>
  );
}


export default App;
