import React from 'react';
import './App.css';
import './style.css';
import RefGraphComponent from "./components/RefGraphComponent.js";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from './Nav';

function App() { 
  return (

  <BrowserRouter>
    <header className="header">
      <Navbar />
      <div id="graphbody" className="App">
        <Switch>
          <Route path="/:owner/:project/:id" component={RefGraphComponent}/>
          <Route path="/:owner" component={RefGraphComponent} />
          <Route path="/:owner/:project" component={RefGraphComponent} />
          <Route path="/" component={RefGraphComponent} />
        </Switch>
      </div>
    </header>
  </BrowserRouter>
  );
}


export default App;
