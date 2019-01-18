import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux'
import Api  from '../../utils/api'


class PrivateRoute extends React.Component {
    constructor(props) {
        super(props)
        this._validateToken = this._validateToken.bind(this)
        this.state = {
            isTokenValid: false,
        };

    }

    _validateToken = async () => {
        const {token} = this.props
        const response = await Api.get(Api.ENDPOINTS.validateToken(token)) 
        return response.length > -1
    }
    
    render(){
        const {component: Component, isTokenValid, ...rest} = this.props

        return(
            <Route {...rest} render={props => (
                isTokenValid                
                    ? <Component {...props} />
                    : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
            )} />
        )
    }
} 

const mapStateToProps = state => {
    return {
        isTokenValid: state.login.isTokenValid
    }
}


export default connect(mapStateToProps)(PrivateRoute)