import { Col, Row } from 'antd'
import Text from 'antd/lib/typography/Text'
import { useTranslation } from 'next-i18next'
import React from 'react'
import colors from '../../styles/colors'
import LocalizedDate from '../LocalizedDate'

const ClaimCardHeader = ({ personality, date, claimType = 'speech' }) => {
    const { t } = useTranslation()
    const speechTypeTranslation =
        claimType === 'speech'
            ? t('claim:typeSpeech')
            : t('claim:typeTwitter')
    return (
        <Col span={24} style={{
            color: colors.blackSecondary,
            width: '100%'
        }}>
            <Text style={{ fontSize: 16 }}>
                {personality.name}
            </Text>
            <Row>{personality.description}</Row>
            <Row>
                {t('claim:cardHeader1')}&nbsp;
                <LocalizedDate date={date} />&nbsp;
                {t('claim:cardHeader2')}&nbsp;
                <strong>{speechTypeTranslation}</strong>
            </Row>
        </Col>

    )
}

export default ClaimCardHeader
