import React from 'react';
import './document-folder-modal.scss'
import NodeList from './nodeList'

class FolderNode extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            isExpanded: false,
            nodes:[],
        }
    }
 
    _onClick = () =>{
        this.setState(prevState => ({
            isExpanded: !prevState.isExpanded
          }))
        this.forceUpdate();
    }

    render(){
        const {containerId, containerName, ticket } = this.props
        const {isExpanded} = this.state
        return(
            <div className="row">
                <div className="col-md-12 m-0 p-0" >
                                           
                        <div className="img-icon" onClick={this._onClick}>
                            {
                                isExpanded? 
                                //<icons.FaFolderOpen style={{fontSize:"40px", color:"FFC82C"}} />                                 
                                <div className="icon-folder"/>   
                                :                                    
                                <div className="icon-folder"/> 
                                //<icons.FaFolder style={{fontSize:"40px", color:"FFC82C"}} />
                            }                              
                            
                        </div>
                        <div className="folder-label">
                            <h4 className="align-bottom">{containerName}</h4>   
                        </div>                                                                             
                        
                                                                             
                    
                </div> 
                <div className="col-mid-12">
                    { isExpanded ? <NodeList  containerId = {containerId} ticket={ticket} />: null }
                    
                </div>
               
                
            </div>
        )
    }
}

export default FolderNode