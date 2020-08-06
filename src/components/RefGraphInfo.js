import React, {Component} from 'react';
import * as d3 from 'd3';
import queryString from 'query-string';

class RefGraphInfo extends Component{

  constructor(props){
    super(props);
    let params = queryString.parse(this.props.location.search)
    this.readData = this.readData.bind(this)
    this.state = {
        owner: props.match.params.owner,
        project: props.match.params.project,
        id: props.match.params.id,
        level: "",
        edges: [],
        commits: params.commits ? params.commits.split(',') : []
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
          <div className="col-lg-11 offset-md-1 table-custom">
            <table className="table table-responsive">
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
                      <tr key={index} className= {this.state.commits.includes(edge.sha1) ? "alert alert-info" : ""}>
                        <th scope="row">{edge.id}</th>
                        <td><a key={index} href={`https://github.com/${this.state.owner}/${this.state.project}/commit/${edge.sha1}`}target="_blank" rel="noopener noreferrer">{edge.sha1}</a></td>
                        <td>{edge.ref}</td>
                        <td>{edge.before}{(edge.lineB)? " (line " + edge.lineB + ")" : ""}</td>
                        <td>{edge.after}{(edge.lineA)? " (line " + edge.lineA + ")" : ""}</td>
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