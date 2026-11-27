import React, { useEffect, useState } from "react";
import { Button, Drawer, Grid, TextField, Typography } from "@mui/material";
import { useTranslation } from "next-i18next";
import personalityApi, { StoredPersonality } from "../../api/personality";
import { MessageManager } from "../Messages";

interface Props {
    personalityId: string;
    open: boolean;
    onClose: () => void;
}

const PersonalityEditDrawer = ({ personalityId, open, onClose }: Props) => {
    const { t } = useTranslation();
    const [stored, setStored] = useState<StoredPersonality | null>(null);
    const [form, setForm] = useState({
        name: "",
        description: "",
        wikidata: "",
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        let cancelled = false;
        setStored(null);
        personalityApi
            .getStoredPersonality(personalityId)
            .then((data) => {
                if (cancelled) return;
                setStored(data);
                setForm({
                    name: data.name,
                    description: data.description,
                    wikidata: data.wikidata ?? "",
                });
            })
            .catch(() => {
                if (!cancelled) {
                    MessageManager.showMessage(
                        "error",
                        t("personality:editError")
                    );
                }
            });
        return () => {
            cancelled = true;
        };
    }, [open, personalityId]);

    const fieldHint = (field: "name" | "description") =>
        stored?.wikidataProvides?.[field]
            ? t("personality:editHintWikidataProvides")
            : t("personality:editHintShown");

    const save = async () => {
        if (!stored) return;
        const body: { name?: string; description?: string; wikidata?: string } =
            {};
        if (form.name !== stored.name) body.name = form.name;
        if (form.description !== stored.description) {
            body.description = form.description;
        }
        if (form.wikidata && form.wikidata !== (stored.wikidata ?? "")) {
            body.wikidata = form.wikidata;
        }
        if (Object.keys(body).length === 0) return onClose();
        setSaving(true);
        try {
            await personalityApi.updatePersonality(personalityId, body, t);
            window.location.reload();
        } catch {
            setSaving(false);
        }
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Grid
                container
                direction="column"
                gap={2}
                sx={{ width: 420, maxWidth: "100vw", p: 3 }}
            >
                <Typography variant="h6">
                    {t("personality:editTitle")}
                </Typography>
                {stored && (
                    <Typography
                        data-cy="personalityEditWikidataStatus"
                        variant="body2"
                    >
                        {t(
                            `personality:wikidataStatus_${stored.wikidataStatus}`
                        )}
                    </Typography>
                )}
                <TextField
                    label={t("personality:editName")}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    helperText={fieldHint("name")}
                    inputProps={{
                        maxLength: 200,
                        "data-cy": "personalityEditName",
                    }}
                />
                <TextField
                    label={t("personality:editDescription")}
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                    helperText={fieldHint("description")}
                    multiline
                    minRows={3}
                    inputProps={{
                        maxLength: 1000,
                        "data-cy": "personalityEditDescription",
                    }}
                />
                <TextField
                    label={t("personality:editWikidata")}
                    value={form.wikidata}
                    onChange={(e) =>
                        setForm({ ...form, wikidata: e.target.value.trim() })
                    }
                    helperText={t("personality:editWikidataHint")}
                    inputProps={{ "data-cy": "personalityEditWikidata" }}
                />
                <Grid container gap={1} justifyContent="flex-end">
                    <Button onClick={onClose}>
                        {t("personality:editCancel")}
                    </Button>
                    <Button
                        variant="contained"
                        onClick={save}
                        disabled={!stored || saving}
                        data-cy="personalityEditSave"
                    >
                        {t("personality:editSave")}
                    </Button>
                </Grid>
            </Grid>
        </Drawer>
    );
};

export default PersonalityEditDrawer;
