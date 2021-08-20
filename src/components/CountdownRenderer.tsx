import React from "react";
import styled from "styled-components";
import colors from "../styles/colors";

const TimeBoxDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    h2 {
        color: ${colors.lightBlue};
        font-size: 5rem;
        background: ${colors.bluePrimary};
        padding: 1rem 2rem 0.5rem 2rem;
        border-radius: 1rem;
        text-align: center;
    }

    p {
        font-size: 1.4rem;
        text-transform: uppercase;
        letter-spacing: 5px;
    }
`;

const CountdownDiv = styled.div`
    color: ${colors.lightBlue};
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 2.5rem;
    @media (max-width: 768px) {
        .hide {
            display: none;
        }

        p {
            font-size: 1rem;
        }

        h2 {
            font-size: 4rem;
        }
    }

    @media (max-height: 670px) {

        h2 {
            font-size: 2rem;
            padding: 1rem 1rem 0.5rem 1rem;
        }
    }
`;

const CountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
    const hideDays = days > 0 ? "" : "hide";
    const hideHours = hours > 0 ? "" : "hide";
    const hideMinutes = days <= 0 && minutes > 0 ? "" : "hide";
    const hideSeconds = hours <= 0 && seconds > 0 ? "" : "hide";

    if (completed) {
        // Render a completed state
        return <span>Completo</span>;
    } else {
        // Render a countdown
        return (
            <CountdownDiv>
                <TimeBoxDiv>
                    <h2 id="days" className={hideDays}>
                        {days}
                        <p>Dias</p>
                    </h2>
                </TimeBoxDiv>
                <TimeBoxDiv>
                    <h2 id={hideHours}>
                        {hours}
                        <p>Horas</p>
                    </h2>
                </TimeBoxDiv>
                <TimeBoxDiv className={hideMinutes}>
                    <h2 id="minutes">
                        {minutes}
                        <p>Minutos</p>
                    </h2>
                </TimeBoxDiv>
                <TimeBoxDiv className={hideSeconds}>
                    <h2 id="seconds">
                        {seconds}
                        <p>Segundos</p>
                    </h2>
                </TimeBoxDiv>
            </CountdownDiv>
        );
    }
};

export default CountdownRenderer;
