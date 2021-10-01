import React from "react";
import { NextPage } from "next";
import Countdown from "react-countdown";
import { SocialIcon } from "react-social-icons";
import colors from "../styles/colors";
import CountdownRenderer from "../components/CountdownRenderer";
import Image from "next/image";
import Logo from "../../public/images/logo1_white.svg";
import SubscriptionForm from "../components/SubscriptionForm";

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
                            height: "20vh",
                            backgroundImage: "url(data:image/svg+xml;base64,PHN2ZyBpZD0icHJpbmNpcGFsX2xvZ29faW52ZXJzZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIj4KICAgIDxkZWZzPgogICAgICAgIDxzdHlsZT4uY2xzLTF7ZmlsbDojMTEyNzNhO30uY2xzLTJ7ZmlsbDojZThlOGU4O308L3N0eWxlPgogICAgPC9kZWZzPgo8IS0tICAgIDxyZWN0IGNsYXNzPSJjbHMtMSIgeD0iLTEyLjg3IiB5PSItNy45NiIgd2lkdGg9IjE5NTMuODciIGhlaWdodD0iMTEwNS45NiIgcng9IjIiLz4tLT4KICAgIDxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTU3MS41NSw0ODguNzRINTI5LjQzYS4yOS4yOSwwLDAsMC0uMy4yOHYxMC43OWEuMjguMjgsMCwwLDEtLjQ5LjE5cS0xMy0xNC44Ny0zNi0xNC44NS0yNS43MywwLTQzLjA3LDE5LjM5VDQzMi4xOSw1NTNxMCwyOS4wNywxNy4zNSw0OC40N3Q0My4wNywxOS40MnEyMywwLDM2LTE0Ljg1YS4yOC4yOCwwLDAsMSwuNDkuMTl2MTAuNzlhLjI5LjI5LDAsMCwwLC4zLjI4aDQyLjEyYS4yOS4yOSwwLDAsMCwuMy0uMjhWNDg5QS4yOS4yOSwwLDAsMCw1NzEuNTUsNDg4Ljc0Wm0tNDkuODcsODQuNjNxLTcuNDQsNy43LTE5LjUzLDcuN3QtMTkuNTYtNy43cS03LjQ1LTcuNzMtNy40NS0yMC4zM3Q3LjQ1LTIwLjMzUTQ5MCw1MjUsNTAyLjE1LDUyNXQxOS41Myw3LjdxNy40Niw3Ljc0LDcuNDUsMjAuMzNUNTIxLjY4LDU3My4zN1oiLz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTc4Ni4zNSw1MDQuNDNxLTE4Ljc2LTE5LjI5LTQ3LjU5LTE5LjI4LTI5Ljg0LDAtNDkuMTMsMTkuNTNUNjcwLjM1LDU1My4zcTAsMjkuMywxOS42OCw0OC40OXQ1Mi4zNSwxOS4xNHEzNiwwLDU1LjA4LTIzLjY2YS4yOC4yOCwwLDAsMC0uMDUtLjQyTDc2Nyw1NzUuNTVhLjMyLjMyLDAsMCwwLS4zNywwcS05LjQ3LDguODUtMjMuMjIsOC44NC0yMi4wOCwwLTI4LjY0LTE1LjI3YS4zLjMsMCwwLDEsLjI4LS40MUg4MDMuMWEuMjkuMjksMCwwLDAsLjI4LS4yNCw2OCw2OCwwLDAsMCwxLjc0LTE1LjcxUTgwNS4xMiw1MjMuNzIsNzg2LjM1LDUwNC40M1ptLTIzLjI4LDM0LjcxSDcxNC40OGEuMy4zLDAsMCwxLS4zLS4zN3E1LjUxLTE3LjYxLDI1LjExLTE3LjYzLDE4LjgzLDAsMjQuMDYsMTcuNjNBLjI5LjI5LDAsMCwxLDc2My4wNyw1MzkuMTRaIi8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik04NzkuNzUsNTI5LjYzaDI2LjE3YS4yOS4yOSwwLDAsMCwuMjktLjI5VjQ4OWEuMjkuMjksMCwwLDAtLjI5LS4yOUg4NzkuNzVhLjI5LjI5LDAsMCwxLS4yOS0uMjlWNDUzLjEyYS4yOS4yOSwwLDAsMC0uMzctLjI4TDgzNyw0NjUuNTNhLjI5LjI5LDAsMCwwLS4yMS4yN3YyMi42NWEuMjguMjgsMCwwLDEtLjI4LjI5SDgxNy43NmEuMjkuMjksMCwwLDAtLjI5LjI5djQwLjMxYS4yOS4yOSwwLDAsMCwuMjkuMjloMTguNzJhLjI4LjI4LDAsMCwxLC4yOC4yOXYzOHEwLDMwLjYyLDE1LjU3LDQyLjMxdDUzLjYyLDcuMWEuMjguMjgsMCwwLDAsLjI2LS4yOXYtMzhhLjI5LjI5LDAsMCwwLS4zMS0uMjhxLTE0LjE2LjcyLTIwLjI3LTEuM3QtNi4xNy0xMC41NXYtMzdBLjI5LjI5LDAsMCwxLDg3OS43NSw1MjkuNjNaIi8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMDU4LjIzLDU0MC40NHY3Ni42MmEuMjkuMjksMCwwLDEtLjI4LjI4aC00Mi4xNGEuMjkuMjksMCwwLDEtLjI4LS4yOFY1NDUuODVjMC02LjcxLTEuNzYtMTEuNzQtNS4yNy0xNS4xOHMtOC4xOS01LjE1LTE0LTUuMTVjLTYuNzEsMC0xMS44OCwyLTE1LjU3LDZzLTUuNTIsOS44NC01LjUyLDE3LjM4djY4LjEzYS4yOS4yOSwwLDAsMS0uMjguMjhIOTMyLjc0YS4yOS4yOSwwLDAsMS0uMjgtLjI4VjQyNy4xNWEuNDYuNDYsMCwwLDEsLjMzLS40NGw0MS43Ni0xM2EuNDcuNDcsMCwwLDEsLjYxLjQ0djg2LjZhLjI4LjI4LDAsMCwwLC41MS4xNnExMS41OC0xNS43NCwzNS4yMi0xNS43MywyMC44NSwwLDM0LjA5LDE0LjI3VDEwNTguMjMsNTQwLjQ0WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTE5Ny4zOCw1MDQuNDNxLTE4LjgtMTkuMjktNDcuNTktMTkuMjgtMjkuODMsMC00OS4xMiwxOS41M3QtMTkuMjksNDguNjJxMCwyOS4zLDE5LjY4LDQ4LjQ5dDUyLjMyLDE5LjE0cTM2LjExLDAsNTUuMTEtMjMuNjZhLjMuMywwLDAsMCwwLS40MkwxMTc4LDU3NS41NWEuMzEuMzEsMCwwLDAtLjM3LDBxLTkuNDgsOC44NS0yMy4yMyw4Ljg0LTIyLjExLDAtMjguNjMtMTUuMjdhLjI4LjI4LDAsMCwxLC4yNS0uNDFoODguMDZhLjMzLjMzLDAsMCwwLC4zLS4yNCw2OCw2OCwwLDAsMCwxLjc0LTE1LjcxUTEyMTYuMTUsNTIzLjcyLDExOTcuMzgsNTA0LjQzWm0tMjMuMywzNC43MWgtNDguNTlhLjMuMywwLDAsMS0uMjgtLjM3cTUuNTEtMTcuNjEsMjUuMDktMTcuNjMsMTguODMsMCwyNC4wNiwxNy42M0EuMjguMjgsMCwwLDEsMTE3NC4wOCw1MzkuMTRaIi8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMjYyLjE5LDQ3MS4yM2EyNSwyNSwwLDAsMCwyNC42OS0yNC42OSwyMy4zMiwyMy4zMiwwLDAsMC03LjMzLTE3LjI0LDI0LjUzLDI0LjUzLDAsMCwwLTM0LjcyLDAsMjMuMzIsMjMuMzIsMCwwLDAtNy4zMywxNy4yNCwyNSwyNSwwLDAsMCwyNC42OSwyNC42OVoiLz48cmVjdCBjbGFzcz0iY2xzLTIiIHg9IjEyNDAuODQiIHk9IjQ4OC43NCIgd2lkdGg9IjQyLjciIGhlaWdodD0iMTI4LjYiIHJ4PSIwLjI5Ii8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xNDQ3LjYxLDQ4OC43NGgtNDIuMTJhLjI5LjI5LDAsMCwwLS4zLjI4djEwLjc5YS4yOC4yOCwwLDAsMS0uNDkuMTlxLTEzLTE0Ljg3LTM2LTE0Ljg1LTI1LjczLDAtNDMuMDcsMTkuMzlUMTMwOC4yMiw1NTNxMCwyOS4wNywxNy4zOCw0OC40N3Q0My4wNywxOS40MnEyMywwLDM2LTE0Ljg1YS4yOC4yOCwwLDAsMSwuNDkuMTl2MTAuNzlhLjI5LjI5LDAsMCwwLC4zLjI4aDQyLjEyYS4yNy4yNywwLDAsMCwuMjgtLjI4VjQ4OUEuMjcuMjcsMCwwLDAsMTQ0Ny42MSw0ODguNzRabS00OS44Nyw4NC42M2MtNSw1LjEzLTExLjQ4LDcuNy0xOS41Niw3LjdzLTE0LjU3LTIuNTctMTkuNTMtNy43LTcuNDUtMTEuOTMtNy40NS0yMC4zMywyLjQ4LTE1LjE3LDcuNDUtMjAuMzMsMTEuNDgtNy43LDE5LjUzLTcuNywxNC41NywyLjU4LDE5LjU2LDcuNyw3LjQ1LDExLjkzLDcuNDUsMjAuMzNTMTQwMi43MSw1NjguMjIsMTM5Ny43NCw1NzMuMzdaIi8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik02NjEsNjE5LjE5Yy00Ljc2LDIuMTItMTIuMTYsMy43Mi0yMi4yMSwzLjcyLTMwLjcsMC00MC43NS0yMC4xMi00MC43NS00OS43NVY0MjhhLjQ3LjQ3LDAsMCwxLC4zMy0uNDVsNDQuNTctMTMuODlhLjQ3LjQ3LDAsMCwxLC42MS40NVY1NzQuNzZjMCw5LDQuMjIsMTEuNjIsNy40LDExLjYyYTE2LjkzLDE2LjkzLDAsMCwwLDQuNzYtLjUxWiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTU3MC42NiwyOTIuMzdWNzQ1LjIxYTIuODcsMi44NywwLDAsMS0yLjgzLDIuOWgtODAuNzFhMi4zMiwyLjMyLDAsMCwxLTIuMzItMi4zMlY3MTcuNjdhMi4zMiwyLjMyLDAsMCwxLDIuMzItMi4zMkgxNTM3VjMyMi4yM0gzNDMuNDhWNzE1LjM1SDkxNS44YTIuODUsMi44NSwwLDAsMSwyLjg1LDIuODZ2MjdhMi44NywyLjg3LDAsMCwxLTIuODUsMi45SDMxMi42NGEyLjg1LDIuODUsMCwwLDEtMi44My0yLjlWMjkyLjM3YTIuOSwyLjksMCwwLDEsMi45LTIuOUgxNTY3LjgzQTIuODgsMi44OCwwLDAsMSwxNTcwLjY2LDI5Mi4zN1oiLz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTEwMDAuMjMsNjY4LjYyYy04Ljk0LS42Mi0xNiwxLjM3LTIwLjg1LDUuOTJzLTcuNCwxMS4yNS03LjQsMTkuOTR2MS4xaC05LjM2YTEuNDMsMS40MywwLDAsMC0xLjQ0LDEuNDR2OC4xNGExLjQzLDEuNDMsMCwwLDAsMS40NCwxLjQ0SDk3MnY1NGExLjQ0LDEuNDQsMCwwLDAsMS40NSwxLjQ0aDguMzlhMS40NCwxLjQ0LDAsMCwwLDEuNDUtMS40NHYtNTRoMTYuODZhMS40NCwxLjQ0LDAsMCwwLDEuNDUtMS40NFY2OTdhMS40NCwxLjQ0LDAsMCwwLTEuNDUtMS40NEg5ODMuMjd2LTEuMWMwLTUuNjQsMS4zNS05LjY4LDQtMTJzNy0zLjMsMTIuNzItMi44M2ExLjM5LDEuMzksMCwwLDAsMS4xLS4zOCwxLjQyLDEuNDIsMCwwLDAsLjQ3LTEuMDZ2LTguMTRBMS40NSwxLjQ1LDAsMCwwLDEwMDAuMjMsNjY4LjYyWiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTA3Mi4xLDY5NS41OGgtOC40YTEuNDUsMS40NSwwLDAsMC0xLjQ0LDEuNDR2OGMtNi03LjI2LTE0LjA4LTEwLjkzLTI0LjI1LTEwLjkzYTMzLDMzLDAsMCwwLTI0LjIyLDEwLjA5LDM1LjM3LDM1LjM3LDAsMCwwLDAsNDkuMzMsMzMsMzMsMCwwLDAsMjQuMjIsMTAuMWMxMC4xNywwLDE4LjI5LTMuNjcsMjQuMjUtMTAuOTN2OGExLjQ1LDEuNDUsMCwwLDAsMS40NCwxLjQ0aDguNGExLjQ1LDEuNDUsMCwwLDAsMS40NC0xLjQ0VjY5N0ExLjQ1LDEuNDUsMCwwLDAsMTA3Mi4xLDY5NS41OFptLTE2LjY2LDUwLjA4YTIzLjg3LDIzLjg3LDAsMCwxLTMzLjU1LDAsMjMuMTQsMjMuMTQsMCwwLDEtNS4xMy03LjY2LDI0LjA1LDI0LjA1LDAsMCwxLTEuNjktOS4xOSwyMi44LDIyLjgsMCwwLDEsNi44Mi0xNi44NSwyMy44NywyMy44NywwLDAsMSwzMy41NSwwLDI0LjIzLDI0LjIzLDAsMCwxLDAsMzMuN1oiLz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTExNTIuNTUsNzQ0LjM0bC03LTQuMDZhMS40NCwxLjQ0LDAsMCwwLTIsLjU0LDIzLjY1LDIzLjY1LDAsMSwxLTIwLjIzLTM1Ljc0LDIzLjExLDIzLjExLDAsMCwxLDEyLDMuMTcsMTguMzUsMTguMzUsMCwwLDEsNy42Miw4LjQzLDEuNDcsMS40NywwLDAsMCwuODcuNzksMS40NSwxLjQ1LDAsMCwwLDEuMTctLjEybDYuODctNGExLjQ0LDEuNDQsMCwwLDAsLjYtMS44NEEyOC4yNiwyOC4yNiwwLDAsMCwxMTQxLDY5OC43N2EzMy43NywzMy43NywwLDAsMC0xNy42Ni00LjcyYy05LjkzLDAtMTguMzIsMy4zNy0yNC45MywxMGEzNS43MSwzNS43MSwwLDAsMCwwLDQ5LjQ2YzYuNjEsNi42NiwxNSwxMCwyNC45MywxMGEzNC40NCwzNC40NCwwLDAsMCwxNy42NC00LjY1LDMwLjg1LDMwLjg1LDAsMCwwLDEyLjEzLTEyLjY2QTEuNDUsMS40NSwwLDAsMCwxMTUyLjU1LDc0NC4zNFoiLz4KICAgIDxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTEyMDEuNDEsNjk1LjU4aC0xNi44NlY2NzkuMjJhMS40NSwxLjQ1LDAsMCwwLTEuODctMS4zOGwtOC4zOSwyLjU0YTEuNDQsMS40NCwwLDAsMC0xLDEuMzh2MTMuODJoLTExLjkxYTEuNDQsMS40NCwwLDAsMC0xLjQ1LDEuNDR2OC4xNGExLjQ0LDEuNDQsMCwwLDAsMS40NSwxLjQ0aDExLjkxdjM3LjA5YzAsNy44OSwyLjQ4LDEzLjM1LDcuMzgsMTYuMjUsMy4xNSwxLjg1LDcuMzQsMi43OSwxMi41MSwyLjc5YTU3LjQ0LDU3LjQ0LDAsMCwwLDguNDctLjcsMS40NSwxLjQ1LDAsMCwwLDEuMjMtMS40M3YtNy4zOGExLjQyLDEuNDIsMCwwLDAtLjQ1LTEsMS4zOSwxLjM5LDAsMCwwLTEuMDYtLjRjLTQsLjE3LTcuNDEuMjMtMTAuMDkuMTktMi4zMiwwLTQtLjYzLTUuMDYtMS44MnMtMS42NS0zLjM4LTEuNjUtNi40NlY3MDYuNmgxNi44NmExLjQ0LDEuNDQsMCwwLDAsMS40NS0xLjQ0VjY5N0ExLjQ0LDEuNDQsMCwwLDAsMTIwMS40MSw2OTUuNThaIi8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xMjMyLjI0LDc0Ni40NGE4LjQ0LDguNDQsMCwxLDAsNiwxNC40MmgwYTguNDQsOC40NCwwLDAsMC02LTE0LjQyWiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTMwOC44NSw3MDQuMDdhMzUuNTIsMzUuNTIsMCwwLDAtNDkuNDUsMCwzNS4xOSwzNS4xOSwwLDAsMCwwLDQ5LjQ3LDM1LjQ5LDM1LjQ5LDAsMCwwLDQ5LjQ1LDAsMzUuMTksMzUuMTksMCwwLDAsMC00OS40N1ptLTgsNDEuNTlhMjMuODcsMjMuODcsMCwwLDEtMzMuNTUsMCwyMy4xNCwyMy4xNCwwLDAsMS01LjEzLTcuNjYsMjQuMDUsMjQuMDUsMCwwLDEtMS42OS05LjE5LDIyLjgsMjIuOCwwLDAsMSw2LjgyLTE2Ljg1LDIzLjg3LDIzLjg3LDAsMCwxLDMzLjU1LDAsMjQuMTUsMjQuMTUsMCwwLDEsMCwzMy43WiIvPgogICAgPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTM2My44NSw2OTQuNTZjLTguMTEsMC0xNC4zNiwyLjcxLTE4LjY1LDguMDdWNjk3YTEuNDMsMS40MywwLDAsMC0xLjQ0LTEuNDRoLTguNGExLjQ0LDEuNDQsMCwwLDAtMS40NCwxLjQ0Vjc2MC42YTEuNDQsMS40NCwwLDAsMCwxLjQ0LDEuNDRoOC40YTEuNDMsMS40MywwLDAsMCwxLjQ0LTEuNDRWNzI1LjI1YzAtNi44MywxLjc2LTExLjg1LDUuMjQtMTQuOTRhMTkuNTIsMTkuNTIsMCwwLDEsMTMuNDEtNC43MiwxLjQ1LDEuNDUsMCwwLDAsMS40NC0xLjQ1VjY5NkExLjQ0LDEuNDQsMCwwLDAsMTM2My44NSw2OTQuNTZaIi8+CiAgICA8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0xNDM4LjM1LDY5NS41OEgxNDMwYTEuNDUsMS40NSwwLDAsMC0xLjQ2LDEuNDR2OGMtNi03LjI2LTE0LjA4LTEwLjkzLTI0LjIyLTEwLjkzQTMzLDMzLDAsMCwwLDEzODAsNzA0LjE0YTM1LjQyLDM1LjQyLDAsMCwwLDAsNDkuMzMsMzMsMzMsMCwwLDAsMjQuMjUsMTAuMWMxMC4xNCwwLDE4LjI2LTMuNjcsMjQuMjItMTAuOTN2NS40MWMwLDYuMTctMS45LDEwLjktNS44MiwxNC41MnMtOS4zOCw1LjQxLTE2LjI0LDUuNDFjLTEwLjg2LDAtMTcuODktMy41My0yMS40Ny0xMC43N2ExLjQxLDEuNDEsMCwwLDAtLjg4LS43NCwxLjQ3LDEuNDcsMCwwLDAtMS4xNC4xMmwtNy4zOCw0LjE5YTEuNDksMS40OSwwLDAsMC0uNTgsMS45MWM1LjQzLDEwLjgzLDE2LDE2LjMxLDMxLjQ1LDE2LjMxYTM1LjUyLDM1LjUyLDAsMCwwLDIzLjQzLTguMjFjNi41OS01LjUzLDkuOTMtMTMuMTgsOS45My0yMi43NFY2OTdBMS40NSwxLjQ1LDAsMCwwLDE0MzguMzUsNjk1LjU4Wm0tMTYuNjYsNTAuMDhhMjMuODcsMjMuODcsMCwwLDEtMzMuNTUsMCwyNC4yMywyNC4yMywwLDAsMSwwLTMzLjcsMjMuODcsMjMuODcsMCwwLDEsMzMuNTUsMCwyNC4yMywyNC4yMywwLDAsMSwwLDMzLjdaIi8+Cjwvc3ZnPgo=)",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center"
                        }}
                    >
                    </div>
                    <h2
                        className="header"
                        style={{
                            color: colors.lightBlue,
                            textAlign: "center",
                            fontSize: "1.6rem",
                            letterSpacing: "3px",
                            fontWeight: 500,
                            wordSpacing: "4px",
                            textTransform: "uppercase",
                        }}
                    >
                        Estamos quase lá!
                    </h2>
                    <div
                        style={{
                            color: colors.lightBlue,
                            textAlign: "center",
                            fontSize: "1rem",
                            letterSpacing: "3px",
                            fontWeight: 500,
                            padding: "0 20px"
                        }}
                    >
                        <p>
                            Aumentamos a contagem regressiva para que possamos entregar checagens ainda mais confiáveis para todos e todas.
                        </p>
                        <p>
                            Muito em breve, estaremos no ar 🚀
                        </p>
                    </div>
                    <Countdown
                        date="2021-10-31T12:00:00"
                        renderer={CountdownRenderer}
                    />
                </div>
            </div>
            <div
                style={{
                    color: colors.lightBlue,
                    textAlign: "center",
                    fontSize: "1rem",
                    letterSpacing: "3px",
                    fontWeight: 500,
                    padding: "5px 20px"
                }}
            >
                Enquanto isso, acompanhe os nossos conteúdos nas redes sociais
            </div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    padding: "35px 25% 20px 25%",
                }}
            >
                <SocialIcon url="https://www.facebook.com/AletheiaFactorg-107521791638412" bgColor={colors.lightBlue} />
                <SocialIcon url="https://www.instagram.com/aletheiafact" bgColor={colors.lightBlue} />
            </div>
        </main>
    );
};

export default Home;
