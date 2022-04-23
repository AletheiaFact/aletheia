import { Col, Row, Typography } from 'antd'
import { useTranslation } from 'next-i18next'
import React from 'react'
import colors from '../../styles/colors'
import LocalizedDate from '../LocalizedDate'

const { Title } = Typography

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
            <Title level={2} style={{
                fontSize: 16,
                fontWeight: 400,
                marginBottom: 0,
            }}>
                {personality.name}
            </Title>

            <Row>
                <Title level={3} style={{
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: '18px',
                    marginBottom: 0,
                }}>
                    {personality.description}
                </Title>
            </Row>

            <Row>
                <Title level={3} style={{
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: '18px',
                    marginBottom: 0,
                }}>
                    {t('claim:cardHeader1')}&nbsp;
                    <LocalizedDate date={date} />&nbsp;
                    {t('claim:cardHeader2')}&nbsp;
                    <strong>{speechTypeTranslation}</strong>
                </Title>
            </Row>
        </Col>

    )
}

export default ClaimCardHeader
