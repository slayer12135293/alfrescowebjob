import React from 'react'
import './data-category-page.scss'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Layout from '../common/layout/layout'
import Api from '../../utils/api'
import DocumentFolderModal  from '../../lib/documentFolderModal'
import ExpandableListItem from '../common/expendableListItem/expandableListItem'
import ListItemWithModal from '../common/listItemWithModal/listItemWithModal'
import * as icons from 'react-icons/fa'
import MapContainer  from '../../lib/mapContainer/mapContainer'
import * as Feather from 'react-feather'
import DataCategoryIcon from '../common/dataCategoryIcon/dataCategoryIcon'
import TechnicalDetails from './technicalDetails'
import CompanyDetails from './companyDetails'
import {commonNumberFormat} from '../../utils/numberFormat'



class DataCategoryPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
          nodes: [],
          me:{},        
          imgUrl:'', 
          estate:{},  
          totalLettableArea: 0,
          totalRent:0
        }
      }
    componentDidMount(){
        const {estateid, datacategoryid, portfolioname,estatename } = this.props.match.params
        const{ siteName,ticket } = this.props

        this._fetchNodes(datacategoryid)     
        this._fetchNode(datacategoryid) 
        this._fetchEstateNode(estateid)   

        const tempPath = `${siteName}/documentLibrary/${portfolioname}/${estatename}`
        this.setState({
            imgUrl:`${Api.baseUrl}/alfresco/api/-default-/public/cmis/versions/1.1/browser/root/Sites/${encodeURI(tempPath)}/facade_large.png?alf_ticket=${ticket}`
        })     
        
        $('#documentFolder').on('hidden.bs.modal', () => {        
            this._fetchNodes(datacategoryid)    
        })

        $(window).on('popstate', function() {
            $('.modal-backdrop').remove()
        })
    }

    async _fetchNode(containerId) {
        const node = await Api.get(Api.ENDPOINTS.getNode(containerId), false)   
        this.setState({me:node.entry})
        //console.log(node)
    }

    async _fetchEstateNode(estateId){
        const node = await Api.get(Api.ENDPOINTS.getNode(estateId), false)   
        this.setState({estate:node}) 
    }

    async _fetchNodes(containerId) {
        const nodesResponse = await Api.get(Api.ENDPOINTS.nodes(containerId), false)   
        
        
        if(nodesResponse.list.entries[0].entry.properties["dts:rent"] !== undefined){
            const obsoleteGuests = nodesResponse.list.entries.filter(item => item.entry.properties["dts:isObsolete"] === true)
            const activeGuests = nodesResponse.list.entries.filter(item => item.entry.properties["dts:isObsolete"] !== true )
            this.setState({nodes: [...activeGuests, ...obsoleteGuests]}) 

            const totalLettableArea = nodesResponse.list.entries.reduce(
                function(acc, obj){
                    if(obj.entry.properties['dts:lettableArea'] !== undefined)
                    {
                        return acc + obj.entry.properties['dts:lettableArea']
                    } return acc + 0
                    
                },0
            )
    
            const totalRent = nodesResponse.list.entries.reduce(
                function(acc, obj){
                    if(obj.entry.properties['dts:rent'] !== undefined)
                    {
                        return acc + obj.entry.properties['dts:rent']
                    } return acc + 0
                    
                },0
            )
    
            this.setState({
                totalLettableArea,
                totalRent
            })
        } else {
            this.setState({nodes: nodesResponse.list.entries})
        }

        //console.log(nodesResponse.list.entries) 
        
         
    }

    render() {
        const{nodes, me, imgUrl, estate, totalLettableArea, totalRent } = this.state
        const { 
            portfolioname, 
            portfolioid, 
            estatename, 
            estateid, 
        } = this.props.match.params
        return(
            <div id="dataCategoryPage">
                <Layout>
                {estate.entry !== undefined ?
                    <MapContainer 
                        items={[estate]}
                        zoomLevel= {18}
                        centerAroundCurrentLocation={false}
                        centerObj={{lat: estate.entry.properties["dts:lat-long"].split(',')[0], lng: estate.entry.properties["dts:lat-long"].split(',')[1]}}
                        mapType={'satellite'}
                        hasLinkToEstate={false}
                        showImg={false}
                        useBounds={false}
                        polygonCoords={ estate.entry.properties["dts:polygon"]!== undefined ? JSON.parse(estate.entry.properties["dts:polygon"]): null}
                    />:null
                }


                <div id="sidebar">                                      
                    <div className="jumbotron jumbotron-fluid" style={{backgroundImage:`url(${imgUrl})`}}>                        
                    </div>  
                    <nav >
                        <ol className="breadcrumb site-nav">
                            <li className="breadcrumb-item"> 
                                <Link to={`/`} ><icons.FaHome style={{fontSize:20}}/> </Link>
                            </li>
                            <li className="breadcrumb-item"> 
                                <Link to={`/${portfolioname}/${portfolioid}/estates`} > 
                                    {portfolioname}
                                </Link>
                            </li>
                            <li className="breadcrumb-item"> 
                                <Link 
                                    to={{
                                        pathname: `/${portfolioname}/${portfolioid}/${estatename}/${estateid}/estate`                                       
                                    }}
                                    >{estatename}
                                </Link>
                            </li>                            
                            <li className="breadcrumb-item active" aria-current="page">{me.name}</li>
                        </ol>
                    </nav>  

                    <div className="estate-header-container">
                        <h1>{estatename}</h1>
                        <div className="text"> 
                            {
                                estate.entry!== undefined? 
                                <span>{estate.entry.properties["dts:address"] } <br/> {commonNumberFormat(estate.entry.properties["dts:squareMetersString"])} m<sup>2</sup>  &#183;  {estate.entry.properties["dts:typeCode"]}</span> 
                                :null
                            }
                        </div>
                        <div className="category-header-container">
                            { 
                                me.properties !== undefined  ?                                
                                <DataCategoryIcon iconType={me.properties["dts:icon"] }/>
                                :<Feather.Box /> 
                            }                        
                            <div className="label-subtext-container">
                                <h2>{me.name}</h2>
                                {
                                    me.properties !== undefined && me.properties["dts:icon"].toLowerCase() === 'tennants' ?
                                    <div className="subtext-container">                                      
                                     Total Lettable Area : {totalLettableArea !== 0 ? commonNumberFormat(totalLettableArea): null} <br/>
                                     Total Rent: {totalRent !== 0? commonNumberFormat(totalRent) : null} </div>
                                    :null
                                }
                                <div className="subtext-container">{me.properties !== undefined && me.properties["cm:description"] !== undefined ? me.properties["cm:description"] : null }</div>
                                
                            </div>                           
                        </div>
                    </div>

                    {
                        me.properties !== undefined && me.properties["dts:icon"].toLowerCase()=== 'technical'  ?
                        <div className="row w-100 technical-container"><TechnicalDetails properties={me.properties}/></div>
                        :null
                    }
                    {
                        me.properties !== undefined && me.properties["dts:icon"].toLowerCase()=== 'company'  ?
                        <div className="row w-100 company-container"><CompanyDetails properties={me.properties}/></div>
                        :null
                    }
                    
                    
                    <div className="row">
                        { nodes ? nodes.map(  item => {
                        return(                    
                            <div className="col-md-12" key={item.entry.id}>
                                                           
                                {item.entry.properties["dts:logicalBottomNode"] ? 
                                    <ListItemWithModal item={item}/>  
                                    : 
                                    <ExpandableListItem item={item} />
                                }

                            </div>    
                        )            
                        }): <img src="/svg/loader.gif"  width="24px"/> }                 
                    </div> 
                </div>
                
                <DocumentFolderModal />
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


export default connect(mapStateToProps)(DataCategoryPage)