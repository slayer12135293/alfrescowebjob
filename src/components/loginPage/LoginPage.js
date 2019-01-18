import React from 'react'
import './styles/login-page.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { logIn } from './thunks'
import { history } from '../../store/configureStore'
import Footer from '../../components/common/footer/footer'


class LoginPage extends React.Component  {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            submitted: false,
            isLoading: true,
            error: ''
        };

        this._handleChange = this._handleChange.bind(this)
        this._login = this._login.bind(this)
    }

    _handleChange(e) {
        const { name, value } = e.target
        this.setState({ 
          [name]: value,
          error:'', 
        });
    }

    async _login(e) {
      e.preventDefault();
      const { logIn, history }     = this.props
      const { username, password } = this.state

      try {
          await logIn(username.trim(), password)      
          history.location.state ? 
          history.push(history.location.state.from.pathname) :   
          history.push("/")    

      } catch (error) {
        this.setState({error:'Fel användarnamn eller lösenord'})
      }     
    }


    render(){
        const { username, password, error } = this.state;
        return (
          <div className="login-body">
            <div id="loginPage" className="rounded">      
                <div className="row d-flex justify-content-center">        
                  <div className="col-md-12">
                    <div className="d-flex justify-content-center">
                      <div className="login-logo" title="Datscha">
                          <svg xmlns="http://www.w3.org/2000/svg">
                            <path d="m33.4 0h63.1c3.1 0 6 1.7 7.9 4.7l15.6 23.8-15.6 23.8c-1.9 3-4.8 4.7-7.9 4.7h-63c-5.6 0-10.2-5.7-10.2-12.7v-31.6c-.1-7 4.5-12.7 10.1-12.7z" fill="#64a9fc"/>
                            <path d="m23.2 0h63c3.1 0 6 1.7 7.9 4.7l15.6 23.8-15.5 23.8c-1.9 3-4.8 4.7-7.9 4.7h-63c-5.7 0-10.3-5.7-10.3-12.7v-31.6c0-7 4.6-12.7 10.2-12.7z" fill="#1268fb"/>
                            <path d="m84 4.7c-2-3-4.8-4.7-7.9-4.7h-72.1c-2.2 0-4 1.8-4 4v49c0 2.2 1.8 4 4 4h72.1c3.1 0 6-1.7 7.9-4.7l15.6-23.8z" fill="#132766"/>
                            <path clipRule="evenodd" d="m18.5 18.8h9.8c2.7 0 4.8.7 6.2 2.2 1.2 1.2 1.8 2.8 1.8 4.9v.1c0 1.7-.4 3.1-1.3 4.2-.8 1.1-2 1.9-3.3 2.4l5.2 7.6h-5.5l-4.6-6.8h-3.7v6.8h-4.7zm9.4 10.3c1.2 0 2.1-.3 2.7-.8s.9-1.3.9-2.2v-.1c0-1-.3-1.8-1-2.3s-1.5-.7-2.7-.7h-4.7v6.1zm12.5-10.3h16.3v4.2h-11.6v4.5h10.2v4.3h-10.2v8.2h-4.7zm27.5 21.6c-1.6 0-3.2-.3-4.8-.8-1.6-.6-3-1.4-4.3-2.6l2.8-3.3c1 .8 2 1.4 3 1.9s2.2.7 3.4.7c1 0 1.7-.2 2.3-.5.5-.4.8-.8.8-1.5v-.1c0-.3-.1-.6-.2-.8s-.3-.5-.6-.7-.8-.4-1.3-.6c-.7-.2-1.4-.5-2.2-.6-1-.2-2-.5-2.9-.9-.9-.3-1.6-.7-2.2-1.2s-1.1-1.1-1.4-1.8-.5-1.6-.5-2.6v-.1c0-1 .2-1.9.5-2.6.4-.8.9-1.5 1.5-2 .7-.6 1.5-1 2.4-1.3s1.9-.5 3-.5c1.6 0 3 .2 4.3.7s2.5 1.1 3.6 2l-2.4 3.5c-.9-.6-1.8-1.1-2.8-1.5-.9-.4-1.8-.6-2.8-.6-.9 0-1.6.2-2.1.5-.5.4-.7.8-.7 1.3v.1c0 .3.1.6.2.9s.4.5.7.7.8.4 1.4.6 1.4.4 2.3.6c1.1.3 2 .6 2.9 1 .8.4 1.6.8 2.1 1.3.6.5 1 1.1 1.3 1.7.3.7.4 1.5.4 2.4v.1c0 1.1-.2 2-.6 2.8s-.9 1.5-1.6 2.1-1.5 1-2.5 1.3c-.8.2-1.8.4-3 .4z" 
                              fill="#fff" 
                              fillRule="evenodd"/>
                          </svg>                      
                      </div>                      
                    </div>          
                  </div> 
                  <div className="text-container">
                    <h1>Ready4sale – logga in</h1>
                    <h2> 
                      Ange ditt användarnamn och lösenord.
                    </h2>
                  </div>       
                </div>
                
                <div  className="d-flex justify-content-center">
                  <div className="col-md-10">
          
                    <form className="form-signin" name="loginForm" onSubmit={this._login}>          
                      <div className="form-label-group">
                        <input type="text" id="inputEmail" className="form-control" name="username" placeholder="User Name" required autoFocus value={username} onChange={this._handleChange}/>
                       
                      </div>
                      <div className="form-label-group">
                        <input type="password" id="inputPassword" className="form-control" name="password" placeholder="Password" required value={password} onChange={this._handleChange}/>
                                   
                      </div>  
                      { error ? <div className="alert alert-danger" role="alert">{error}</div>:<div/> }   
                      <button className="btn btn-lg btn-primary btn-block" type="submit" >Sign in</button>            
                    </form>
          
                  </div>    
                </div>  
                <Footer/>           
              </div>
          </div>
            
          )
    }
  
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
      logIn,
      history,
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(LoginPage)
