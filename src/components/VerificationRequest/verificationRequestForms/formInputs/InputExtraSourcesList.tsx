import React, { useState, useEffect } from "react";
import { Box, Grid } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "next-i18next";
import AletheiaButton, { ButtonType } from "../../../Button";
import AletheiaInput from "../../../AletheiaInput";

interface IInputExtraSourcesList {
  value: any;
  onChange: (value: any[]) => void;
  disabled: boolean;
  placeholder: string;
}

const InputExtraSourcesList = ({ value, onChange, disabled, placeholder }: IInputExtraSourcesList) => {
  const { t } = useTranslation();

  const [items, setItems] = useState(() => {
    const initialArray = Array.isArray(value) ? value : [];
    if (initialArray.length === 0) return [{ id: Math.random(), text: "", isOriginal: false }];

    return initialArray.map((item) => {
      const isObject = typeof item === "object" && item !== null;
      const textValue = isObject ? item.href : item;
      return {
        id: item._id || Math.random(),
        text: textValue || "",
        isOriginal: !!textValue,
      };
    });
  });

  useEffect(() => {
    handleNotifyChange(items);
  }, []);

  const handleNotifyChange = (newItems: any[]) => {
    setItems(newItems);
    const uniqueTexts = Array.from(
      new Set(
        newItems
          .map(i => i.text.trim())
          .filter(text => text !== "")
      )
    );

    onChange(uniqueTexts);
  };

  const addField = () => {
    if (disabled) return;
    handleNotifyChange([...items, { id: Math.random(), text: "", isOriginal: false }]);
  };

  const removeField = (id: any) => {
    const index = items.findIndex((item) => item.id === id);
    if (disabled || index === 0) return;
    handleNotifyChange(items.filter((item) => item.id !== id));
  };

  const updateField = (id: any, newText: string) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, text: newText } : item
    );
    handleNotifyChange(updatedItems);
  };

  return (
    <Grid container>
      {items.map((item, index) => (
        <Box key={item.id} sx={{ display: "flex", width: "100%", gap: 1, mt: 1 }}>
          <AletheiaInput
            value={item.text}
            disabled={disabled || (index === 0 && item.isOriginal)}
            onChange={(e) => updateField(item.id, e.target.value)}
            placeholder={t(placeholder)}
            white="true"
          />

          {!disabled && index !== 0 && (
            <AletheiaButton
              onClick={() => removeField(item.id)}
              style={{ minWidth: "40px" }}
            >
              <DeleteIcon fontSize="small" />
            </AletheiaButton>
          )}
        </Box>
      ))}

      {!disabled && (
        <AletheiaButton
          type={ButtonType.blue}
          onClick={addField}
          style={{ marginTop: "8px" }}
        >
          <AddIcon fontSize="small" />
        </AletheiaButton>
      )}
    </Grid>
  );
};

export default InputExtraSourcesList;