import React from 'react'
import Api  from '../../utils/api'
import './document-folder-modal.scss'
import { connect } from 'react-redux'
import * as Feather from 'react-feather'

class FileNode extends React.Component{

    render(){
        const{ 
            fileId, 
            fileName, 
            ticket, 
            archiveFolderId, 
            moveToArchive, 
             } = this.props        

        const fileLink = `${Api.baseUrl}/alfresco/service/slingshot/node/content/workspace/SpacesStore/${fileId}/${fileName}?a=true&alf_ticket=${ticket}`
        return (
            <div className="row document-row">
                <div className="m-0 p-0 folder-label" >                                                
                       
                    <div  className="hover-thumbnail">                        
                        <div className="icon-file"/>
                        <h4 className="align-bottom ">
                            {fileName}                              
                        </h4> 
                        <a href={fileLink}>
                            <img className="hover-layer" title="Download"  src={`${Api.baseUrl}/alfresco/service/api/node/workspace/SpacesStore/${fileId}/content/thumbnails/doclib?alf_ticket=${ticket}`}></img>
                        </a>                       
                
                    </div>

                    {
                        archiveFolderId !== '' ?
                        <a href="#" className="float-right ml-2" onClick={ ()=> moveToArchive(fileId)}> <img src="/svg/icons8-archive-folder.svg"  width="24px" title="Move to Archive folder"/> </a>
                        :null
                    }

                    <a href={fileLink}><Feather.Download className="float-right" /></a>    
                                 
                </div> 
                
            
                
            </div>
            
             
        )
    }

}

const mapStateToProps = state => {
    return {
        ticket: state.login.token
    }
}



export default connect(mapStateToProps)(FileNode) 