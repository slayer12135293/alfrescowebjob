import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import StatusIcon from '../statusIcon/statusIcon'
import './common-list-item.scss'
import DataCategoryIcon  from '../../common/dataCategoryIcon/dataCategoryIcon'
import * as Feather from 'react-feather'


class CommonListItem extends Component {

    render() {
        const { linkUrl, item } = this.props
        return (
            <Link
                to={{
                    pathname:linkUrl,                                  
                }}>
                <div className="common-list-item-container">                                    
                    <div className="item-icon">
                        {
                            item.entry.properties["dts:icon"] !== undefined ?
                            <DataCategoryIcon iconType = {item.entry.properties["dts:icon"]}/>
                            :<img src="/svg/icons8-spiral-bound-booklet.svg"/>
                        }
                        
                    </div>
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
                        <Feather.ChevronRight /> 
                    </div>                                                                    
                </div>                                 
            </Link>
        )
    }
}

export default CommonListItem