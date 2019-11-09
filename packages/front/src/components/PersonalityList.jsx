import React, { Component } from 'react';
import axios from 'axios';
import { Card } from 'semantic-ui-react';

import { 
  Box,
  Grid,
  Heading,
  TextInput
} from 'grommet';

import * as Icon from 'grommet-icons';

class PersonalityInputSearch extends Component {
    constructor(props) {
      super(props);
      this.timeout = 0;
    }

    doSearch(e) {
      const searchText = e.target.value;
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.props.callback(searchText);
      }, 300);
    }

    render() {
      return (
        <Box
          direction="row"
          align="center"
          pad={{ horizontal: "small", vertical: "xsmall" }}
          round="small"
          border={{
            side: "all",
            color: "border"
          }}
        >
          <Icon.Search color="brand" />
          <TextInput
            type="search"
            ref="searchInput"
            type="text"
            plain
            placeholder="Type a name..."
            onChange={e => this.doSearch(e)}
          />
        </Box>
      )
    }
}

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
            <PersonalityInputSearch
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