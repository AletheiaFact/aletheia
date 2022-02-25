import { Col, Row } from 'antd'
import Text from 'antd/lib/typography/Text'
import { useTranslation } from 'next-i18next'
import React from 'react'
import colors from '../../styles/colors'

const ClaimCardHeader = ({ personality, date, claimType = 'speech' }) => {
    const { t } = useTranslation()
    const formattedDate = new Date(date).toLocaleDateString()
    const speechTypeTranslation =
        claimType === 'speech'
            ? t('claim:typeSpeech')
            : t('claim:typeTwitter')
    return (
        <Col span={24} style={{
            color: colors.black,
            width: '100%'
        }}>
            <Text style={{ fontSize: 16 }}>
                {personality.name}
            </Text>
            <Row>{personality.description}</Row>
            <Row>
                {t('claim:cardHeader1')}&nbsp;
                <strong>{formattedDate}</strong>&nbsp;
                {t('claim:cardHeader2')}&nbsp;
                <strong>{speechTypeTranslation}</strong>
            </Row>
        </Col>

    )
}

export default ClaimCardHeader
