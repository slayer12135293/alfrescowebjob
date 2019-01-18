import React from 'react'
import { connect } from 'react-redux'
import { logOut } from '../../loginPage/thunks'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './header.scss'
import * as Feather from 'react-feather'
import Search from '../freeTextSearch/search'


class Header extends React.Component{
    constructor(props){        
        super(props)
        this._logout = this._logout.bind(this)
    }


    async _logout(e) {
        e.preventDefault()
        const { logOut, ticket } = this.props
        await logOut(ticket)
        window.location.href = "/" // fix for switching user, login redirect to start page
    }

    render(){
        const {userName} = this.props      
        return(    
            <header className="site-header">
                <div className="row flex-nowrap justify-content-between align-items-center">
                    <div className="col-2 pt-1" >
                        <Link to={`/`} className="site-logo" title="Datscha"></Link> 
                    </div>                    
                    <div className="col-10 d-flex justify-content-end align-items-center">
                        <div className="header-search">
                            <Search/>
                        </div>
                        <div className="user-container">
                            <Feather.User/>
                            <div className="user-name">{userName}</div>
                        </div>
                        <button type="button" className="logout-button" onClick={this._logout}>                         
                            <Feather.LogOut />
                            <span className="button-text">Log out</span>
                        </button>
                    </div>                    
                </div>
                <div className="header-search-mobile">                       
                    <Search/>
                </div>
            </header>
        )
    }

}

Header.PropTypes ={
    userName: PropTypes.element.isRequired,
}



const mapStateToProps = state => {
    return {
        ticket: state.login.token,
        userName: state.login.userName
    }
  }

const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        logOut,
    }, dispatch)
  }
  
export default  connect(mapStateToProps,mapDispatchToProps)(Header)