import React, { Component } from 'react'
import { connect } from 'react-redux'
import './list-item.scss'
import Api from '../../../utils/api'
import * as icons from 'react-icons/fa'
import { Link } from 'react-router-dom'

class DocumentItem extends Component {
   
    render() {
        const {item, ticket} = this.props
        
        const imgSrc = `${Api.baseUrl}/alfresco/service/api/node/workspace/${item.node.nodeRef.replace('workspace://','')}/content/thumbnails/doclib?alf_ticket=${ticket}`
        const fileLink = `${Api.baseUrl}/alfresco/service/slingshot/node/content/workspace/${item.node.nodeRef.replace('workspace://','')}/${item.name}?a=true&alf_ticket=${ticket}`

        const pathArry = item.path.split('/')
        const pathLinkText = `${pathArry[0]} / ${pathArry[1]} / ${pathArry[2]} /` 
        let PathLinkRest = ''
        for(let i =  3 ; i < pathArry.length;  i++   ){
            PathLinkRest +=  ` ${pathArry[i]} / `  
        }


        return (
            <div className="document-item-container">
                <a href={fileLink}>
                    <div className="thumbnail">                    
                        <img className="hover-layer" title="Download" src={imgSrc}></img>                   
                    </div>
                </a>  
                    <div className="label-container">
                        <div className="label-text">{item.displayName}</div>
                        {
                            item.node.properties["cm:author"] !== undefined ?
                            <div className="label-undertext">Author: {item.node.properties["cm:author"]}</div>
                            :null
                        }
                        
                        <div className="label-undertext">Size: {formatBytes(item.size)}</div>
                     
                        <div className="label-undertext"> 
                            <Link to={{pathname: '/searchresultredirect', state:{itemObj:item}}} >
                                <icons.FaHome/> / {pathLinkText} 
                            </Link>    
                            {PathLinkRest} 
                        </div>
                    </div>
                             
            </div>
        )
    }
}

const formatBytes = (bytes, decimals) =>{
    if(bytes == 0) return '0 Bytes'
    let k = 1024,
        dm = decimals <= 0 ? 0 : decimals || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


const mapStateToProps = state => {
    return {
        ticket: state.login.token
    }
}


export default connect(mapStateToProps)(DocumentItem)