import React from 'react'
import './file-category-page.scss'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Layout from '../common/layout/layout'
import Api from '../../utils/api'
import DocumentFolderModal  from '../../lib/documentFolderModal'
import ListItemWithModal from '../common/listItemWithModal/listItemWithModal'

import * as icons from 'react-icons/fa'

class FileCategoryPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
          nodes: [],
          me:{},
          imgUrl:'', 
          estate:{},  
        }
      }
    componentDidMount(){
        const{ siteName,ticket } = this.props
        const { filecategoryid, estateid, portfolioname,estatename } = this.props.match.params
        this._fetchNodes(filecategoryid)     
        this._fetchNode(filecategoryid)  
        this._fetchEstateNode(estateid) 

        const tempPath = `${siteName}/documentLibrary/${portfolioname}/${estatename}`
        this.setState({
            imgUrl:`${Api.baseUrl}/alfresco/api/-default-/public/cmis/versions/1.1/browser/root/Sites/${encodeURI(tempPath)}/facade_large.png?alf_ticket=${ticket}`
        })
    }

    async _fetchNode(containerId) {
        const node = await Api.get(Api.ENDPOINTS.getNode(containerId), false)   
        this.setState({me:node.entry})
    }
    async _fetchEstateNode(estateId){
        const node = await Api.get(Api.ENDPOINTS.getNode(estateId), false)   
        this.setState({estate:node.entry}) 
    }
    
    async _fetchNodes(containerId) {
        const nodesResponse = await Api.get(Api.ENDPOINTS.nodes(containerId), false)   
        this.setState({nodes: nodesResponse.list.entries})    
    }

    render() {
        const {nodes, me, imgUrl, estate } = this.state
        const {
            portfolioname, 
            portfolioid, 
            estatename, 
            estateid, 
            datacategoryname, 
            datacategoryid,
        } = this.props.match.params
        return(
            <div>
                <Layout>
                <div className="row">
                    <nav>
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
                            <li className="breadcrumb-item"> 
                                <Link 
                                    to={{
                                        pathname: `/${portfolioname}/${portfolioid}/${estatename}/${estateid}/${datacategoryname}/${datacategoryid}/datacategory`,                                       
                                    }}
                                    >{datacategoryname}
                                </Link>
                            </li>                            
                            <li className="breadcrumb-item active" aria-current="page"></li>
                        </ol>
                    </nav>                    
                </div>
                <div className="jumbotron jumbotron-fluid" style={{backgroundImage:`url(${imgUrl})`}}>
                    <div className="container">
                        <h1 className="display-4">{estatename}</h1>
                        <p className="lead">{estate.properties!== undefined? estate.properties["dts:address"]:'' }</p>
                    </div>
                </div> 
                   
                <div className="row">
                    <div className="col-md-12">
                        <h3>{me.name}</h3>
                    </div>
                </div>    
                <div className="row">
                    { nodes ? nodes.map(  item => {
                    return(                    
                        <div className="col-md-6" key={item.entry.id}>
                            <ListItemWithModal item={item}/>
                        </div>    
                    )            
                    }): <div/>}                 
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


  
export default connect(mapStateToProps)(FileCategoryPage)