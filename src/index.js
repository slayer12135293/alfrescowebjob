/* eslint-disable import/default */

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Store, { history } from './store/configureStore'
import Root from './components/Root'
import './styles/styles.scss'


require('./favicon.ico')

//const store = configureStore()


render(
  <AppContainer>
    <Root store={Store} history={history} />
  </AppContainer>,
  document.getElementById('app')
);

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    const NewRoot = require('./components/Root').default;
    render(
      <AppContainer>
        <NewRoot store={Store} history={history} />
      </AppContainer>,
      document.getElementById('app')
    );
  });
}
