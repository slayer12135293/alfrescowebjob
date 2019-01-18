import React from 'react';
import ExpandableContainer  from './expandableContainer'


class ExpandableNodeList extends React.Component{
   
    render(){
        const{containerId} = this.props
        return (            
            <div className="ml-3">                    
                <ExpandableContainer containerId={containerId} />                 
            </div>  
            
        )
    }

}

export default ExpandableNodeList