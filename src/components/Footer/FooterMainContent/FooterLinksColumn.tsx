import { Grid, Link, Stack, Typography } from "@mui/material";
import React from "react";
import { FooterLink } from "../../../types/Footer";

type FooterLinksColumnProps = {
    title: string;
    links: FooterLink[];
};

const FooterLinksColumn = ({ title, links }: FooterLinksColumnProps) => {
    return (
        <Grid item xs={6} md={2} lg={2}>
            <Typography className="footer-column-title">
                {title}
            </Typography>
            <Stack spacing={1.2}>
                {links.map((link) => (
                    <Link
                        key={link.label}
                        href={link.href}
                        target={link.external ? "_blank" : "_self"}
                        rel={link.external ? "noreferrer" : undefined}
                        underline="none"
                        className="footer-column-link"
                    >
                        {link.label}
                    </Link>
                ))}
            </Stack>
        </Grid>
    );
};

export default FooterLinksColumn;
