import { Dropdown, Menu } from "antd";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import { ory } from "../../lib/orysdk";
import AletheiaButton from "../Button";
import { CreateLogoutHandler } from "../Login/LogoutAction";
import UserIcon from "./UserIcon";

const UserMenu = () => {
    const [hasSession, setHasSession] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const router = useRouter();

    useEffect(() => {
        ory.toSession()
            .then(() => {
                setHasSession(true);
            })
            .catch(() => {
                setHasSession(false);
            });
    }, []);

    const loginOrProfile = () => {
        router.push(hasSession ? "profile" : "login");
    };

    const onSignUp = () => {
        router.push("sign-up");
    };

    const onLogout = () => {
        if (!isLoading) {
            setIsLoading(true);
            CreateLogoutHandler().then(() => router.reload());
        }
    };

    const menu = (
        <Menu>
            <Menu.Item
                key="/profile"
                data-cy={`test${hasSession ? "MyAccount" : "Login"}Item`}
                style={{
                    fontSize: "18px",
                }}
                onClick={loginOrProfile}
            >
                {t(`menu:${hasSession ? "myAccount" : "login"}Item`)}
            </Menu.Item>
            {hasSession ? (
                <Menu.Item
                    data-cy={"testLogout"}
                    key="/home"
                    disabled={isLoading}
                    style={{
                        fontSize: "18px",
                    }}
                    onClick={onLogout}
                >
                    {t("menu:logout")}
                </Menu.Item>
            ) : (
                <Menu.Item
                    data-cy={"testRegister"}
                    key="/sign-up"
                    disabled={isLoading}
                    style={{
                        fontSize: "18px",
                    }}
                    onClick={onSignUp}
                >
                    {t("login:signup")}
                </Menu.Item>
            )}
        </Menu>
    );

    return (
        <Dropdown overlay={menu}>
            <AletheiaButton
                style={{ paddingBottom: "4px" }}
                data-cy="testUserIcon"
            >
                <UserIcon size="20px" />
            </AletheiaButton>
        </Dropdown>
    );
};

export default UserMenu;
