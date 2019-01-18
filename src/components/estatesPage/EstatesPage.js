import React from 'react'
import './estates-page.scss'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Layout from '../common/layout/layout'
import Api from '../../utils/api'
import AsyncImage from '../common/asyncImage/asyncImage'
import StatusIcon from '../common/statusIcon/statusIcon'
import * as icons from 'react-icons/fa';
import MapContainer  from '../../lib/mapContainer/mapContainer'
import { commonNumberFormat } from '../../utils/numberFormat'



class EstatesPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
          nodes: [],
          me:{},
          portfolioEstates: []
        }
      }
    componentDidMount(){
        const { portfolioid } = this.props.match.params
        this._fetchNodes(portfolioid)     
        this._fetchNode(portfolioid)       

    
    }

    async _fetchNode(containerId) {
        const node = await Api.get(Api.ENDPOINTS.getNode(containerId), false)   
        this.setState({me:node.entry})
        console.log(node)
    }

    async _fetchNodes(containerId) {
        const { portfolioname, portfolioid } = this.props.match.params
        const nodesResponse = await Api.get(Api.ENDPOINTS.nodes(containerId), false)     
        this.setState({
            nodes: nodesResponse.list.entries,
            portfolioEstates: nodesResponse.list.entries.map(obj=>{
                obj.portfolioName = portfolioname
                obj.portfolioId = portfolioid
                return obj
            })
        }) 
        //console.log(this.state.portfolioEstates)
    }

    render() {
        const{ nodes, me, portfolioEstates } = this.state
        const{ siteName, ticket } = this.props
        const { portfolioname } = this.props.match.params
        
        return(
            <div>
                <Layout>
                    { portfolioEstates.length > 0 ?
                        <MapContainer 
                            items={portfolioEstates}
                            zoomLevel= {14}
                            centerAroundCurrentLocation={false}
                            siteName={siteName}
                            ticket={ticket}
                            centerObj={{lat: portfolioEstates[0].entry.properties["dts:lat-long"].split(',')[0], lng: portfolioEstates[0].entry.properties["dts:lat-long"].split(',')[1]}}
                        />
                        :null
                    }
                    
                <div id="sidebar">
                    <nav>
                        <ol className="breadcrumb site-nav">
                            <li className="breadcrumb-item home-link"><Link to={`/`} ><icons.FaHome /> </Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{me.properties?me.name:''}</li>
                        </ol>
                    </nav>                  
                    <h1 className="col-md-12">{me.properties?me.name:''}</h1>   
                    <div className="col-md-12 under-header-text">
                        {  
                            me.properties?                            
                            <span>{commonNumberFormat(me.properties["dts:squareMeters"])} m<sup>2</sup>  &#183;  {me.properties["dts:responsible"]}</span> 
                            :null
                        }
                    </div>    
                    
                    <div className="row item-container">
                        
                        { nodes.length > 0 ? nodes.map(  item => { 
                        return(
                            <div className="shadow hover-container" key={item.entry.id}>
                                <Link                                     
                                    to={{
                                        pathname:`/${me.name}/${me.id}/${item.entry.name}/${item.entry.id}/estate`,                                        
                                    }} 
                                > 
                                        <div className="thumb-img">
                                            <AsyncImage 
                                                imgPath={`${siteName}/documentLibrary/${portfolioname}/${item.entry.name}`}
                                                ticket={ticket}
                                                className="image"
                                            />  
                                        </div>
                                            

                                        <div className="body">
                                            <div className="header">
                                                <div className="indicator">
                                                    <StatusIcon iconStatus = {item.entry.properties["dts:trafficlightStatus"]} />
                                                </div>
                                                <div className="header-text">{item.entry.properties["cm:title"]}</div>                                                                                         
                                            </div> 
                                            <div className="address text-left"> 
                                                {item.entry.properties["dts:address"]} <br/>
                                                {commonNumberFormat(item.entry.properties["dts:squareMetersString"])} m<sup>2</sup>  &#183;  Typkod {item.entry.properties["dts:typeCode"]}
                                            </div>       
                                            {/* <div className="address text-left">{item.entry.properties["dts:squareMetersString"]} m<sup>2</sup>  &#183;  Typkod {item.entry.properties["dts:typeCode"]}</div>        */}
                                        </div>
                                </Link>

                            </div> 
                        )            
                        }): <div>no estates at the moment</div> }                 
                    </div> 
                
                </div>    
                                  
             
                
                
                </Layout>
            </div>            
        )
    }
} 



const mapStateToProps = state => {
    return {
      siteName: state.login.siteName,
      ticket: state.login.token,
    }
  }

  
  export default  connect(mapStateToProps,null)(EstatesPage);