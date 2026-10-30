import { Grid, ListItem } from "@mui/material";

import React from "react";

const ClaimSourceListItem = ({ source, index }) => {
    const { href } = source;

    return (
        <Grid item className="source">
            {typeof source === "object" ? (
                <ListItem id={source?.props?.targetText || source?.targetText}>
                    <span style={{ marginRight: 4 }}>
                        {source?.props?.sup || source?.sup || index}.
                    </span>
                    <a
                        href={/^https?:\/\//i.test(href) ? href : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {href}
                    </a>
                </ListItem>
            ) : (
                <ListItem id={source}>
                    {/* TODO: Remove this ternary when source migration is done */}
                    {index}.{" "}
                    <a
                        href={/^https?:\/\//i.test(source) ? source : undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {source}
                    </a>
                </ListItem>
            )}
        </Grid>
    );
};

export default ClaimSourceListItem;
