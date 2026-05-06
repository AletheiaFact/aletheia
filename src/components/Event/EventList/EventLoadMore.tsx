import React from "react";
import { Grid } from "@mui/material";
import AletheiaButton, { ButtonType } from "../../AletheiaButton";

interface EventLoadMoreProps {
    visible: boolean;
    onLoadMore: () => void;
    label: string;
}

const EventLoadMore = ({ visible, onLoadMore, label }: EventLoadMoreProps) => {
    if (!visible) {
        return null;
    }

    return (
        <Grid item xs={8} display="flex" justifyContent="center" padding={2}>
            <AletheiaButton
                data-cy={"testSeeMoreEvents"}
                type={ButtonType.gray}
                onClick={onLoadMore}
                rounded
            >
                {label}
            </AletheiaButton>
        </Grid>
    );
};

export default EventLoadMore;
