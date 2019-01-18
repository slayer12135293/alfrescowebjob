import React from 'react';
import Header from '../header/header'
import Footer from '../footer/footer' 

class LayoutMap extends React.Component {
    componentDidMount(){
        $(function () {
            $(document).scroll(function () {
                var $nav = $(".site-header");
                $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
              });
          });
    }
    render(){
        return (
            <div>
                <Header/>    
                    <div className="container-fluid">                        
                        {this.props.children}    
                    </div>
                    <div className="fixed-bottom">
                        <Footer/>
                    </div>               
                 
            </div>
        )
    }
}

export default LayoutMap