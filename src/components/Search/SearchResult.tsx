import { ArrowForwardIosOutlined } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { useAppSelector } from "../../store/store";
import HighlightedText from "../HighlightedSearchText";

const SearchResult = ({
    handleOnClick,
    name,
    searchName,
    description,
    avatar = undefined,
}) => {
    const { vw } = useAppSelector((state) => ({
        vw: state.vw,
    }));

    const getTextSpan = () => {
        if (!avatar) {
            return 11;
        }
        return vw?.xs ? 9 : 10;
    };

    return (
        <Grid container
            style={{
                padding: "10px 5%",
                cursor: "pointer",
                width: "100%",
                alignContent:"middle"
            }}
            onClick={handleOnClick}
        >
            {avatar && <Grid item xs={vw?.xs ? 2 : 1}>{avatar}</Grid>}
            <Grid item xs={getTextSpan()}>
                <Typography
                    variant="body1"
                    style={{
                        marginBottom: 0,
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",    
                        textOverflow: "ellipsis",
                    }}
                >
                    <HighlightedText text={name} highlight={searchName} />
                </Typography>
                <Grid style={{ fontSize: 10 }}>{description}</Grid>
            </Grid>
            <Grid item xs={1}>
                <ArrowForwardIosOutlined />
            </Grid>
        </Grid>
    );
};

export default SearchResult;
