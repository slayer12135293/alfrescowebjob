import React, { Component } from 'react'
import Api from '../../utils/api'


class SearchResultRedirectingPage extends Component {
    async componentDidMount(){
        const { history } = this.props
        const { state } = this.props.location

        const path = state.itemObj.path
        const pathArray = path.split('/')
        const nodeRefArray=state.itemObj.nodeRef.split('/')
        const nodeId = nodeRefArray[nodeRefArray.length -1]

        if(path === ''){
            history.push(`/${state.itemObj.title}/${nodeId}/estates`)
        }
        if(pathArray.length === 1){
            const me = await Api.get(Api.ENDPOINTS.getNode(nodeId), false)            
            history.push(`/${state.itemObj.path}/${me.entry.parentId}/${state.itemObj.title}/${nodeId}/estate`)
        }

        if(pathArray.length === 2){
            const me = await Api.get(Api.ENDPOINTS.getNode(nodeId), false)     
            const parent = await Api.get(Api.ENDPOINTS.getNode(me.entry.parentId), false)        
            history.push(`/${pathArray[0]}/${parent.entry.parentId}/${pathArray[1]}/${me.entry.parentId}/estate`)
        }

        if(pathArray.length >= 3){            
            const pathArrayLength = pathArray.length
            const me = await Api.get(Api.ENDPOINTS.getNode(nodeId), false)   
            let ancestors = [me]
            for (let i = 0; i< pathArrayLength ; i++) {
                const node = await Api.get(Api.ENDPOINTS.getNode(ancestors[ancestors.length-1].entry.parentId), false)
                ancestors.push(node)   
            }
            history.push(`/${pathArray[0]}/${ancestors[pathArrayLength-1].entry.parentId}/${pathArray[1]}/${ancestors[pathArrayLength-2].entry.parentId}/${pathArray[2]}/${ancestors[pathArrayLength-3].entry.parentId}/datacategory`)
            
        }


    }
    render() {
        return (
            <div>
                <img src="/svg/loader.gif" style={{width:"56px", height:"56px", position:"absolute", top:"50%", left:"50%", marginLeft:"-28px", marginTop:"-28px"}} /> 
            </div>
        )
    }
}

export default SearchResultRedirectingPage