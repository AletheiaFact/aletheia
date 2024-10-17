import localConfig from "../../config/localConfig";

const colors = {
    bluePrimary: "rgb(17, 39, 58)", //#11273a
    blueSecondary: "rgb(101, 126, 142)", //#657e8e
    blueTertiary: "rgb(156, 189, 210)", //#9bbcd1
    blueQuartiary: "rgb(177, 194, 205)", //#b1c2cd
    grayPrimary: "rgb(76, 77, 78)", //#4d4e4f
    graySecondary: "rgb(151, 154, 155)", //#979a9b
    grayTertiary: "rgb(194, 200, 204)", //#c2c8cc
    lightGray: "rgb(245, 245, 245)", //#f5f5f5
    lightGraySecondary: "rgb(238, 238, 238)", //#eeeeee
    lightBluePrimary: "rgb(218, 232, 234)", //#dae8ea
    lightBlueMain: "rgb(79, 141, 180)", //#4F8DB4
    lightBlueSecondary: "rgb(103, 190, 242)", //#67bef2
    white: "rgb(255, 255, 255)", //#ffffff
    blackPrimary: "rgb(17, 17, 17)", //#111111
    blackSecondary: "rgb(81, 81, 81)", //#515151
    blackTertiary: "rgb(32, 34, 34)", // #202222
    lightYellow: "rgba(219, 159, 13, 0.3)", //#db9f0d
    logoWhite: "#E8E8E8",
    redText: "#ff4d4f",
    warning: "#DB9F0D",
    active: "#49DE80",
    inactive: "#FBCC13",
    ...(localConfig?.theme?.colors || {}),
};
export default colors;
