import React, { Component } from 'react'
import './footer.scss'

class Footer extends Component {
    constructor(props){
        super(props);
        this.state={
          year: (new Date()).getFullYear()
        }
      }
    render() {
        const { year } = this.state
        return (
            <footer className="site-footer font-small bg-white">
                <div className="footer-copyright text-center">
                    © {year} Copyright: Ready4Sale
                </div>
            </footer> 
        )
    }
}

export default Footer