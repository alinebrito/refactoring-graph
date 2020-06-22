import React, { Component } from "react";
import * as d3 from "d3";
import {event as d3Event} from 'd3-selection';
import {drag as d3Drag} from 'd3-drag';
import {select as d3Select} from 'd3-selection'
import logo from '../logo.svg';

class RefGraphComponent extends Component {

  constructor(props) {

    super();

    this.ref = React.createRef();
    this.draw = this.draw.bind(this);
    this.ticked = this.ticked.bind(this)
    this.positionLink = this.positionLink.bind(this)
    this.update = this.update.bind(this)
    this.readData = this.readData.bind(this)

    this.arrow_color = '#555555'
    this.edge_distance = 180;
    this.edge_label_size = 15;
    this.radius = 14
    this.width = window.innerWidth;
    this.height = window.innerHeight - 250;

    this.state = {
      owner: props.match.params.owner,
      project: props.match.params.project,
      id: props.match.params.id
    };

  }

  // After component creation
  componentDidMount() {
    this.draw()
  }

  update(links, nodes, simulation) {
    var svg = d3Select(this.ref.current)
    var colors = d3.scaleOrdinal().range(["#000000"]);

    // edge
    var link = svg.selectAll(".link")
    .data(links)
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr('fill-opacity', 0)
    .attr('id', function (d, i) {return 'edgepath' + i})
    .attr('marker-end','url(#arrowhead)')
    .on("mouseover", function(d) {
      link
      .style("cursor", "pointer");
    })
    .on("click",function(d,i) {
      window.open(`https://github.com/${d.project}/commit/${d.sha1}`, '_blank');
    });

    // edge path
    svg.selectAll(".edgepath")
    .data(links)
    .enter()
    .append('path')
    .attr('class', 'edgepath')
    .attr('fill-opacity', 0)
    .attr('stroke-opacity', 0)
    .attr('id', function (d, i) {return 'edgepath' + i})
    .style("pointer-events", "none");

    // edge label
    var edgelabels = svg.selectAll(".edgelabel")
    .data(links)
    .enter()
    .append('text')
    .style("pointer-events", "none")
    .attr('font-family', "Times")
    .attr('class', 'edgelabel')
    .attr('id', function (d, i) {return 'edgelabel' + i})
    .attr('font-size', this.edge_label_size)
    .attr('fill', '#000')

    edgelabels.append('textPath')
    .attr('xlink:href', function (d, i) {return '#edgepath' + i})
    .style("text-anchor", "middle")
    .style("pointer-events", "none")
    .attr("startOffset", "50%")
    .text(function (d) {return d.refactoring_name});

    // node 
    var node = svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("stroke", this.arrow_color)
    .attr("stroke-width", '1px')
    .call(d3Drag()
      .on("start", function(d){
        if (!d3Event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", function(d){
        d.fx = d3Event.x;
        d.fy = d3Event.y;
      })
    );
    
    node.append("circle")
    .attr("r", this.radius)
    .style("fill", function (d, i) {return colors(i);})

    node.append("title")
    .text(function (d) {return d.name;});

    simulation
    .nodes(nodes)
    .on("tick",this.ticked);

    simulation.force("link")
    .links(links);
  }

  //edge curve
  positionLink(d) {
    var offset = 50;
    var midpoint_x = (d.source.x + d.target.x) / 2;
    var midpoint_y = (d.source.y + d.target.y) / 2;
    var dx = (d.target.x - d.source.x);
    var dy = (d.target.y - d.source.y);
    var normalise = Math.sqrt((dx * dx) + (dy * dy));
    var offSetX = midpoint_x + offset*(dy/normalise);
    var offSetY = midpoint_y - offset*(dx/normalise);
    return "M" + d.source.x + "," + d.source.y +
        "S" + offSetX + "," + offSetY +
        " " + d.target.x + "," + d.target.y;
  }

  ticked() {
    const svg = d3Select(this.ref.current)
    .attr('width', this.width)
    .attr('height', this.height);

    svg
    .selectAll(".link")
    .attr("d", this.positionLink)

    svg
    .selectAll(".node")
    .attr("transform", function (d) {
      return "translate(" + d.x + ", " + d.y + ")";
    });
    
    svg
    .selectAll(".edgepath")
    .attr('d', this.positionLink);

    svg.selectAll(".edgelabels")
    .attr('transform', function (d) {
      if (d.target.x < d.source.x) {
        var bbox = this.getBBox();
        var rx = bbox.x + bbox.width / 2;
        var ry = bbox.y + bbox.height / 2;
        return 'rotate(180 ' + rx + ' ' + ry + ')';
      }
      else {
        return 'rotate(0)';
      }
    });
  }

  readData(url, simulation){
    d3.queue()
    .defer(d3.json, url)
    .await((error, data) => {
      if(error){
        const demo = `/data/test/test/overtime_1.json`;
        this.readData(demo, simulation)
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
          level: data.info.level
        });

        this.update(data.links, data.nodes, simulation)
      }
    })
  }

  draw(){

    const svg = d3Select(this.ref.current)
    svg
    .append('defs')
    .append('marker')
    .attr('id','arrowhead')
    .attr('viewBox','-0 -5 10 10')
    .attr('refX', this.radius + 3.5)
    .attr('refY', 0,)
    .attr('orient','auto')
    .attr('markerWidth', 5)
    .attr('markerHeight', 5)
    .attr('xoverflow','visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', this.arrow_color)
    .style('stroke','none');

    //edge
    var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) {return d.id;})
    .distance(this.edge_distance)
    .strength(1))
    .force("charge", d3.forceManyBody())
    .force("collide", d3.forceCollide().radius(12))
    .force("center", d3.forceCenter(this.width/2, this.height/2));

    const url = `/data/${this.state.owner}/${this.state.project}/overtime_${this.state.id}.json`;
    this.readData(url, simulation)
  }

  render(){
    return(
      <div>
        <div>
          <div className="row">
               
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
          <svg className="svg-graph" ref={this.ref}>
          </svg>
        </div>
      </div>
    )
  }
}
export default RefGraphComponent;