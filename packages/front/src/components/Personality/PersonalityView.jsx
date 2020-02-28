import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";

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
} from "grommet";
import * as Icons from "grommet-icons";

class PersonalityView extends Component {
    constructor(props) {
        super(props);
        this.createClaim = this.createClaim.bind(this);
        this.viewClaim = this.viewClaim.bind(this);
        this.state = {};
    }

    componentDidMount() {
        const self = this;
        self.getPersonality();
    }

    getPersonality() {
        axios
            .get(
                `${process.env.API_URL}/personality/${this.props.match.params.id}`
            )
            .then(response => {
                const personality = response.data;
                this.setState({ personality });
            })
            .catch(() => {
                console.log("Error while fetching Personality");
            });
    }

    createClaim() {
        const path = `./${this.props.match.params.id}/claim/create`;
        this.props.history.push(path);
    }

    viewClaim(id) {
        const path = `./${this.props.match.params.id}/claim/${id}`;
        this.props.history.push(path);
    }

    render() {
        const personality = this.state.personality;
        if (personality) {
            const reviews = personality.stats.reviews;
            return (
                <Grid
                    rows={["small", "full"]}
                    columns={["full"]}
                    gap="small"
                    areas={[
                        { name: "header", start: [0, 0], end: [0, 0] },
                        { name: "table", start: [0, 1], end: [0, 1] }
                    ]}
                >
                    <Box
                        gridArea="header"
                        direction="row"
                        flex
                        pad="small"
                        background="light-1"
                    >
                        <Box direction="row" basis="full" gap="large">
                            <Box as="h2" sm={{ size: 6, offset: 2 }}>
                                <Icons.User color="plain" size="xlarge" />
                            </Box>
                            <Box>
                                <Heading>{personality.name}</Heading>
                                <Text>{personality.bio}</Text>
                            </Box>
                            {/* <Box align='start'>
                                <Value value={personality.stats.total} label='Number of reviewed claims'/>
                            </Box> */}
                        </Box>
                        <Box alignContent="end">
                            <DataTable
                                columns={[
                                    {
                                        property: "_id",
                                        header: "Review",
                                        primary: true
                                    },
                                    {
                                        property: "percent",
                                        header: "Stats",
                                        render: datum => (
                                            <Box pad={{ vertical: "xsmall" }}>
                                                <Meter
                                                    values={[
                                                        {
                                                            value:
                                                                datum.percentage
                                                        }
                                                    ]}
                                                    thickness="small"
                                                    size="small"
                                                    background={{
                                                        opacity: "false"
                                                    }}
                                                />
                                            </Box>
                                        )
                                    }
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
                                        <TableCell size="3/4">
                                            {claim.title}
                                        </TableCell>
                                        <TableCell alignSelf="end">
                                            <Button
                                                icon={<Icons.View />}
                                                label="View"
                                                onClick={() =>
                                                    this.viewClaim(claim._id)
                                                }
                                            ></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell size="1/4" alignSelf="end">
                                        <Button
                                            icon={<Icons.FormAdd />}
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
            return "loading";
        }
    }
}

export default withRouter(PersonalityView);
