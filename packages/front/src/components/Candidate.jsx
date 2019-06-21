import React, { Component } from 'react'
import axios from 'axios'
import { Container, Row, Col, Form, FormGroup, Input, Label, Button } from 'reactstrap'
// import candidateService from '../services/candidateService'

class Candidate extends Component {
    constructor(props) {
      super(props);

      this.state = {
        name: '',
        speech: ''
      }
      this.saveCandidate = this.saveCandidate.bind(this);
    }
  
    saveCandidate(e) {
      e.preventDefault();
      let userData = this.state;
      // candidateService.savePost(userData);
      axios.post('http://localhost:3000/candidate', userData)
        .then(response => {
            console.log(response.data)
        })
        .catch(() => { console.log('Erro ao recuperar os dados'); })
    }
  
    render() {
      return (
        <Container>
          <Row>
            <Col md="3"></Col>
            <Col md="6">
              <h2><center>Criar Discurso de um candidato</center></h2>
            </Col>
            <Col md="3"></Col>
          </Row>
          <Row>
            <Col md="3"></Col>
            <Col md="6">
              <Form onSubmit={this.saveCandidate}>
                <FormGroup>
                  <Label>Nome</Label>
                  <Input
                    value={this.state.name}
                    onChange={e => this.setState({name: e.target.value}) }
                    placeholder={'Nome do candidato'}/>
                </FormGroup>
                <FormGroup>
                  <Label>Discurso</Label>
                  <Input
                    rows="4"
                    type="textarea"
                    value={this.state.speech}
                    onChange={e => this.setState({speech: e.target.value}) }
                    placeholder={'Eu com toda honra...'}/>
                </FormGroup>
                <Button type="submit" value="Submit">Salvar</Button>
                
              </Form>
            </Col>
            <Col md="3"></Col>
          </Row>
        </Container>
      );
    }
}
export default Candidate