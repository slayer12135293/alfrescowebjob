import React from 'react';
import './document-folder-modal.scss'
import FileContainer from './fileContainer'


class NodeList extends React.Component{
   
    render(){
        const{containerId} = this.props
        return (            
            <div className="col-md-12 ml-3">                    
                {
                    containerId ? <FileContainer containerId={containerId}/> : null
                }
            </div>  
            
        )
    }

}

export default NodeList