import { FilePdfOutlined } from '@ant-design/icons';
import { Alert, Button } from 'antd';
import { Trans, useTranslation } from 'next-i18next';
import React from 'react';

const InfoAlert= () => {
    const { t } = useTranslation()
    return (
        <Alert
            type="info"
            style={{
                marginBottom: "15px", 
                padding: "50px 25px 50px 25px"
            }}
            message={<Trans 
                i18nKey={"about:alertInfo"}
                components={[
                    <a style={{whiteSpace: "pre-wrap"}} href="https://github.com/AletheiaFact/aletheia" target="_blank" rel="noreferrer"></a>
                ]}
            />}
            action={
                <Button
                    type="primary"
                    size="small"
                    shape="round"
                    icon={<FilePdfOutlined />}
                    href="https://github.com/AletheiaFact/miscellaneous/blob/main/presentations/aletheiafact.pdf"
                    target={"_blank"}
                    style={{
                        position: "absolute",
                        bottom: "15px", 
                        right: "15px", 
                    }}
                >
                    {t("about:labelButton")}
                </Button>
            }
        />
    )
}

export default InfoAlert
