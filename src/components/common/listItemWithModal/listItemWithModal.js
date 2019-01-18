import React, { Component } from 'react'
import StatusIcon from '../statusIcon/statusIcon'
import './list-item-with-modal.scss'
import * as Feather from 'react-feather'


class ListItemWithModal extends Component {
    render() {
        const { item } = this.props
        return (
            <div className="list-item-container modal-link"
                data-toggle="modal" 
                data-target="#documentFolder" 
                data-containerid={item.entry.id}
                data-containername={item.entry.name}
                data-properties={JSON.stringify(item.entry.properties) }
                data-backdrop="static" data-keyboard="false"
            >                                
                
                <div className="status-icon ">
                    {
                        item.entry.properties["dts:isObsolete"] !== true ?
                        <StatusIcon iconStatus = {item.entry.properties["dts:trafficlightStatus"]} />
                        :<StatusIcon iconStatus = 'grey' />                        
                    }
                    
                </div>
                <div className="label ">
                    
                    {
                        item.entry.properties["dts:isObsolete"] !== true ?
                        <h2>{item.entry.name}</h2>
                        : <h2 className="obsolete">{item.entry.name}</h2>
                    }
 
 
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

export default ListItemWithModal