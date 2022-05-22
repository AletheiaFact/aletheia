import React from 'react'
import { Provider } from 'react-redux'
import { useStore } from '../store/store'

const ProviderWrapper = ({ children }) => {
    const store = useStore()
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}

export default ProviderWrapper
