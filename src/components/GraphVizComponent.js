import React, { Component } from "react";
import {Graphviz} from 'graphviz-react';
import * as d3 from 'd3';
import {select as d3_select} from 'd3-selection'
import {event as d3_event} from 'd3-selection'

const examples = [
  {
    owner: 'facebook',
    project: 'react',
    id: 1
  }
];

var subgraphsOvertime = {}

class GraphVizCompoment extends Component {

  constructor(props) {

    super();

    this.ref = React.createRef();

    this.draw = this.draw.bind(this);
    this.renderGraph =  this.renderGraph.bind(this);
    this.renderMenu = this.renderMenu.bind(this)
    this.renderMenuSummary = this.renderMenuSummary.bind(this)
    this.renderError = this.renderError.bind(this)
    this.renderExamples = this.renderExamples.bind(this)
    this.renderToolTip = this.renderToolTip.bind(this)
    this.readData = this.readData.bind(this)
    this.selectRandomGraph = this.selectRandomGraph.bind(this)
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
      error: false,
      level: "",
      summary: ""
    };

  }

  componentDidMount() {
    this.draw()
  }

  renderToolTip(){
    var tooltip = d3_select(".tooltip-node")
    var node = d3_select('svg').selectAll('ellipse')
    .on("mouseover", (d) => {

        tooltip.transition()
        .duration(200)
        .style("opacity", 1);

        var target = d.parent.attributes.target.split("#")
        var prefixLocation = target[0].length > 40 ? '...' : '';
        var location = `${prefixLocation}${target[0].slice(Math.max(-40, -target[0].length))}`;

        tooltip.html(`
          <table class="table-borderless table-sm">
            <tr><td class="td-label"><b>${this.state.level}: </b></td><td class="td-info">${target[1]}</td></tr>
            <tr><td class="td-label"><b>Location: </b></td><td class="td-info">${location}</td></tr>
          </table>`)
        .style("left", (d3_event.pageX + window.pageXOffset) + "px")
        .style("top", (d3_event.pageY - window.pageYOffset)  + "px");
    })
   .on("mouseout", function(d) {
      tooltip.transition()
      .duration(200)
      .style("opacity", 0);
   })

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
          agedays: data.info.agedays,
          refactorings: data.info.refactorings,
          group: data.info.group,
          language: data.info.language,
          level: data.info.level,
          summary: data.info.summary,
          commits_list: data.commits_list,
          graph: this.createDigraph(data.edges),
          error: false
        }, () => {
            this.renderToolTip()
        })
      }
    })
  }

  createDigraph(edges){
    var digraph = `digraph "" {ratio="auto"; node [shape=point, width=0.25]; rankdir=LR; `;
    var msgLabel = 'Click to see the commit on GitHub';
    var edgeFont = `fontsize=10, arrowsize=1 fontname="Arial, sans-serif"`
    edges.map((refactoring) =>
      digraph += ` "${refactoring.before}" -> "${refactoring.after}" 
        [label="${refactoring.ref}", ${edgeFont}, edgehref="https://github.com/${this.state.owner}/${this.state.project}/commit/${refactoring.sha1}", edgetarget="_blank", labeltarget="_blank" edgetooltip="${msgLabel}", labelhref="https://github.com/${this.state.owner}/${this.state.project}/commit/${refactoring.sha1}", labeltooltip="${msgLabel}"
        ];
        "${refactoring.before}"[target="${refactoring.before}" tooltip=" "]
        "${refactoring.after}"[target="${refactoring.after}" tooltip=" "]
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
    if(!Object.keys(subgraphsOvertime).length){
      d3.queue()
      .defer(d3.json, '/data/subgraphs_overtime_top_2.json')
      .await((error, data) => {
        if(error){
          this.setState({
            error: true
          })
        }
        else{
          subgraphsOvertime = data;
          this.selectRandomGraph();
          this.setState({
            error: false
          });
        }
      })
    }
    else{
      this.selectRandomGraph();
    }
  }

  selectRandomGraph(){
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
        <div className="col col-lg-9 text-center" ref={this.ref}>
          <div className="graphviz-custom">
            <Graphviz dot={this.state.graph} options={{ width: this.state.width, height: this.state.height, zoom: false}} />
            <div className="tooltip-node border border-secondary rounded"></div>
          </div>
        </div>
      )
    }
  }

  renderMenuSummary(){
    if(!this.state.error && this.state.summary){
      return(
      <div className="card card-summary text-white bg-dark">
        <div className="card-body text-monospace text-center">
          <b>Summary:</b> {this.state.summary}
        </div>
      </div>
      )
    }

  }

  renderMenu(){
    if(!this.state.error){

      return (
        <div className="col col-lg-3">
          {this.renderMenuSummary()}
           <ul className="list-group list-group-flush border border-secondary rounded">
           <li className="list-group-item border-0 li-custom text-center">
              <button onClick={this.createRandomSubgraph} type="button" className="btn btn-sm btn-dark button-random">
              Random subgraph &nbsp;<i className="fas fa-random fa-fw mx-auto"  aria-hidden="true"></i>
              </button>
            </li>
             <li className="list-group-item border-0 li-custom" title="Subgraph ID">
              <i className="fas fa-info-circle" aria-hidden="true"></i>&nbsp; Subgraph #{this.state.id}
            </li>
            <li className="list-group-item border-0 li-custom" title="GitHub Project">
              <i className="fab fa-github fa-fw mx-auto"  aria-hidden="true"></i>&nbsp; <a href={`https://github.com/${this.state.owner}/${this.state.project}`} target="_blank" rel="noopener noreferrer">{this.state.owner}/{this.state.project}</a>                   </li>
            <li className="list-group-item border-0 li-custom" title="Language">
              <i className="far fa-file-code fa-fw" aria-hidden="true"></i>&nbsp; {this.state.language}
            </li>
            <li className="list-group-item border-0 li-custom" title="Number of distinct developers">
                <i className="fa fa-users fa-fw"  aria-hidden="true"></i>&nbsp;
                Developers: {this.state.developers}
            </li>
            <li className="list-group-item border-0 li-custom" title="Number of vertices">
                <i className="fa fa-ellipsis-h fa-fw"  aria-hidden="true"></i>&nbsp;
                Vertices: {this.state.vertices}
            </li>
            <li className="list-group-item border-0 li-custom" title="Number of edges">
                <i className="fa fa-exchange-alt fa-fw" aria-hidden="true"></i>&nbsp;
                Edges: {this.state.edges}
            </li>
            <li className="list-group-item border-0 li-custom" title="Number of days between the most recent and the oldest commit">
              <i className="far fa-clock fa-fw" aria-hidden="true"></i>&nbsp; Age: {this.state.agedays}
            </li>
            <li className="list-group-item border-0 li-custom" title="Number of distinct refatorings">
              <i className="far fa-registered fa-fw"  aria-hidden="true"></i>&nbsp;
                Refactorings: {this.state.refactorings}
            </li>
          </ul>
          <ul className="list-group list-group-flush ul-bottom border border-secondary rounded">
            <li className="list-group-item border-0 li-custom" title="Number of commits used in this subgraph">
              <i className="fa fa-code-branch fa-fw" aria-hidden="true"></i>&nbsp;
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