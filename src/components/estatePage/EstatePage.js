import React from 'react'
import './estate-page.scss'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Layout from '../common/layout/layout'
import Api from '../../utils/api'
import CommonListItem from '../common/commonListItem/commonListItem'
import * as icons from 'react-icons/fa'
import MapContainer  from '../../lib/mapContainer/mapContainer'
import { commonNumberFormat } from '../../utils/numberFormat'



class EstatePage extends React.Component{
    constructor(props){
        super(props);
        this.state={
          nodes: [],
          me:{},   
          imgUrl:'', 
          estates:[],     
        }
      }
    componentDidMount(){
        const { estateid, portfolioname,estatename } = this.props.match.params
        const{ siteName,ticket } = this.props
        this._fetchNodes(estateid)     
        this._fetchNode(estateid)   
        
        const tempPath = `${siteName}/documentLibrary/${portfolioname}/${estatename}`
        this.setState({
            imgUrl:`${Api.baseUrl}/alfresco/api/-default-/public/cmis/versions/1.1/browser/root/Sites/${encodeURI(tempPath)}/facade_large.png?alf_ticket=${ticket}`
        })
      
    }

    async _fetchNode(containerId) {
        const node = await Api.get(Api.ENDPOINTS.getNode(containerId), false)   
        this.setState({
            me:node.entry,
            estates:[node]
        })
        //console.log(node)
    }
    
    async _fetchNodes(containerId) {
        const nodesResponse = await Api.get(Api.ENDPOINTS.nodes(containerId), false)   
        this.setState({nodes: nodesResponse.list.entries}) 
        //console.log(nodesResponse.list.entries)    
    }

    render() {
        const{nodes, me, imgUrl, estates } = this.state
        const { portfolioname, portfolioid,estatename, estateid } = this.props.match.params       
        return(
            <div id="estatePage" >
                <Layout>
                    {me.properties !== undefined ?
                        <MapContainer 
                            items={estates}
                            zoomLevel= {18}
                            centerAroundCurrentLocation={false}
                            centerObj={{lat: me.properties["dts:lat-long"].split(',')[0], lng: me.properties["dts:lat-long"].split(',')[1]}}
                            mapType={'satellite'}
                            hasLinkToEstate={false}
                            showImg={false}
                            polygonCoords={ me.properties["dts:polygon"]!== undefined ? JSON.parse(me.properties["dts:polygon"]): null}
                            useBounds={false}
                        />:null
                    }
                    
                    <div id="sidebar">                        
                           
                        <div className="jumbotron jumbotron-fluid" style={{backgroundImage:`url(${imgUrl})`}}>
                            
                        </div>   
                        <nav>
                            <ol className="breadcrumb site-nav">
                                <li className="breadcrumb-item home-link"> 
                                    <Link to={`/`} ><icons.FaHome/> </Link>
                                </li>
                                <li className="breadcrumb-item">
                                    <Link to={`/${portfolioname}/${portfolioid}/estates`} > 
                                        {portfolioname}
                                    </Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">Fastighet</li>
                            </ol>
                        </nav> 
                        <div className="estate-header-container">

                                <h1>{me.name}</h1>
                                <div className="text"> 
                                    {
                                        me.properties? 
                                        <span>{me.properties["dts:address"] } <br/> {commonNumberFormat(me.properties["dts:squareMetersString"])} m<sup>2</sup>  &#183;  {me.properties["dts:typeCode"]}</span> 
                                        :null
                                    }
                                
                                </div>
                        </div>

                    
                        <div className="row">
                            { nodes ? nodes.map(  item => {
                            return(
                                <div className="col-md-12" key={item.entry.id}>   
                                                        
                                    <CommonListItem 
                                        linkUrl={`/${portfolioname}/${portfolioid}/${estatename}/${estateid}/${item.entry.name}/${item.entry.id}/datacategory`}
                                        item = {item}
                                    />
                                </div>
                            )            
                            }):<img src="/svg/loader.gif"  width="24px"/> }                 
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

export default connect(mapStateToProps)(EstatePage);