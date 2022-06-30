import styled from "styled-components"
import { Layout } from "antd";

const { Content } = Layout;

const ContentStyle = styled(Content)`
    padding: 0;

    ${({ layout } : { layout: string }) => layout === "mobile" && `
        padding: 0 15px;

        @media (min-width: 768px) {
            padding: 0 30%;
        }
    `}
`

export default ContentStyle