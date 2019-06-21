import React, { Component } from 'react'
import axios from 'axios'
import { Card, Image } from 'semantic-ui-react'

class SpeechCreate extends Component {
    constructor(props) {
      super(props);
      this.state = { personalities: [] };
    }

    componentDidMount() {
        const self = this;
        self.getPersonalities();
    }

    getPersonalities() {
      axios.get('http://localhost:3000/personality')
        .then(response => {
            const personalities = response.data;
            console.log(personalities);
            this.setState({ personalities });
        })
        .catch(() => { console.log('Error while fetching personalities'); })
    }

    render() {
      const personalities = this.state.personalities;
      return (
        <Card.Group>
            {personalities.map(p => (
              <Card
                  href={`personality/${p._id}`}
                  header={p.name}
                  description={p.bio}
              />
            ))}
        </Card.Group>
      );
    }
}

export default SpeechCreate;