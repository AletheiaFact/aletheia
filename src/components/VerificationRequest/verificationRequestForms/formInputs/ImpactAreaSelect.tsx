import React, { useState, useEffect } from "react";
import { IImpactAreaSelect, ManualTopic } from "../../../../types/Topic";
import MultiSelectAutocomplete from "../../../topics/TopicOrImpactSelect";

const ImpactAreaSelect = ({
  defaultValue,
  onChange,
  placeholder,
  isDisabled,
  dataCy,
}: IImpactAreaSelect) => {
  const [value, setValue] = useState<ManualTopic | null>((defaultValue as unknown as ManualTopic)|| null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onChange(value);
  }, []);

  return (
    <MultiSelectAutocomplete
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={onChange}
      setIsLoading={setIsLoading}
      isLoading={isLoading}
      setSelectedTags={setValue}
      isMultiple={false}
      isDisabled={isDisabled}
      dataCy={dataCy}
    />
  );
};

export default ImpactAreaSelect;
