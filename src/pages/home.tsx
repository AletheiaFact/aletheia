import React from "react";
import { NextPage } from "next";
import Countdown from "react-countdown";
import { SocialIcon } from "react-social-icons";
import styled from "styled-components";
import colors from "../styles/colors";
import CountdownRenderer from "../components/CountdownRenderer";
import Image from "next/image";
import Logo from "../../public/images/logo1_white.svg";

const Home: NextPage<{ data: string }> = (props) => {
    return (
        <main
            className="container"
            style={{
                backgroundImage: `linear-gradient(to bottom, ${colors.bluePrimary}, ${colors.blueSecondary})`,
                minHeight: "100vh",
            }}
        >
            <div className="counter-wrapper">
                <div
                    className="counter"
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "80%",
                    }}
                >
                    <div
                        style={{
                            position: "relative",
                            width: "100%",
                            height: "30vh",
                        }}
                    >
                        <Image src={Logo} layout="fill" />
                    </div>
                    <h2
                        className="header"
                        style={{
                            color: colors.lightBlue,
                            textAlign: "center",
                            fontSize: "1.8rem",
                            letterSpacing: "3px",
                            fontWeight: 500,
                            wordSpacing: "4px",
                            textTransform: "uppercase",
                        }}
                    >
                        A contagem regressiva começou, estamos chegando!
                    </h2>
                    <Countdown
                        date="2021-10-01T12:00:00"
                        renderer={CountdownRenderer}
                    />
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    padding: "35px 25% 20px 25%",
                }}
            >
                <SocialIcon network="facebook" bgColor={colors.lightBlue} />
                <SocialIcon network="instagram" bgColor={colors.lightBlue} />
            </div>
        </main>
    );
};

export default Home;
