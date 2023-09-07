import React, { useState } from "react";
import LargeDrawer from "../../LargeDrawer";
import { useAtom } from "jotai";
import { userBeingEdited } from "../../../atoms/userEdit";
import { Grid } from "@mui/material";
import { isEditDrawerOpen } from "../../../atoms/editDrawer";
import Loading from "../../Loading";
import DrawerHeader from "./DrawerHeader";
import UserEditForm from "./UserEditForm";

const UserEditDrawer = () => {
    const [visible, setVisible] = useAtom(isEditDrawerOpen);
    const [currentUser] = useAtom(userBeingEdited);
    const [isLoading, setIsLoading] = useState(false);

    const onCloseDrawer = () => {
        setVisible(false);
    };

    return (
        <LargeDrawer visible={visible} onClose={onCloseDrawer}>
            <Grid
                container
                justifyContent="center"
                alignItems="stretch"
                spacing={1}
                mt={2}
            >
                <DrawerHeader
                    currentUser={currentUser}
                    setIsLoading={setIsLoading}
                />

                <UserEditForm
                    currentUser={currentUser}
                    setIsLoading={setIsLoading}
                />
            </Grid>
            {isLoading && (
                <Loading
                    style={{
                        position: "absolute",
                        top: 0,
                        height: "100%",
                        background: "rgba(0,0,0,.1)",
                    }}
                />
            )}
        </LargeDrawer>
    );
};

export default UserEditDrawer;
