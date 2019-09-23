import React from 'react'
import ReactDOM from 'react-dom'
import { resetContext, getContext } from 'kea'
import { Provider } from 'react-redux'
import ProfileManager from './components/ProfileManager'
import 'normalize.css/normalize.css'
import './styles/styles.scss'

resetContext({
  createStore: {
    // additional options (e.g. middleware, reducers, ...)
  },
  plugins: [
    // additional kea plugins
  ]
})

ReactDOM.render(
  <Provider store={getContext().store}>
    <ProfileManager />
  </Provider>,
  document.getElementById('app')
)