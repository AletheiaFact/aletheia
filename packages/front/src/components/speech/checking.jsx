import Sentence from './sentence'
import _ from 'underscore'
import React, { Component } from 'react'

class CheckingForm extends Component {
    render() { 
      if (_.isEmpty(this.props.highlight)) {
        return (
          <h1> Choose a sentence to Fact Check! </h1>
        )
      } else {
        return (
          <React.Fragment>
            <h1> Sentence #{this.props.highlight.props.id} </h1>
            <h3> {this.props.highlight.content} </h3>
          </React.Fragment>
        )
      }
    }
}
 
export default CheckingForm;