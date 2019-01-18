import React, { Component } from 'react'
import StatusIcon from '../statusIcon/statusIcon'
import './expandable-list-item.scss'
import * as Feather from 'react-feather'


class NoneExpandableListItem extends Component {
    render() {
        const { item } = this.props
        return (
            
            <div className="list-item-container "
                data-toggle="modal" 
                data-target="#documentFolder" 
                data-containerid={item.entry.id}
                data-containername={item.entry.name}                
                data-properties={JSON.stringify(item.entry.properties) }
                data-backdrop="static" data-keyboard="false"                
            >    
                <div className="status-icon ">
                    <StatusIcon iconStatus = {item.entry.properties["dts:trafficlightStatus"]} />
                </div>
                <div className="label ">
                    <h2>{item.entry.name}</h2>
                    {
                        item.entry.properties["cm:description"] !== undefined ?
                        <div className="under-text">{item.entry.properties["cm:description"]}</div>
                        :null
                    }
                </div>
                <div className="arrow float-right">
                    <Feather.ChevronRight/>
                </div>                                                                    
            </div>                               
            
        )
    }
}

export default NoneExpandableListItem