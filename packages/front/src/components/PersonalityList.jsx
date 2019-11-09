import React, { Component } from 'react';
import axios from 'axios';
import { Card } from 'semantic-ui-react';
import InputSearch from './InputSearch';

import { 
  Box,
  Grid,
  Heading
} from 'grommet';

class PersonalityList extends Component {
    constructor(props) {
      super(props);
      this.state = { 
        personalities: [],
        selectedOption: null
      };
    }

    componentDidMount() {
        const self = this;
        self.getPersonalities();
    }

    getPersonalities(name) {
      const params = (name && { name }) || {};
      console.log('params', params);
      axios.get('http://localhost:3000/personality', {params})
        .then(response => {
            const {personalities} = response.data;
            console.log(personalities);
            this.setState({ personalities });
        })
        .catch((e) => { throw e })
    }

    render() {
      const { personalities } = this.state;

      return (
        <Grid
          rows={['xxsmall', 'xxsmall', 'small']}
          columns={['full']}
          gap="small"
          areas={[
            { name: 'title', start: [0,0], end: [0,0]},
            { name: 'search', start: [0,1], end: [0,1]},
            { name: 'card', start:[0,2], end: [0,2] }
          ]}
        >
          <Heading gridArea="title" level="2" margin="none">Choose a personality</Heading>
          <Box gridArea="search">
            <InputSearch
              callback={this.getPersonalities.bind(this)}
            />
          </Box>
          <Box gridArea="card">
            <Card.Group>
                {personalities.map((p, i) => (
                  <Card
                      key={i}
                      href={`personality/${p._id}`}
                      header={p.name}
                      description={p.bio}
                  />
                ))}
            </Card.Group>
          </Box>
        </Grid>
      );
    }
}

export default PersonalityList;