import styled from "styled-components"
import { Layout } from "antd";

const { Content } = Layout;

const ContentStyled = styled(Content)`
    padding: 0;

    ${({ mobile } : { mobile: boolean }) => mobile && `
        padding: 0 15px;

        @media (min-width: 768px) {
            padding: 0 30%;
        }
    `}
`

export default ContentStyled