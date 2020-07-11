import React from 'react';

export default () => {
  return (
   <header>
      <div className="navbar navbar-dark bg-dark" >
        <a className="navbar-brand" href="/#"> 
          Refactoring Graph
        </a>
        <div className="justify-content-end" title="https://github.com/alinebrito/refactoring-graph">
            <a href="https://github.com/alinebrito/refactoring-graph" target="_blank" rel="noopener noreferrer">
              <img
                width="150" height="25"
                alt="GitHub stars"
                src="https://img.shields.io/github/stars/alinebrito/refactoring-graph?label=GitHub%20|%20Stars&style=social"
              />
            </a>
        </div>
      </div>
      <div className="container">
          <div className="card-body border-0">
            <p className="text-center">Refactoring Graph is a data structure to assess refactorings over time. The vertices are methods/functions and the edges represent refactoring operations. Hover the mouse over a vertice to see its name, and click an edge to see the commit on GitHub.
            </p>
          </div>
      </div>
    </header>
  );
};