import React, { Component } from 'react'
import './sentence.css'

class Sentence extends Component {
    render() { 
        return ( 
            <a href="#" 
                id={this.props.sentence.props['id']}
                data-hash={this.props.sentence.props['data-hash']}
                className="sentence"
                onClick={ () => this.props.onCheckingForm(this.props.sentence) }
            >
                {this.props.sentence.content}
            </a>
        )
    }
}
 
export default Sentence;