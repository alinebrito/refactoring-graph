import React, {Component} from 'react';
import * as d3 from 'd3';

class RefGraphInfo extends Component{

  constructor(props){
    super(props);

    this.readData = this.readData.bind(this)
    this.state = {
        owner: props.match.params.owner,
        project: props.match.params.project,
        id: props.match.params.id,
        level: "",
        edges: []
      };
  }

  componentDidMount() {
    const url = `/data/${this.state.owner}/${this.state.project}/subgraph_${this.state.id}.json`;
    this.readData(url)
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
          edges: data.edges.sort((edge1, edge2) => {return ('' + edge1.sha1).localeCompare(edge2.sha1)}),
          level: data.info.level,
          error: false
        });
      }
    })
  }


  render(){
    return(
      <div className="container-fluid">
        <div className="row">
          <div className="col col-lg-12 table-custom">
            <table className="table table-striped table-responsive">
              <thead>
                <tr>
                  <th scope="col">Edge ID</th>
                  <th scope="col">Commit</th>
                  <th scope="col">Refatoring</th>
                  <th scope="col">Entity Before</th>
                  <th scope="col">Entity After</th>
                  
                </tr>
              </thead>
              <tbody>
                  {this.state.edges.map((edge, index) => {
                    return(
                      <tr key={index}>
                        <th scope="row">{edge.id}</th>
                        <td><a key={index} href={`https://github.com/${this.state.owner}/${this.state.project}/commit/${edge.sha1}`}target="_blank" rel="noopener noreferrer">{edge.sha1}</a></td>
                        <td>{edge.ref}</td>
                        <td>{edge.before}{(edge.lineB)? "##L" + edge.lineB: ""}</td>
                        <td>{edge.after}{(edge.lineA)? "##L" + edge.lineA: ""}</td>
                      </tr>
                    )
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }
}

export default RefGraphInfo;