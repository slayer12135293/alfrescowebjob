import React from 'react'

import PropTypes from "prop-types"
import Api from '../../../utils/api'

class AsyncImage extends React.Component {
    // constructor(props){
    //     super(props);
    //     this.state={
    //       imgSrc: '',
    //       storeId: ''
    //     }
    //   }

    // componentDidMount(){
    //     const {imgPath, ticket} = this.props
    //     this.setState({
    //         imgSrc: `${Api.baseUrl}/alfresco/api/-default-/public/cmis/versions/1.1/browser/root/Sites/${encodeURI(imgPath)}/facade_large.png?alf_ticket=${ticket}`,
            
    //     })
    // }

    // async _fetchThumbImg(containerId, ticket){
    //     const nodesResponse = await Api.get(Api.ENDPOINTS.nodes(containerId,ticket), false)   

    //     const itemID = nodesResponse.list.entries.find(x=>x.entry.name.toLowerCase() === 'facade_large.png').entry.id
    //     console.log(nodesResponse.list.entries)
    //     return itemID? itemID: ''

    // }

    render(){        
        const {imgPath, ticket, className} = this.props
        return(
                         
                <img className={className}
                    src={`${Api.baseUrl}/alfresco/api/-default-/public/cmis/versions/1.1/browser/root/Sites/${encodeURI(imgPath)}/facade_large.png?alf_ticket=${ticket}`}></img>               
            
        )

    }
}


AsyncImage.propTypes ={
    imgPath: PropTypes.string.isRequired,    
    ticket: PropTypes.string.isRequired
}



export default AsyncImage

