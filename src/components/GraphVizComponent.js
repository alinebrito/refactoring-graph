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
    this.createDigraph = this.createDigraph.bind(this)

    this.state = {
      owner: props.match.params.owner,
      project: props.match.params.project,
      id: props.match.params.id,
      width: this.ref.offsetWidth,
      height: window.innerHeight - 262,
      graph: 'digraph refgraph {}',
      distinct_commits: []
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
          distinct_commits: data.distinct_commits,
          graph: this.createDigraph(data.edges)
        });
      }
    })
  }

  createDigraph(edges){
    // size="25.7,8.3!"
    var digraph = `digraph {ratio="auto"; node [shape=point, width=0.25]; rankdir=LR; `;
    var msgLabel = 'Click to see the commit on GitHub';
    var edgeFont = `fontsize=11, arrowsize=1 fontname="Arial, sans-serif"`
    edges.map((edge) =>
        digraph += edge.map((refactoring) =>
           ` "${refactoring.node_before_entity}" -> "${refactoring.node_after_entity}" 
          [id=${refactoring.edge_number}, label="${refactoring.refactoring_name}", ${edgeFont}, edgehref="https://github.com/${this.state.owner}/${this.state.project}/commit/${refactoring.sha1}", edgetarget="_blank", labeltarget="_blank" edgetooltip="${msgLabel}", labelhref="https://github.com/${this.state.owner}/${this.state.project}/commit/${refactoring.sha1}", labeltooltip="${msgLabel}"
          ]
          `
        )
    );
    digraph += `}`
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
        <div className="row">
          <div className="col col-lg-2">
            <ul className="list-group list-group-flush border border-secondary rounded">
              <li className="list-group-item border-0 li-custom li-title text-center">
                <button type="button" className="btn btn-primary btn-sm btn-dark">
                  Random &nbsp;<i className="fas fa-random fa-fw mx-auto" title="Plot a random refactoring subgraph" aria-hidden="true"></i>           
                </button>
              </li>
              <li className="list-group-item border-0 li-custom">
                <i className="fas fa-code-branch" title="Language" aria-hidden="true"></i>&nbsp; Subgraph #{this.state.id}
              </li>
              <li className="list-group-item border-0 li-custom">
                <i className="fab fa-github fa-fw mx-auto" title="GitHub Project" aria-hidden="true"></i>&nbsp; <a href={`https://github.com/${this.state.owner}/${this.state.project}`}target="_blank" rel="noopener noreferrer">{this.state.owner}/{this.state.project}</a>                   </li>
              <li className="list-group-item border-0 li-custom">
                <i className="far fa-file-code fa-fw" title="Language" aria-hidden="true"></i>&nbsp; {this.state.language}
              </li>
              <li className="list-group-item border-0 li-custom">
                  <i className="fa fa-users fa-fw" title="Number of distinct developers" aria-hidden="true"></i>&nbsp;
                  Developers: {this.state.developers}
              </li>
              <li className="list-group-item border-0 li-custom">
                  <i className="fa fa-ellipsis-h fa-fw" title="Number of vertices" aria-hidden="true"></i>&nbsp;
                  Vertices: {this.state.vertices}
              </li>
              <li className="list-group-item border-0 li-custom">
                  <i className="fa fa-exchange-alt fa-fw" title="Number of edges" aria-hidden="true"></i>&nbsp;
                  Edges: {this.state.edges}
              </li>
              <li className="list-group-item border-0 li-custom">
                  <i className="far fa-clock fa-fw" title="Number of months between the most recent and the oldest commit" aria-hidden="true"></i>&nbsp;
                  Age: {this.state.agemonth}
              </li>
              <li className="list-group-item border-0 li-custom">
                <i className="far fa-registered fa-fw" title="Number of distinct refatorings" aria-hidden="true"></i>&nbsp;
                  Refactorings: {this.state.refactorings}
              </li> 
            </ul>
            <ul className="list-group list-group-flush ul-bottom border border-secondary rounded">
            <li className="list-group-item border-0 li-custom">
              <i className="fa fa-code-branch fa-fw" title="Number of distinct commits" aria-hidden="true"></i>&nbsp;
                  Commits: {this.state.commits}
              </li>
              {this.state.distinct_commits.map((sha1, index) => {
                return <a key={index} href={`https://github.com/${this.state.owner}/${this.state.project}/commit/${sha1}`}target="_blank" rel="noopener noreferrer"><li className="list-group-item li-custom">
                  {sha1}
                </li></a>
              })}
            </ul>
          </div>
          <div id="" className="col col-lg-10 text-center" ref={this.ref}>
             <div className="graphviz-custom text-center">
               <Graphviz dot={this.state.graph} options={{ width: this.state.width, height: this.state.height, zoom: false}} />
             </div>
          </div>
        </div>
    )
  }
}
export default GraphVizCompoment;