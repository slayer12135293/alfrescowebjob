import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Api from '../../utils/api'
import Layout from '../common/layout/layout'
import './home-page.scss'
import StatusIcon from '../common/statusIcon/statusIcon'
import MapContainer  from '../../lib/mapContainer/mapContainer'
import { commonNumberFormat } from '../../utils/numberFormat'



class HomePage extends React.Component {
  constructor(props){
    super(props);
    this.state={
      nodes: [],
      allEstates: []
    }
  }

  componentDidMount(){
    const {containerId} = this.props
    this._fetchNodes( containerId)     
  }

  async _fetchNodes(containerId) {
      const nodesResponse = await Api.get(Api.ENDPOINTS.nodes(containerId), false)   
      this.setState({nodes: nodesResponse.list.entries}) 

      nodesResponse.list.entries.forEach(async element => {
        const estateResponse = await Api.get(Api.ENDPOINTS.nodes(element.entry.id), false)  
        this.setState({allEstates: [...this.state.allEstates, ...estateResponse.list.entries.map(obj=>{
          obj.portfolioName = element.entry.name
          obj.portfolioId=element.entry.id
          return obj })]})
      });  
  }


  render(){
    const {nodes, allEstates} = this.state
    const{ siteName, ticket } = this.props
    return (      
        <Layout>   

          {allEstates.length >0 ? 
              <MapContainer 
                items={allEstates}
                zoomLevel= {14}
                linkComponent={Link}
                siteName={siteName}
                ticket={ticket}
                centerObj={{lat: allEstates[0].entry.properties["dts:lat-long"].split(',')[0], lng: allEstates[0].entry.properties["dts:lat-long"].split(',')[1]}}
              />            
            : null}
          
          <div id="sidebar">
            <div className="col-md-12">
              { nodes ? nodes.map(  item => { 
                  return(
                    <div className="col-md-12" key={item.entry.id}>
                    <Link to={`/${item.entry.name}/${item.entry.id}/estates`} >
                        <div className="row portfolio-container flex-nowrap justify-content-between" >
                          <div className="row d-flex h-100">  
                              <div className="icon-container">
                                <div className="portfolio-icon">
                                    {/* <icons.FaBriefcase/>   */}
                                    <img src="/svg/icons8-business.svg"/>
                                </div> 
                                <div className="status-indicator align-self-center">
                                    { <StatusIcon iconStatus = {item.entry.properties["dts:trafficlightStatus"]} /> }
                                </div>
                              </div>

                              <div className="text-container">
                                <div className="label1">
                                    {item.entry.name} ({allEstates.filter(x=>x.portfolioName === item.entry.name).length})
                                </div> 
                                <div className="under-text">
                                    {commonNumberFormat(item.entry.properties["dts:squareMeters"])} m<sup>2</sup>  &#183;    {item.entry.properties["dts:responsible"]}
                                </div> 
                              </div>                                  
                          </div>                       
                                            
                        </div>                  
                      </Link>
                    </div>                  
                  )            
                }): null}
            </div>   

          </div>
          
        </Layout>
    );
  }
}

const mapStateToProps = state => {
  return {
    containerId: state.login.containerId,
    siteName: state.login.siteName,
    ticket: state.login.token,
  }
}

export default  connect(mapStateToProps)(HomePage);
