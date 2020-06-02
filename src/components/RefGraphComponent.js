import React, { Component } from "react";
import * as d3 from "d3";
import {event as d3Event} from 'd3-selection';
import {drag as d3Drag} from 'd3-drag';
import {select as d3Select} from 'd3-selection'


class RefGraphComponent extends Component {

  constructor(props) {
    super();

    this.ref = React.createRef();
    this.draw = this.draw.bind(this);
    this.ticked = this.ticked.bind(this)
    this.positionLink = this.positionLink.bind(this)
    this.update = this.update.bind(this)

    this.arrow_color = '#555555'
    this.edge_distance = 180;
    this.edge_label_size = 15;
    this.radius = 14

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

    link.append("title")
    .text(function (d) {return d.refactoring_name;});

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
    .text(function (d) {return d.id;});

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
    .force("center", d3.forceCenter(this.props.width/2, this.props.height/2));
    
    d3.queue()
    .defer(d3.json, "../data/" + this.props.graphid + ".json")
    .await((error, data) => {
        this.update(data.links, data.nodes, simulation)
    })
    
  }

  render(){
    return(
      <svg width={this.props.width} height={this.props.height} ref={this.ref}>
      </svg>
    )
  }
}
export default RefGraphComponent;