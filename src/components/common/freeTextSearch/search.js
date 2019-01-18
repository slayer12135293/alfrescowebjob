import React, { Component } from 'react'
import { connect } from 'react-redux'
import Autosuggest from 'react-autosuggest'
import './search.scss'
import Api from '../../../utils/api'
import DocumentItem from './documentItem'
import FolderItem from './folderItem'
import * as Feather from 'react-feather'


class Search extends Component {
    constructor(props){
        super(props)

        this.state= {
            value: '',
            suggestions: [],
            isSearchLoading: false
        }

        this._onChange= this._onChange.bind(this)
        this._onSuggestionsFetchRequested= this._onSuggestionsFetchRequested.bind(this)
        this._onSuggestionsClearRequested= this._onSuggestionsClearRequested.bind(this)
        this._onSelected= this._onSelected.bind(this)
        this._getSuggestionValue= this._getSuggestionValue.bind(this)
        
    }
    
    _onChange = (event, { newValue }) => {
        this.setState({
          value: newValue
        });
      }
      
    _onSuggestionsFetchRequested = async ({ value }) => {       

        if(value.length > 2){
           await this._getSuggestions(value)           
        } else{
            this._onSuggestionsClearRequested()
        }
        
    }

    _getSuggestions= async (value) => {
        const {siteName} = this.props
        const escapedValue = escapeRegexCharacters(value.trim())
        
        
        if (escapedValue === '') {
          return [];
        }    
     
        this.setState({
            isSearchLoading:true
        })
        const searchResponse = await Api.get(Api.ENDPOINTS.search(value, siteName))
        const items = searchResponse.items
        if(items.length>0){
            this.setState({
                suggestions : items,
            })
        }
        this.setState({
            isSearchLoading:false,
        })
    
      }

    _getSuggestionValue(suggestion) {
        return `${suggestion.displayName}`
    }

    _onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    _onSelected = () => {
        this.setState({
            isSearchLoading:false,
        })
    }

    
    render() {
        const { value, suggestions, isSearchLoading } = this.state;
        const inputProps = {
            placeholder: "minst 3 bokstäver",
            type:"search",
            value,
            onChange: this._onChange
            }
        return (
            
            <div className="search-container">
                
                <div className="search-icon">
                    <Feather.Search size={20} /> 
                </div>                
                <Autosuggest 
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this._onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this._onSuggestionsClearRequested}
                    getSuggestionValue={this._getSuggestionValue}
                    renderSuggestion={renderSuggestion}
                    inputProps={inputProps}
                    onSuggestionSelected ={this._onSelected}
                >
                </Autosuggest>              
                
                { 
                    isSearchLoading ? 
                    <img src="/svg/loader.gif"  className="loading-img"/> 
                    :null            
                }
            </div>

        )
    }
}



  function escapeRegexCharacters(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
  
  
  function renderSuggestion(suggestion) {  
    return (
        <div className="search-result-list">
            {
                suggestion.mimetype === "application/octet-stream" ?
                <FolderItem item={suggestion}/>
                :<DocumentItem item={suggestion} />
            }
        </div>
    );
  }  


const mapStateToProps = state => {
    return {
        ticket: state.login.token,
        siteName: state.login.siteName,
    }
  }

export default connect(mapStateToProps)(Search)