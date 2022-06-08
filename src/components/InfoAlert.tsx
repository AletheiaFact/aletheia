import { FilePdfOutlined } from '@ant-design/icons';
import { Alert, Button } from 'antd';
import { Trans } from 'next-i18next';
import React from 'react';

const InfoAlert= () => {
    return (
        <Alert
            type="info"
            closable
            description={<Trans i18nKey={"about:alertInfo"}
                components={[
                    <a style={{whiteSpace: "pre-wrap"}} href="https://github.com/AletheiaFact/aletheia" target="_blank" rel="noreferrer"></a>
                ]}
            />}
            action={
                <Button
                type="primary"
                shape="round"
                icon={<FilePdfOutlined />}
                href="https://github.com/AletheiaFact/miscellaneous/blob/main/presentations/aletheiafact.pdf"
                target={"_blank"}
                style={{position: "absolute", bottom: "0", right: "0", marginRight: "5px", marginBottom: "5px" }}
                />
            }
        />
    )
}

export default InfoAlert
