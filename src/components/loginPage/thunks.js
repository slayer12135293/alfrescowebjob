
import Api from '../../utils/api'
import * as actions from '../../reducers/loginReducer'


export const logIn = (username, password) => {
    return async dispatch => {   

        const loginResponse = await Api.login(Api.ENDPOINTS.login,
             {username, password}, false)   

        const ticket = loginResponse.data.ticket
        dispatch(actions.saveToken(ticket))          
        dispatch(actions._logIn(username))  

        const sitesResponse = await Api.get(Api.ENDPOINTS.sites(username), false)
        const siteName = sitesResponse[0].shortName

        const containerResponse = await Api.get(Api.ENDPOINTS.containers(siteName), false)
        const containerId = containerResponse.list.entries[0].entry.id
        
        dispatch(actions.saveSiteInfo(siteName,containerId))      
        
    }
}

export const validateToken = token => {
    return async dispatch => {
        const authResponse = await Api.get(`${Api.ENDPOINTS.saveToken}/${token}`,null, false)
        dispatch(actions.validateToken(authResponse.token))       

    }
}


export const logOut = ticket => {
    return async dispatch =>{
        await Api.delete(Api.ENDPOINTS.logout(ticket))
        dispatch(actions.logOut())
    }
}