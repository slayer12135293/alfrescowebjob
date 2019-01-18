export const SAVE_TOKEN = 'SAVE_TOKEN'
export const LOG_OUT = 'LOG_OUT'
export const LOG_IN = 'LOG_IN'
export const VALIDATE_TOKEN ="VALIDATE_TOKEN"
export const SAVE_SITE_INFO = "SAVE_SITE_INFO"


export const logOut = () => {
    return {
        type: LOG_OUT,
    }
}


export const saveToken = ticket => {
    return {
        type: SAVE_TOKEN,
        tokens: {
            ticket,            
        },
    }
}

export const _logIn = (userName) => {
    return {
        type: LOG_IN,
        userName
    }
}

export const validateToken = isValid => {
    return {
        type: VALIDATE_TOKEN,
        isTokenValid: isValid
    }
}

export const saveSiteInfo = (siteName, containerId) => {
    return {
        type: SAVE_SITE_INFO,
        siteName,
        containerId
    }
}




const initialState = {
    isLoggedIn: false,
    isTokenValid: false,
    userName:'', 
    token: '',
    siteName: '',  // 1 user 1 company 1 site, potentially more sites for 1 user in the future
    containerId: ''
}

const loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case SAVE_TOKEN:
            return {
                ...state,
                token: action.tokens.ticket,
            }        
        case LOG_OUT:
            return initialState
        case LOG_IN:
            return {
                ...state,
                userName: action.userName,
                isTokenValid: true,
                isLoggedIn: true,
            }
        case VALIDATE_TOKEN:
            return {
                ...state,
                isTokenValid: action.isTokenValid
            }     
        case SAVE_SITE_INFO:
            return {
                ...state,
                siteName: action.siteName,
                containerId: action.containerId,
            }
        default:
            return state
    }
}


export default loginReducer