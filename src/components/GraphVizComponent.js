import React, { Component } from "react";
import {Graphviz} from 'graphviz-react';
import * as d3 from 'd3';
import {select as d3_select} from 'd3-selection'

class GraphVizCompoment extends Component {

  constructor(props) {

    super();

    this.ref = React.createRef();
    this.draw = this.draw.bind(this);
    this.renderGraph =  this.renderGraph.bind(this);
    this.readData = this.readData.bind(this)
    this.crateDigraph = this.crateDigraph.bind(this)

    this.state = {
      owner: props.match.params.owner,
      project: props.match.params.project,
      id: props.match.params.id,
      width: this.ref.offsetWidth,
      height:  window.innerHeight - 270,
      graph: 'digraph refgraph {}'  
    };

  }

  // After component creation
  componentDidMount() {
    this.draw()
  }

  readData(url){
    d3.queue()
    .defer(d3.json, url)
    .await((error, data) => {
      if(error){
        const demo = `/data/test/test/subgraph_1.json`;
        this.readData(demo)
        this.setState({
          project: "test",
          owner: "test",
          id: 1
        })
      }

      else{
        this.setState({
          developers: data.info.developers,
          edges: data.info.edges,
          vertices: data.info.vertices,
          commits: data.info.commits,
          agemonth: data.info.agemonth,
          refactorings: data.info.refactorings,
          group: data.info.group,
          language: data.info.language,
          level: data.info.level,
          graph: this.crateDigraph(data.edges)
        });
      }
    })
  }

  crateDigraph(edges){
    var digraph = `digraph refgraph { ratio = auto; node [shape=point, width=0.3]; rankdir=LR; `
    const listItems = edges.map((edge) =>
        edge.map((refactoring) =>
          digraph += `"${refactoring.node_before_entity}" -> "${refactoring.node_after_entity}" [id=${refactoring.edge_number}, label="${refactoring.refactoring_name}", fontsize=14; arrowsize=1;];`
        )
    );
    digraph += `}`
    console.log(digraph)
    return digraph
  }

  draw(){
    const svg = d3_select(this.ref.current)
    const url = `/data/${this.state.owner}/${this.state.project}/subgraph_${this.state.id}.json`;
    this.readData(url)
  }

  renderGraph() {
  }

  render(){
    return(
      <div>
        <div className="container">
          <div className="row justify-content-md-center">
            <div className="col col-lg-2">
            <div className="d-none d-sm-block d-sm-none d-md-block left border border-secondary rounded-right fixed-bottom ">
                  <ul>
                    <li className="item-menu text-center">
                        <b>Subgraph #{this.state.id}</b>
                    </li>
                    <li className="item-menu">
                      <i className="fab fa-github fa-fw mx-auto" title="GitHub Project" aria-hidden="true"></i>&nbsp;
                        <a href={`https://github.com/${this.state.owner}/${this.state.project}`}target="_blank" rel="noopener noreferrer">{this.state.owner}/{this.state.project}</a> 
                    </li>
                    <li className="item-menu">
                      <i className="far fa-file-code fa-fw" title="Language" aria-hidden="true"></i>&nbsp;
                        {this.state.language}
                    </li>
                    <li className="item-menu">
                        <i className="fa fa-users fa-fw" title="Number of distinct developers" aria-hidden="true"></i>&nbsp;
                        Developers: {this.state.developers}
                    </li>
                    <li className="item-menu">
                        <i className="fa fa-code-branch fa-fw" title="Number of distinct commits" aria-hidden="true"></i>&nbsp;
                        Commits: {this.state.commits}
                    </li>
                    <li className="item-menu">
                        <i className="fa fa-ellipsis-h fa-fw" title="Number of vertices" aria-hidden="true"></i>&nbsp;
                        Vertices: {this.state.vertices}
                    </li>
                    <li className="item-menu">
                        <i className="fa fa-exchange-alt fa-fw" title="Number of edges" aria-hidden="true"></i>&nbsp;
                        Edges: {this.state.edges}
                    </li>
                    <li className="item-menu">
                        <i className="far fa-clock fa-fw" title="Number of months between the most recent and the oldest commit" aria-hidden="true"></i>&nbsp;
                        Age: {this.state.agemonth}
                    </li>
                    <li className="item-menu">
                      <i className="far fa-registered fa-fw" title="Number of distinct refatorings" aria-hidden="true"></i>&nbsp;
                        Refactorings: {this.state.refactorings}
                    </li> 
                  </ul>
              </div>
            </div>
            <div className="col-lg-10" ref={this.ref}>
              <div className="text-center">
                <Graphviz dot={this.state.graph} options={{ width: this.state.width, height: this.state.height, zoom: false}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default GraphVizCompoment;