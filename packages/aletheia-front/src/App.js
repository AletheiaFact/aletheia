import React, { Component, Fragment } from 'react'

import Candidate from './components/Candidate'

import './index.css'

const LoadingContext = React.createContext({
    loading: false,
    message: null,
    showLoading: message => { },
    hideLoading: () => { }
})

class App extends Component {

    state = {
        loading: false,
        message: null
    }

    showLoading = message => this.setState({
        loading: true,
        message
    })

    hideLoading = () => this.setState({ loading: false })

    render() {
        const { showLoading, hideLoading } = this

        const value = {
            ...this.state,
            showLoading,
            hideLoading
        }

        return (
            <LoadingContext.Provider value={value}>
                <LoadingContext.Consumer>
                    {
                        ({ showLoading, hideLoading, loading, message }) => (
                            <Fragment>
                                <Candidate  {...{ showLoading, hideLoading }} />
                            </Fragment>
                        )
                    }
                </LoadingContext.Consumer>
            </LoadingContext.Provider>
        )
    }
}

export default App