import React from 'react';
import { connect } from 'react-redux'
import Api  from '../../utils/api'
import './document-folder-modal.scss'
import FileContainer from './fileContainer'
import * as Feather from 'react-feather'
import StatusIcon  from '../../components/common/statusIcon/statusIcon'
import format from 'date-fns/format'
import compareAsc from 'date-fns/compare_asc'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"



class DocumentFolderModal extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            header: '',
            containerId: '',
            uploadingFileName:'',
            rejectedFiles:[],
            errorText:'',
            expiredDate: new Date(),
            isEditing: false,
            trafficLight: '',
            me:{},
            responsiblePerson: '',
            responsiblePersonEmail: '',
            responsiblePersonPhone: '',
            
        }   

        this._saveExpiredDate = this._saveExpiredDate.bind(this)
        this._cancelExpiredDateEdit = this._cancelExpiredDateEdit.bind(this)
        this._onEditClick = this._onEditClick.bind(this)
        this._datePickerHandelChange = this._datePickerHandelChange.bind(this)
    }


    
    _onEditClick(){
        this.setState({
            isEditing: true
        })
    }

    _cancelExpiredDateEdit(){
        this.setState({
            isEditing: false            
        })
    }

    _datePickerHandelChange(date){
        this.setState({
            expiredDate: date
        })        
    }
    async _saveExpiredDate(){
        const { expiredDate, containerId } = this.state
        const today = new Date()
        let trafficLight = 'YELLOW'
        const result = compareAsc(expiredDate, today)
        if(result === 1){
            trafficLight ="GREEN"    
        }

        if(result === -1){
            trafficLight ="RED"
        }


        const payload = {
            "properties": {
                "dts:ExpiryMonth": expiredDate,
                "dts:trafficlightStatus": trafficLight
            }
        }
        const updatedNode = await Api.put(Api.ENDPOINTS.updateNode(containerId), payload)
        if(updatedNode){            
            this.setState({
                expiredDate: updatedNode.entry.properties["dts:ExpiryMonth"],
                trafficLight: updatedNode.entry.properties["dts:trafficlightStatus"],
                isEditing: false,  
                me: updatedNode.entry
            })
        }

    }


    componentDidMount(){
        $('#documentFolder').on('show.bs.modal', (event) => { 
            const button = $(event.relatedTarget) 
            const containerid = button.data('containerid') 
            const containerName = button.data('containername')
            this.setState({
                header: containerName,
                containerId: containerid,
            })  
            this._fetchNode(containerid)      
          })

        $('#documentFolder').on('hide.bs.modal', () => {        
            this._cancelExpiredDateEdit()
        })

    }


    async _fetchNode(containerId){
        const nodeResponse = await Api.get(Api.ENDPOINTS.getNode(containerId))
        this.setState({
            me: nodeResponse.entry,
            expiredDate: nodeResponse.entry.properties["dts:ExpiryMonth"],
            trafficLight: nodeResponse.entry.properties["dts:trafficlightStatus"]
        })


        if(nodeResponse.entry.properties["dts:responsible"] !== undefined){
            this.setState({
                responsiblePerson: nodeResponse.entry.properties["dts:responsible"],
                responsiblePersonEmail: nodeResponse.entry.properties["dts:ResponsibleEmail"] !== undefined ? nodeResponse.entry.properties["dts:ResponsibleEmail"] : '' ,
                responsiblePersonPhone: nodeResponse.entry.properties["dts:ResponsiblePhone"] !== undefined ? nodeResponse.entry.properties["dts:ResponsiblePhone"] : '',
            })
        } else {
            await this._setResponsiblePerson(nodeResponse)            
        }
    }
    
    async _setResponsiblePerson(nodeResponse){
        let tempNode = nodeResponse.entry.parentId
        let notFound = true
        do {
            const parentNode = await Api.get(Api.ENDPOINTS.getNode(tempNode))
            if(parentNode.entry.properties["dts:responsible"] !== undefined){
                this.setState({
                    responsiblePerson: parentNode.entry.properties["dts:responsible"],
                    responsiblePersonEmail: parentNode.entry.properties["dts:ResponsibleEmail"],
                    responsiblePersonPhone: parentNode.entry.properties["dts:ResponsiblePhone"],
                })
                notFound = false
            } else {
                tempNode = parentNode.entry.parentId
            }
        }
        while (notFound)
    }




    render(){
        const { 
            header, 
            containerId, 
            isEditing,
            expiredDate,
            me,
            trafficLight,
            responsiblePerson,
            responsiblePersonEmail,
            responsiblePersonPhone,
         } = this.state
            
        
        return(
            <div>
                <div 
                    className="modal fade" 
                    id="documentFolder" 
                    tabIndex="-1" 
                    role="dialog" 
                    aria-labelledby="modalCenterTitle" 
                    aria-hidden="true"
                >
                <div className="modal-container modal-dialog-centered">
                    <div className="modal-dialog modal-lg " role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title" id="modalCenterTitle">                                    
                                    {
                                        trafficLight !== ''?
                                        <div className="status-icon-modal-header">
                                            <StatusIcon iconStatus = {trafficLight}/>
                                        </div> 
                                        :null
                                    }
                                    {header}
                                </h1>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <Feather.X size="32"/>
                                </button>
                            </div>
                            <div className="modal-body">

                                <div className="row content-row">
                                   <div className="col-md-3 cell"><h2>Utgångsmånad</h2></div>  
                                   <div className="col-md-9">                                                                                
                                        {
                                            me.properties!== undefined && me.properties["dts:ExpiryMonth"] !== undefined?                                            
                                            isEditing?
                                            <div>                                                
                                                <DatePicker
                                                    className="form-control"
                                                    selected={expiredDate}
                                                    onChange={this._datePickerHandelChange}
                                                    dateFormat='yyyy-MM-dd'
                                                />
                                                <img src={'/svg/icons8-save.svg'} onClick={this._saveExpiredDate} className="edit-icons"/>
                                                <img src={'/svg/icons8-delete.svg'} onClick={this._cancelExpiredDateEdit} className="edit-icons"/>
                                            </div>
                                            :<div className={trafficLight}>{ format(expiredDate, 'YYYY-MM-DD') }                                                 
                                                <img src={'/svg/icons8-pencil.svg'} onClick={this._onEditClick} className="edit-icons"/>
                                            </div>  
                                     
                                            :null
                                        }

                                   </div>  
                                </div>

                                <div className="row content-row">
                                   <div className="col-md-3 cell"><h2>Ansvarig</h2></div>  
                                   <div className="col-md-9">
                                        {responsiblePerson}<br/>
                                        {responsiblePersonEmail}<br/>
                                        {responsiblePersonPhone}
                                   </div>  
                                </div>

                                {
                                    me.properties!== undefined && me.properties['dts:leaseStart'] !== undefined && me.properties['dts:leaseEnd'] !== undefined ?
                                    <div>
                                        <div className="row content-row">
                                            <div className="col-md-3 cell"><h2>Floor</h2></div>  
                                            <div className="col-md-9">
                                                { me.properties['dts:floor'].toString() }
                                            </div>  
                                        </div>
                                        <div className="row content-row">
                                            <div className="col-md-3 cell"><h2>Rent</h2></div>  
                                            <div className="col-md-9">
                                                { me.properties['dts:rent'] }
                                            </div>  
                                        </div>
                                        <div className="row content-row">
                                            <div className="col-md-3 cell"><h2>Lease period</h2></div>  
                                            <div className="col-md-9">
                                                { format(me.properties['dts:leaseStart'], 'YYYY-MM-DD') } till {format(me.properties['dts:leaseEnd'], 'YYYY-MM-DD')}
                                            </div>  
                                        </div>
                                    </div>    
                                    :null
                                }
                                    

                            

                            <h2>Dokument</h2> 
                            <div className="row">   
                                {
                                    containerId ? <FileContainer containerId={containerId} archiveFolderId/> : null
                                }
                            </div>
                          
                            </div>
                            <div className="modal-footer"> 
                                <button type="button" className="btn btn-secondary" data-dismiss="modal" >Close</button>
                            </div>
                        </div>
                    </div>

                </div>

                </div>
            </div>
        )
    }
} 


const mapStateToProps = state => {
    return {
        isTokenValid: state.login.isTokenValid
    }
}


export default connect(mapStateToProps)(DocumentFolderModal)