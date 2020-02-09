import axios from 'axios'
import { Container, Form, FormGroup, Input, Button } from 'reactstrap'
import _ from 'underscore'
import React, { Component } from 'react'

class ClaimReviewForm extends Component {
    constructor(props) {
      super(props);
      this.state = {
        classification: '',
        claim: '',
        sentence_hash: '',
        sentence_content: '',
      }
      this.submitClaimReview = this.submitClaimReview.bind(this);
    }

    submitClaimReview(e) {
      e.preventDefault();
      console.log(this.props);

      this.setState({
        claim: this.props.highlight.claim,
        personality: this.props.highlight.personality,
        sentence_hash: this.props.highlight.props['data-hash'],
        sentence_content: this.props.highlight.content,
      }, () => {
        axios.post(`http://localhost:3000/claimreview`, this.state)
        .then(response => {
            console.log('Classification Succeed')
        })
      });
    }

    render() { 
      if (_.isEmpty(this.props.highlight)) {
        return (
          <h1> Choose a sentence to Fact Check! </h1>
        )
      } else {
        return (
          <Container>
            <h1> Classify Sentence </h1>
            <Form onSubmit={this.submitClaimReview}>
              <FormGroup>
                <Input
                  type="select"
                  onChange={e => this.setState({classification: e.target.value}) }
                  defaultValue="">
                    <option value="" disabled>Select classification</option>
                    <option value="not-fact">Not fact</option>
                    <option value="true">True</option>
                    <option value="true-but">True, but</option>
                    <option value="arguable">Arguable</option>
                    <option value="misleading">Misleading</option>
                    <option value="false">False</option>
                    <option value="unsustainable">Unsustainable</option>
                    <option value="exaggerated">Exaggerated</option>
                    <option value="unverifiable">Unverifiable</option>
                </Input>
                <Button type="submit" value="Submit">Submit</Button>
              </FormGroup>
            </Form>
          </Container> 
        )
      }
    }
}
 
export default ClaimReviewForm;