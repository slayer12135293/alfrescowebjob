/* eslint-disable import/no-named-as-default */
import { Route, Switch } from "react-router-dom"
import '@babel/polyfill'

import AboutPage from "./AboutPage"
import HomePage from "./homePage/HomePage"
import EstatesPage from "./estatesPage/EstatesPage"
import EstatePage from "./estatePage/EstatePage"
import SearchResultRedirectPage from "./searchResultRedirectingPage/SearchResultRedirectingPage"
import DataCategoryPage from "./dataCategoryPage/DataCategoryPage"
import FileCategoryPage from "./fileCategoryPage/FileCategoryPage"
import LoginPage from "./loginPage/LoginPage"
import NotFoundPage from "./NotFoundPage"
import PropTypes from "prop-types"
import React from "react"
import { hot } from "react-hot-loader"
import  PrivateRoute from "../lib/privateRouter"
import { history } from '../store/configureStore'

// This is a class-based component because the current
// version of hot reloading won't hot reload a stateless
// component at the top-level.  

class App extends React.Component {
  render() {
    return (
      <div>
        <Switch history={history}>
          <PrivateRoute exact path="/" component={HomePage} />
          <PrivateRoute exact path="/:portfolioname/:portfolioid/estates/" component={EstatesPage} />
          <PrivateRoute exact path="/searchresultredirect" component={SearchResultRedirectPage} />
          <PrivateRoute exact path="/:portfolioname/:portfolioid/:estatename/:estateid/estate" component={EstatePage} />
          <PrivateRoute exact path="/:portfolioname/:portfolioid/:estatename/:estateid/:datacategoryname/:datacategoryid/datacategory" component={DataCategoryPage} />
          <PrivateRoute exact path="/:portfolioname/:portfolioid/:estatename/:estateid/:datacategoryname/:datacategoryid/:filecategoryname/:filecategoryid/filecategory" component={FileCategoryPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/about" component={AboutPage} />
          <Route component={NotFoundPage} />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  children: PropTypes.element
};

export default hot(module)(App);
