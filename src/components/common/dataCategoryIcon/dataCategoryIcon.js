import React, { Component } from 'react'

class DataCategoryIcon extends Component {
    constructor(props){
        super(props)
        this.state ={
            imgSrc: 'icons8-folder'
        }
    }

    componentDidMount() {
        const {iconType} = this.props
        switch(iconType) {
            case "company":
                this.setState({
                    imgSrc: "icons8-business-group"
                })
            break;
            case "maintenance":
                this.setState({
                    imgSrc: "cogs"
                })
            break;
            case "property":
                this.setState({
                    imgSrc: "icons8-skyscrapers"
                })
            break;            
            case "finance":
                this.setState({
                    imgSrc: "icons8-duration-finance"
                })
            break;            
            case "tennants":
                this.setState({
                    imgSrc: "icons8-working-parents"
                })
            break;            
            case "enviornment":
                this.setState({
                    imgSrc: "icons8-quill-pen"
                })
            break;            
            case "VAT":
                this.setState({
                    imgSrc: "icons8-money-bag"
                })
            break;            
            case "audit":
                this.setState({
                    imgSrc: "icons8-spiral-bound-booklet"
                })
            break;            
            case "tax":
                this.setState({
                    imgSrc: "icons8-tax"
                })
            break;            
            case "technical":
                this.setState({
                    imgSrc: "icons8-sync-settings"
                })
            break;  
        }
    }



    render() {
        const {imgSrc} = this.state
        return (
            <img src={`/svg/${imgSrc}.svg`}/>
        )
    }
}

export default DataCategoryIcon