import React from 'react';
import logo from './logo.svg';

export default () => {
  return (
   <header>
      <div className="navbar navbar-dark bg-dark" >
        <a className="navbar-brand" href="/#"> 
          Refactoring Graph
        </a>
        <div className="justify-content-end">
            <a href="https://github.com/alinebrito/refactoring-graph">
              <img
                width="90" height="25"
                alt="GitHub stars"
                src="https://img.shields.io/github/stars/alinebrito/refactoring-graph?logo=github&style=social"
              />
            </a>
        </div>
      </div>
      <div className="container ">
          <div className="card-body border-0">
            <p className="lead text-center">Refactoring Graph is a data structure to assess refactoring over time. The vertices are methods/functions and the edges represent refactoring operations. See <a href='https://github.com/alinebrito/refactoring-graph'target="_blank" rel="noopener noreferrer">refactoring-graph </a> repository for more details.
            </p>
          </div>
      </div>
    </header>
  );
};