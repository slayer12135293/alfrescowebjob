import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as icons from 'react-icons/fa'

class FolderItem extends Component {
    constructor(props){
        super(props)
        this.state={
            iconName: 'icons8-folder'
        }
    }

    componentDidUpdate(previousProps) {
        const {item} = this.props
        if(item !== '' && previousProps.item !==item){
            if(item.path === ''){
                this.setState({
                    iconName:'icons8-business'
                })
            } else{
                const pathArray = item.path.split('/') 
    
                if(pathArray.length === 1){
                    this.setState({
                        iconName:'icons8-apartment'
                    })
                } else{               
                    this.setState({
                        iconName:'icons8-folder'
                    })
                }
            }
        }
        
    }


    render() {
        const {item} = this.props
        const {iconName} = this.state
        const iconSrc = `/svg/${iconName}.svg`
        return (
            <div className="folder-item-container">
                <Link to={{pathname: '/searchresultredirect', state:{itemObj:item}}} >
                    <div className="icon">
                        <img src={iconSrc} />
                    </div>
                    <div className="label-container">
                        <div className="label-text">{item.displayName}</div>
                        <div className="label-undertext"><icons.FaHome/>/{item.path}</div>                        
                    </div>   
                </Link>            
            </div>
        )
    }
}

export default FolderItem