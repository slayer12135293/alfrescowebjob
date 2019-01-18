import React from 'react';
import Api  from '../../../utils/api'
import NoneExpandableListItem from './noneExpandableListItem'

class ExpandableContainer extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            nodes:[],
            isLoading: true
        }
    }
    componentDidMount(){
        const {containerId} = this.props
        if(containerId !== ''){
            this._fetchFiles(containerId)
        }
    }

    UNSAFE_componentWillReceiveProps(){
        const {containerId} = this.props
        if(containerId !== ''){
            this._fetchFiles(containerId)
        }
    }

    async _fetchFiles(containerId){
        const filesResponse = await Api.get(Api.ENDPOINTS.nodes(containerId, ''))
        this.setState({nodes:filesResponse.list.entries})
        if(filesResponse.list!== undefined){
            this.setState({isLoading:false})
        }     
    }   

    render(){
        const { nodes, isLoading } = this.state        
        return(            
            <div> 
                {   
                    nodes && nodes.length > 0 ?                
                    nodes.map(item=>{
                        if(item.entry !== undefined && item.entry.properties["dts:logicalBottomNode"]){
                            return (<NoneExpandableListItem key={item.entry.id} item={item}/>)
                        }
                        else{
                            // return (<ExpandableListItem key={item.entry.id} fileId={item.entry.id} fileName={item.entry.name} /> )                                                        
                            return ('')
                        }
                        
                    })
                    :isLoading?<img src="/svg/loader.gif"  width="24px"/>:null 
                }               
               
            </div>
        )
    }
}


export default ExpandableContainer


