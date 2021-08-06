import React from "react";
import { NextPage } from "next";
import Countdown from "react-countdown";
import { SocialIcon } from "react-social-icons";

const colors = {
    bluePrimary: "rgb(17, 39, 58)",
    blueSecondary: "rgb(101, 126, 142)",
    blueTertiary: "rgb(101, 126, 142)",
    grayPrimary: "rgb(76, 77, 78)",
    graySecondary: "rgb(151, 154, 155)",
    grayTertiary: "rgb(194, 200, 204)",
    lightBlue: "rgb(218, 232, 234)",
};

const renderer = ({ days, hours, minutes, seconds, completed }) => {
    const secStyle = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
    };

    const secH2Style = {
        color: colors.lightBlue,
        fontSize: "8rem",
        background: colors.bluePrimary,
        padding: "2rem 3rem",
        borderRadius: "1rem",
    };

    const secPStyle = {
        fontSize: "1.4rem",
        textTransform: "uppercase",
        letterSpacing: "5px",
    };

    if (completed) {
        // Render a completed state
        return <span>Completo</span>;
    } else {
        // Render a countdown
        return (
            <div
                className="count"
                style={{
                    color: colors.lightBlue,
                    display: "flex",
                    justifyContent: "center",
                    gap: "2.5rem",
                }}
            >
                <div className="days sec" style={secStyle}>
                    <h2 id="days" style={secH2Style}>
                        {days}
                    </h2>
                    <p style={secPStyle}>Days</p>
                </div>
                <div className="hours sec" style={secStyle}>
                    <h2 id="hours" style={secH2Style}>
                        {hours}
                    </h2>
                    <p style={secPStyle}>Hours</p>
                </div>
                <div className="minutes sec" style={secStyle}>
                    <h2 id="minutes" style={secH2Style}>
                        {minutes}
                    </h2>
                    <p style={secPStyle}>Minutes</p>
                </div>
                <div className="seconds sec" style={secStyle}>
                    <h2 id="seconds" style={secH2Style}>
                        {seconds}
                    </h2>
                    <p style={secPStyle}>Seconds</p>
                </div>
            </div>
        );
    }
};

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
                    <h1
                        className="header"
                        style={{
                            color: colors.lightBlue,
                            textAlign: "center",
                            fontSize: "2.6rem",
                            letterSpacing: "3px",
                            fontWeight: "500",
                            wordSpacing: "4px",
                            textTransform: "uppercase",
                        }}
                    >
                        AletheiaFact.org
                    </h1>
                    <h2
                        className="header"
                        style={{
                            color: colors.lightBlue,
                            textAlign: "center",
                            fontSize: "2.6rem",
                            letterSpacing: "3px",
                            fontWeight: "500",
                            wordSpacing: "4px",
                            textTransform: "uppercase",
                        }}
                    >
                        We're launching soon
                    </h2>
                    <Countdown
                        date={new Date(2021, 10, 1)}
                        renderer={renderer}
                    />
                </div>
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                }}
            >
                <a
                    href="https://www.facebook.com/traveloperhabib"
                    target="_blank"
                    className="icon-link"
                >
                    <SocialIcon network="facebook" bgColor={colors.lightBlue} />
                </a>
                <a
                    href="https://instagram.com/traveloperhabib"
                    target="_blank"
                    className="icon-link"
                >
                    <SocialIcon
                        network="instagram"
                        bgColor={colors.lightBlue}
                    />
                </a>
            </div>
        </main>
    );
};

export default Home;
