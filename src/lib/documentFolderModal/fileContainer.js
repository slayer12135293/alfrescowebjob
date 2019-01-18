import React from 'react'
import Api  from '../../utils/api'
import './document-folder-modal.scss'
import FileNode from './fileNode'
import FolderNode from './folderNode'
import Dropzone from 'react-dropzone'
import { connect } from 'react-redux'

class FileContainer extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            nodes:[],
            rejectedFiles:[],
            uploadingFileName:'',
            errorText:'',
            isLoading: false,
            showMoveToArchiveLoader: false,
            archiveFolderId:''
        }
        this._onDrop = this._onDrop.bind(this)
        this._emptyRejected = this._emptyRejected.bind(this)
        this._moveToArchive = this._moveToArchive.bind(this)
    }
    componentDidMount(){
        const {containerId} = this.props
        if(containerId !== ''){
            this._fetchFiles(containerId)
        }
    }

    componentDidUpdate(previousProps) {
        const {containerId} = this.props
        if(containerId !== '' && previousProps.containerId !==containerId){
            this._fetchFiles(containerId)
        }
    }

    _onDrop(acceptedFiles, rejectedFiles){     
        const {containerId } = this.props 
        this.setState({rejectedFiles})
        acceptedFiles.forEach( async item => {
            const payload = new FormData()
            payload.append('filedata', item, item.name)
            payload.append('destination',`workspace://SpacesStore/${containerId}` )
            this.setState({
                uploadingFileName: item.name
            })
            try{
                const response = await Api.post(Api.ENDPOINTS.uploadFiles, payload, true)
                if (response.status.code === 200){
                    this.setState({
                        uploadingFileName: ''
                    })
                    this._fetchFiles(containerId)
                } else{
                    this.setState({
                        errorText: response.name
                    })
                }

            }
            catch(err){
                console.log(err)
            }
        })        
    }

    _emptyRejected(){
        this.setState({
            rejectedFiles: []
        })        
    }

    async _moveToArchive(nodeId){        
        this.setState({
            showMoveToArchiveLoader: true
        })        
        const { archiveFolderId } = this.state
        const {containerId} = this.props        
        const payload ={
            "targetParentId" : archiveFolderId
        }
        try{
            const response = await Api.post(Api.ENDPOINTS.moveNode(nodeId), payload )
            if (response) {
                this._fetchFiles(containerId)
            }
        }
        catch (err) {
            console.log(err)
        } 
        

    }


    async _fetchFiles(containerId){
        this.setState({isLoading:true})
        const filesResponse = await Api.get(Api.ENDPOINTS.nodes(containerId, ''))
        this.setState({
            nodes: filesResponse.list.entries,
            isLoading: false,
            showMoveToArchiveLoader: false
        })    
        
        
        const archiveFolder = filesResponse.list.entries.find(x=>x.entry.isFolder && x.entry.name==="Archive")

        if(archiveFolder !== undefined){
            this.setState({
                archiveFolderId: archiveFolder.entry.id
            })
        }else{
            this.setState({
                archiveFolderId: ''
            })
        }

    }   

    render(){
        const { 
            nodes,
            uploadingFileName, 
            rejectedFiles, 
            errorText,
            isLoading,
            showMoveToArchiveLoader,
            archiveFolderId } = this.state        
        return(            
            <div className="col-md-12 file-content-container">
                <div className="row  mb-3">
                    <Dropzone
                        accept={acceptedFileTypes}
                        onDrop={this._onDrop}
                        onFileDialogCancel={this._onCancel}
                        style={dropZoneStyle}
                    >
                        <p>Drop files here or click to select files to upload. Only images and documents type are allowed</p>
                    </Dropzone>
                </div>
            
                {   
                    nodes && nodes.length > 0 ?                
                    nodes.map(item=>{
                        if(item.entry.isFolder){
                            return (<FolderNode key={item.entry.id} containerId={item.entry.id} containerName={item.entry.name}/>)
                        }
                        if(item.entry.isFile){
                            return (<FileNode key={item.entry.id} 
                                fileId={item.entry.id} 
                                fileName={item.entry.name} 
                                archiveFolderId ={archiveFolderId} 
                                moveToArchive={this._moveToArchive} /> )                            
                        }
                        
                    })
                    :isLoading?<img src="/svg/loader.gif"  width="24px"/>: null                     
                }

                {
                    showMoveToArchiveLoader ? <img src="/svg/loader.gif"  width="24px"/> : null
                }
                                                        


                <div className="row">
                    {
                        uploadingFileName !== '' ? 
                        <div className="alert alert-success w-100" role="alert">
                            <h2>{uploadingFileName} <img src="/svg/loader.gif"  width="24px"/>  </h2>
                        </div>
                        : null
                    }
                </div>
                <div className="row">
                    {
                        rejectedFiles.length>0 ?
                        <div className="alert alert-danger w-100" role="alert">
                            {
                                rejectedFiles.map(file=> <li key={file.name}> {file.name} </li> )
                            }
                            är inte tillåtet

                            <button type="button" className="close warning-close" aria-label="Close" onClick={this._emptyRejected} >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        :null
                    }
                </div>

                <div className="row">
                    {
                        errorText!==''?
                        <div className="alert alert-danger w-100" role="alert">
                            <h2>{errorText}</h2>
                        </div>
                        : null
                    }

                </div>
            </div>
        )
    }
}

const dropZoneStyle = {
    width: '50%',
    border: '2px dashed #888',
    padding: 5
}

const acceptedFileTypes= 'images/*,.txt,.pdf,.doc'

const mapStateToProps = state => {
    return {
        isTokenValid: state.login.isTokenValid
    }
}


export default connect(mapStateToProps)(FileContainer)


