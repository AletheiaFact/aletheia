import styled from "styled-components";


const SocialMediaShareStyle = styled.div`
    margin-bottom: 32px;
    display: flex;
    border-radius: 0;

    .social-media-container {
        margin-left: 32px;
        height: 39px;
    }

    ${({ isLoggedIn } : { isLoggedIn: boolean }) => isLoggedIn && `
        align-items: center;
        justify-content: center;

        .social-media-container {
            height: 39px;
        }
    `}

    ${({ isLoggedIn } : { isLoggedIn: boolean }) => !isLoggedIn && `
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
    `}

    @media (max-width: 548px) {
        margin-bottom: 16px;
        border-radius: 0;
        display: grid;
        grid-template-columns: 1fr;

        .social-media-container {
            margin: 0 auto;
            margin-top: 16px;
        }

        .social-media-list {
            justify-content: center;
        }
    }
`
export default SocialMediaShareStyle