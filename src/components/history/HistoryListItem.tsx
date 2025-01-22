import Typography from "@mui/material/Typography"
import { useTranslation } from "next-i18next"
import React from "react"
import LocalizedDate from "../LocalizedDate"
interface IHistoryListItemProps {
    history: {
        _id: string,
        targetId: string,
        targetModel: string,
        user: { name: string },
        type: string,
        date: string
        details: { after: any, before: any }
    }
}

const HistoryListItem = ({ history }: IHistoryListItemProps) => {
    const { t } = useTranslation()
    const username = history.user ? history.user.name : t('history:annonymousUserName')
    const type = t(`history:${history.type}`)
    const targetModel = t(`history:${history.targetModel}`)
    const titleTag = history.targetModel === "personality" ? "name" : "title"

    let title = history.details.after?.[titleTag] ? history.details.after?.[titleTag] : ''
    const oldTitle = history.details.before?.[titleTag] ? history.details.before?.[titleTag] : ''
    if (history.type === "delete") {
        title = oldTitle
    }
    return (
        <div style={{ fontSize: 14 }}>
            <LocalizedDate date={history.date} showTime />{` - `}
            {t('history:historyItem', { username, type, targetModel, title })}
            {oldTitle && oldTitle !== title && (
                <Typography variant="body1" display="flex">
                    (<span style={{ textDecoration: "line-through" }}>{oldTitle}</span>)
                </Typography>
            )}
        </div>
    )
}

export default HistoryListItem
