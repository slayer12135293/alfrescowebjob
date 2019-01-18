const BASE_URL ="http://51.145.157.100:8080"

import * as actions from '../reducers/loginReducer'
import Store from '../store/configureStore'
const store = Store


const Api = {
    baseUrl:BASE_URL,
    ENDPOINTS: {
        login: '/alfresco/service/api/login',
        validateToken: (ticket) => `/alfresco/s/api/login/ticket/${ticket}`,
        logout: ticket=> `/alfresco/service/api/login/ticket/${ticket}`,
        sites: (userId) => `/alfresco/service/api/people/${userId}/sites?`,
        containers: (siteName) => `/alfresco/api/-default-/public/alfresco/versions/1/sites/${siteName}/containers?`,
        nodes: (containerId, params='&where=(isFolder=true)') => `/alfresco/api/-default-/public/alfresco/versions/1/nodes/${containerId}/children?include=properties${params}&`,
        getNode: (containerId) => `/alfresco/api/-default-/public/alfresco/versions/1/nodes/${containerId}?include=properties&`,
        getImageUrl: (spaceStoreId, fileName) => `/share/proxy/alfresco/slingshot/node/content/workspace/SpacesStore/${spaceStoreId}/${fileName}?`,
        updateNode: (nodeId) => `/alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}?`,
        moveNode: (nodeId) => `/alfresco/api/-default-/public/alfresco/versions/1/nodes/${nodeId}/move?`,
        uploadFiles: `/alfresco/service/api/upload?`,
        search: (term, site) => `/alfresco/s/slingshot/search?rootNode=alfresco://company/home&site=${site}&term=*${term}*&`
    },

    async get(path, autologout = true) {
        return _request(path, 'GET', null, autologout)
    },

    async post(path, payload, isFormData = false) {
        return _request(path, 'POST', payload, isFormData)
    },

    async put(path, payload) {
        return _request(path, 'PUT', payload)
    },

    async patch(path, payload, autoLogout = true) {
        return _request(path, 'PATCH', payload, autoLogout)
    },

    async delete(path, payload, autoLogout = true) {
        return _request(path, 'DELETE', payload, autoLogout)
    },

    async login(path, payload){
        const requestParams = {
            method :'POST',
            headers: {
                //'Content-Type': 'application/json',
            },
            
        }       
        requestParams.body = JSON.stringify(payload)
        const url = `${BASE_URL}${path.replace('//', '/')}`     
     
        try {
            const response = await fetch(url, requestParams)
            if (response.ok) {    
                try {
                    const result = await response.json()
                    return result
                } catch (error) {              
                    console.log(error)
                }
            } else {
                if (response.status === 401) {
                    Store.dispatch(actions.logOut()) 
                    window.location.replace('/login');
                }
                if (response.status === 403) {
                    //Store.dispatch(actions.logOut()) 
                    alert("you don't have the permission to do this operation")
                }
            }
    
        } catch (err) {
            Store.dispatch(actions.logOut()) 
            window.location.replace('/login');
        }
    
    }
    
}

const _request = async (path, method = 'GET', payload, isFormData=false) => {
    const requestParams = {
        method,
        // headers: {
        //     //'Content-Type': 'application/json',
        // },
        // mode: 'cors'
        
    }
    if (method !== 'GET') {
        isFormData? requestParams.body = payload:requestParams.body = JSON.stringify(payload)
        
    }
    const ticket = store.getState().login.token
    const url = `${BASE_URL}${path.replace('//', '/')}alf_ticket=${ticket}` 

    console.log(
        `%c${method} %c${url}%c with payload: `,
        'color: #c242f4',
        'color: blue',
        'color: black',
        payload,
        ' and headers',
        //requestParams.headers
    )
    
    try {
        const response = await fetch(url, requestParams)
        if (response.ok) {
            if (response.status === 204) {
                return {}
            }
            if (response.status === 403) {
                alert ('forbidden')
            }           

            try {
                const result = await response.json()
                return result
            } catch (error) {              
                console.log(error)
            }
        } else {
            if (response.status === 401) {
                Store.dispatch(actions.logOut()) 
                window.location.replace('/login');
            }
        }

    } catch (err) {
        Store.dispatch(actions.logOut()) 
        window.location.replace('/login');

    }

}

export default Api