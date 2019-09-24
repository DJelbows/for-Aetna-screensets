import React from 'react'
import ReactDOM from 'react-dom'
import { resetContext, getContext } from 'kea'
import { Provider } from 'react-redux'
import Home from './components/Home'
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
    <Home />
  </Provider>,
  document.getElementById('app')
)