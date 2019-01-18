import React, { Component } from 'react'
import StatusIcon from '../statusIcon/statusIcon'
import './expandable-list-item.scss'
import ExpandableNodeList from './expandableNodeList'
import * as Feather from 'react-feather'


class ExpandableListItem extends Component {
    constructor(props){
        super(props)
        this.state = {
            isExpanded: false,
        }
    }

    _onClick = () =>{
        this.setState(prevState => ({
            isExpanded: !prevState.isExpanded
          }))
        this.forceUpdate();
    }

    render() {
        const { item } = this.props
        const { isExpanded } = this.state
        return (
            <div>
                <div className="list-item-container expandable" onClick={this._onClick}>                                    
                    
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
                        {
                            isExpanded?
                            <Feather.ChevronUp/>:
                            <Feather.ChevronDown/>
                        }
                       
                    </div>                                                                    
                </div>  
                <div className="col-mid-12">
                    { isExpanded ? <ExpandableNodeList  containerId = {item.entry.id} />: null }
                </div>                               
            </div>
        )
    }
}

export default ExpandableListItem