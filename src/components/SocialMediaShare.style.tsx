import colors from "../styles/colors"
import styled from "styled-components";


const SocialMediaContainer = styled.div`
    background: ${colors.lightGray};
    margin-bottom: 32px;
    padding: 20px 8px;
    display: flex;
    border-radius: 0;
    justify-content: center;
    align-itens: center;

    .social-media-container {
        margin-top: 3px;
        height: 39px;
        margin-left: 32px;
    }

    .social-media-title {
        width: auto;
        text-align: center;
        margin-bottom: 0;
        font-size: 26px;
        line-height: 39px;
        font-weight: 400;
        color: ${colors.blackSecondary};
    }

    .social-media-list {
        margin-bottom: 0;
        padding: 0;
        text-align: center;
        display: grid;
        grid-template-columns: 30px 30px 30px 30px;
        grid-column-gap: 16px;
        list-style-type: none;
    }

    @media (min-width: 1024px) {
        display: grid;
        border-radius: 10px;
        grid-template-columns: 1fr;

        .social-media-container {
            width: 276px;
            height: 39px;
            margin: 0 auto;
            margin-top: 16px;
        }

        .social-media-list {
            justify-content: center;
        }
    }

    @media (max-width: 548px) {
        margin-bottom: 16px;
        border-radius: 0;
        display: grid;
        grid-template-columns: 1fr;

        .social-media-container {
            margin: 0 auto;
            margin-top: 16px;
        }
    }
`
export default SocialMediaContainer