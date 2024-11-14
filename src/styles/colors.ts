import localConfig from "../../config/localConfig";

const colors = {
    primary: "rgb(17, 39, 58)", //#11273a
    secondary: "rgb(101, 126, 142)", //#657e8e
    tertiary: "rgb(156, 189, 210)", //#9bbcd1
    quartiary: "rgb(177, 194, 205)", //#b1c2cd
    lightPrimary: "rgb(79, 141, 180)", //#4F8DB4
    lightSecondary: "rgb(103, 190, 242)", //#67bef2
    lightTertiary: "rgb(218, 232, 234)", //#dae8ea
    black: "rgb(17, 17, 17)", //#111111
    blackSecondary: "rgb(81, 81, 81)", //#515151
    blackTertiary: "rgb(32, 34, 34)", // #202222
    neutral: "rgb(76, 77, 78)", //#4d4e4f
    neutralSecondary: "rgb(151, 154, 155)", //#979a9b
    neutralTertiary: "rgb(194, 200, 204)", //#c2c8cc
    lightNeutral: "rgb(245, 245, 245)", //#f5f5f5
    lightNeutralSecondary: "rgb(238, 238, 238)", //#eeeeee
    white: "rgb(255, 255, 255)", //#ffffff
    warning: "rgba(219, 159, 13, 0.3)", //#db9f0d
    shadow: "rgba(0, 0, 0, 0.25)",
    logo: "#E8E8E8",
    error: "#ff4d4f",
    active: "#49DE80",
    inactive: "#FBCC13",
    ...(localConfig?.theme?.colors || {}),
};
export default colors;
