import React, { Component } from "react";
import axios from "axios";
import { Card } from "semantic-ui-react";
import InputSearch from "../Form/InputSearch";
import ReactPaginate from "react-paginate";
import "./PersonalityList.css";
import { Box, Grid, Heading } from "grommet";

class PersonalityList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            personalities: [],
            page: 0,
            searchName: null,
            pageSize: 10
        };
    }

    componentDidMount() {
        const self = this;
        self.getPersonalities();
    }

    getPersonalities() {
        const { page, searchName, pageSize } = this.state;
        const params = {
            page,
            name: searchName,
            pageSize
        };

        axios
            .get(`${process.env.API_URL}/personality`, { params })
            .then(response => {
                const { personalities, totalPages } = response.data;
                this.setState({
                    personalities,
                    totalPages
                });
            })
            .catch(e => {
                throw e;
            });
    }

    handleInputSearch(name) {
        this.setState({ searchName: name });
        this.getPersonalities();
    }

    handlePagination(data) {
        this.setState({ page: data.selected }, () => {
            this.getPersonalities();
        });
    }

    render() {
        const { personalities } = this.state;

        return (
            <Grid
                rows={["xxsmall", "xxsmall", "small", "xxsmall"]}
                columns={["full"]}
                gap="small"
                areas={[
                    { name: "title", start: [0, 0], end: [0, 0] },
                    { name: "search", start: [0, 1], end: [0, 1] },
                    { name: "card", start: [0, 2], end: [0, 2] },
                    { name: "pagination", start: [0, 3], end: [0, 3] }
                ]}
            >
                <Heading gridArea="title" level="2" margin="none">
                    Choose a personality
                </Heading>
                <Box gridArea="search">
                    <InputSearch callback={this.handleInputSearch.bind(this)} />
                </Box>
                <Box gridArea="card">
                    {personalities ? (
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
                    ) : (
                        <span>No results found</span>
                    )}
                </Box>
                <Box id="pagination">
                    <ReactPaginate
                        previousLabel={"previous"}
                        nextLabel={"next"}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        pageCount={this.state.totalPages}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePagination.bind(this)}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                    />
                </Box>
            </Grid>
        );
    }
}

export default PersonalityList;
