import 'whatwg-fetch'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Router from './router/index.jsx'
import './style/main.less'
import { getSMARTState } from './lib/misc'
import { store, appState } from './redux'

const smartStateProp = getSMARTState()

render(
    <Provider store={store}>
        {Router(appState, smartStateProp)}
    </Provider>, document.getElementById('app'),
)
