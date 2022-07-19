import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { useTranslation } from 'next-i18next';
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { useAppSelector } from "../store/store";
import { CreateLogoutHandler } from "./Login/LogoutAction";
import { ory } from "../lib/orysdk";
import { AxiosError } from "axios";

const AletheiaMenu = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const router = useRouter();
    const onLogout = () => { 
        if(!isFormSubmitted) {
            setIsFormSubmitted(true)
            CreateLogoutHandler() 
                .then(() => router.push("/"))
                .then(() => router.reload())
        }
    }
    const [hasSession, setHasSession] = useState<boolean>(false)
    const [ isFormSubmitted, setIsFormSubmitted ] = useState(false)
    
    const { menuCollapsed } = useAppSelector(
        (state) => {
            return {
                menuCollapsed:
                    state?.menuCollapsed !== undefined ? state?.menuCollapsed : true
            };
        }
    );

    const handleClick = (menuItem) => {
        dispatch({
            type: "TOGGLE_MENU",
            menuCollapsed: !menuCollapsed
        });
        router.push(menuItem.key);
    }
    useEffect(() => {
    ory
        .toSession()
        .then(() => {
        setHasSession(true)
        })
        .catch((err: AxiosError) => {
        switch (err.response?.status) {
            case 403:
            case 422:
                return router.push("/login")
            case 401:
                return
        }
        return Promise.reject(err)
        })
    }, [])

    return (
        <Menu
            mode="inline"
            theme="light"
            style={{
                background: "#F5F5F5",
                color: "#111111"
            }}
            selectable={false}
        >
            <Menu.Item
                key="/profile"
                data-cy={"testMyAccountItem"}
                style={{
                    fontSize: "18px"
                }}
                onClick={handleClick}
            >
                {t("menu:myAccountItem")}
            </Menu.Item>
            <Menu.Item
                key="/about"
                data-cy={"testAboutItem"}
                style={{
                    fontSize: "18px"
                }}
                onClick={handleClick}
            >
                {t("menu:aboutItem")}
            </Menu.Item>
            <Menu.Item
                key="/privacy-policy"
                data-cy={"testPrivacyPolicyItem"}
                style={{
                    fontSize: "18px"
                }}
                onClick={handleClick}
            >
                {t("menu:privacyPolicyItem")}
            </Menu.Item>
            <Menu.Item
                key="/code-of-conduct"
                data-cy={"testCodeOfConductItem"}
                style={{
                    fontSize: "18px"
                }}
                onClick={handleClick}
            >
                {t("menu:codeOfConductItem")}
            </Menu.Item>
            {hasSession && <Menu.Item
                data-cy={"testLogout"}
                key="/home"
                disabled={isFormSubmitted}
                style={{
                    fontSize: "18px"
                }}
                onClick={onLogout}
            >
                {t("menu:logout")}
            </Menu.Item>}
        </Menu>
    );
}

export default AletheiaMenu;
