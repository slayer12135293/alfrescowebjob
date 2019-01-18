import React, { Component } from 'react'
import * as icons from 'react-icons/fa';
import './status-icon.scss'

class StatusIcon extends Component {    
    constructor(props){        
        super(props)
        this.state={
            iconStatus: 'grey'            
        }               
    }
    
    componentDidMount(){
        const {iconStatus}= this.props
        switch(iconStatus) {
            case "RED":
                this.setState({
                    iconStatus: "red"
                })
            break;
            case "GREEN":
                this.setState({
                    iconStatus: "green"
                })
            break;
            case "YELLOW":
                this.setState({
                    iconStatus: "yellow"
                })
            break;            
        }

    }
    componentDidUpdate(previousProps){
        const {iconStatus} = this.props
        if(iconStatus !== previousProps.iconStatus){
            this.setState({
                iconStatus: iconStatus.toLowerCase()
            })
        }
    }

    render(){
        const { iconStatus } = this.state
        return (            
            <icons.FaCircle style={{color:iconStatus}} className="default-icon"/>           
        )
    }
}

StatusIcon.defaultProps ={
    iconStatus : "yellow"
} 


export default StatusIcon