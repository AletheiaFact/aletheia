import Sentence from './sentence'
import React, { Component } from 'react'

class Paragraph extends Component {
    render() { 
      const sentences = this.props.paragraph.content
      return (
        <p id={this.props.paragraph.props.id}>
            {sentences.map(p => (
                <Sentence 
                  key={p.props.id}
                  sentence={p} 
                  onCheckingForm={this.props.onCheckingForm}
                />
            ))}
        </p>
      )
    }
}
 
export default Paragraph;