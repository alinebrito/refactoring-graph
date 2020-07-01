import React, { Component } from "react";
import {Graphviz} from 'graphviz-react';
import * as d3 from 'd3';
import subgraphsOvertime from '../data/subgraphs_overtime.json';

const examples = [
  {
    owner: 'facebook',
    project: 'react',
    id: 1
  }
];

class GraphVizCompoment extends Component {

  constructor(props) {

    super();

    this.ref = React.createRef();

    this.draw = this.draw.bind(this);
    this.renderGraph =  this.renderGraph.bind(this);
    this.renderMenu = this.renderMenu.bind(this)
    this.renderError = this.renderError.bind(this)
    this.renderExamples = this.renderExamples.bind(this)
    this.readData = this.readData.bind(this)
    this.createDigraph = this.createDigraph.bind(this)
    this.createRandomSubgraph = this.createRandomSubgraph.bind(this)
    this.showGraph = this.showGraph.bind(this)

    this.state = {
      owner: props.match.params.owner,
      project: props.match.params.project,
      id: props.match.params.id,
      width: this.ref.offsetWidth,
      height: this.ref.offsetHeight, //window.innerHeight - 262,
      graph: 'digraph refgraph {}',
      commits_list: [],
      error: false
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
        this.setState({
          error: true
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
          commits_list: data.commits_list,
          graph: this.createDigraph(data.edges),
          error: false
        });
      }
    })
  }

  createDigraph(edges){
    var digraph = `digraph {ratio="auto"; node [shape=point, width=0.25]; rankdir=LR; `;
    var msgLabel = 'Click to see the commit on GitHub';
    var edgeFont = `fontsize=10, arrowsize=1 fontname="Arial, sans-serif"`
    edges.map((refactoring) =>
      digraph += ` "${refactoring.before}" -> "${refactoring.after}" 
        [id=${refactoring.id}, label="${refactoring.ref}", ${edgeFont}, edgehref="https://github.com/${this.state.owner}/${this.state.project}/commit/${refactoring.sha1}", edgetarget="_blank", labeltarget="_blank" edgetooltip="${msgLabel}", labelhref="https://github.com/${this.state.owner}/${this.state.project}/commit/${refactoring.sha1}", labeltooltip="${msgLabel}"
        ]
        `
    );
    digraph += `}`
    return digraph
  }

  draw(){
    const url = `/data/${this.state.owner}/${this.state.project}/subgraph_${this.state.id}.json`;
    this.readData(url)
  }

  createRandomSubgraph(){

    var selectedProject = Math.floor(Math.random() * 20)
    var selectedItem = subgraphsOvertime[selectedProject]
    var selectedPosition = Math.floor(Math.random() * selectedItem.ids.length)
    var selectedId = selectedItem.ids[selectedPosition]
    this.showGraph(selectedItem.owner, selectedItem.project, selectedId)
  }

  showGraph(owner, project, id){
    this.setState({
      owner: owner,
      project: project,
      id: id
    }, () => {
      this.draw()
      this.props.history.push(`/${this.state.owner}/${this.state.project}/${this.state.id}`);
    })
  }

  renderGraph() {
    if(!this.state.error){
      return (
          <div className="col col-lg-10 text-center" ref={this.ref}>
            <div className="graphviz-custom">
              <Graphviz dot={this.state.graph} options={{ width: this.state.width, height: this.state.height, zoom: false}} />
            </div>
        </div>
      )
    }
  }

  renderMenu(){
    if(!this.state.error){

      return (
        <div className="col col-lg-2">
          <ul className="list-group list-group-flush border border-secondary rounded">
            <li className="list-group-item border-0 li-custom li-title text-center">
              <button  onClick={this.createRandomSubgraph} type="button" className="btn btn-primary btn-sm btn-dark">
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
            {this.state.commits_list.map((sha1, index) => {
              return <a key={index} href={`https://github.com/${this.state.owner}/${this.state.project}/commit/${sha1}`}target="_blank" rel="noopener noreferrer"><li className="list-group-item li-custom">
                {sha1}
              </li></a>
            })}
          </ul>
        </div>
      )
    }
  }

  renderError(){
    if(this.state.error){
      return (
        <div className="col col-lg-12 text-center h5 error-msg">
          <p>Refactoring subgraph not found. Back to <a href={process.env.PUBLIC_URL} rel="noopener noreferrer"> homepage</a>.</p>
        </div>
      )
    }
  }

  renderExamples(){
    if(!this.state.error){
      return (
        <div className="row">
          <div className="col col-lg-12 text-center">
            Examples:{' '}
            {examples.map((example, index) => (
              <a  className="" href="/#" key={index} onClick={() => {this.showGraph(example.owner, example.project, example.id)}}>
                {example.owner}/{example.project}/{example.id}
              </a>
            ))}
          </div>
        </div>
      )
    }
  }

  render(){
    return(
      <div className="container-fluid" id="graph-div">
        <div className="row">
          {this.renderMenu()}
          {this.renderGraph()}
          {this.renderError()}
        </div>
      </div>
    )
  }
}
export default GraphVizCompoment;