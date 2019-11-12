import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import axios from 'axios'
import { 
    Box,
    Grid,
    Text,
    Table,
    TableHeader,
    TableFooter,
    TableBody,
    TableCell,
    TableRow,
    Button,
    DataTable,
    Heading,
    Meter
} from 'grommet';
import * as Icons from 'grommet-icons';

class PersonalityView extends Component {

    constructor(props){
        super(props);
        this.createClaim = this.createClaim.bind(this);
        this.viewClaim = this.viewClaim.bind(this);
        this.state = {};
    }

    componentDidMount(){
        const self = this;
        self.getPersonality();
    }

    getPersonality() {
        axios.get(`http://localhost:3000/personality/${this.props.match.params.id}`)
        .then(response => {
            const personality = response.data;
            this.setState({ personality });
        })
        .catch(() => { console.log('Error while fetching Personality'); })
    }

    createClaim() {
        let path = `./${this.props.match.params.id}/claim/create`;
        this.props.history.push(path);
    }

    viewClaim(id) {
        let path = `./${this.props.match.params.id}/claim/${id}`;
        this.props.history.push(path);
    }

    render() {
        let personality = this.state.personality
        if (personality) {
            const reviews = personality.stats.reviews;
            return (
                <Grid
                rows={['xsmall', 'full']}
                columns={['small', 'medium']}
                gap="small"
                areas={[
                    { name: 'header', start: [0,0], end: [1,0] },
                    { name: 'info', start: [0,1], end: [0,1] },
                    { name: 'table', start: [1,1], end: [1,1] },
                ]}
                >
                    <Box gridArea="header">
                        <Heading>{personality.name}</Heading>
                    </Box>
                    <Box gridArea="info">
                        <Box as='h2' sm={{ size:6, offset:2 }}>
                            <Icons.User color='plain' size='xlarge' /> 
                            <Text>{personality.bio}</Text>
                        </Box>
                        <Box>
                            <Text><Icons.Checkmark color='plain' size='small'/> Number of reviewed claims {personality.stats.total}</Text>
                            <DataTable
                                columns={[
                                    {
                                        property: '_id',
                                        header: 'Review',
                                        primary: true,
                                    },
                                    {
                                        property: 'percent',
                                        header: 'Stats',
                                        render: datum => (
                                            <Box pad={{ vertical: 'xsmall'}}>
                                                <Meter
                                                    values={[{ value: datum.percentage }]}
                                                    thickness="small"
                                                    size="small"
                                                    background={{opacity: 'false'}}
                                                />
                                            </Box>
                                        ),
                                    },
                                ]}
                                data={reviews}
                            />
                        </Box>
                    </Box>
                    <Box gridArea="table">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableCell>Claim Title</TableCell>
                                    <TableCell />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {personality.claims.map(claim => (
                                    <TableRow>
                                        <TableCell>{claim.title}</TableCell>
                                        <TableCell>
                                            <Button 
                                                icon={<Icons.View/>}
                                                label="View"
                                                onClick={() => this.viewClaim(claim._id)}>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell>
                                        <Button
                                            icon={<Icons.FormAdd/>}
                                            label="Add Claim"
                                            primary
                                            onClick={() => this.createClaim()}
                                        ></Button>
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </Box>
                </Grid>
            );
        } else {
            return ('loading');
        }
    }

}

export default withRouter(PersonalityView);