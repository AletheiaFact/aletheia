import React, { useState, useEffect } from "react";
import { ITopicSelect, ManualTopic } from "../../types/Topic";
import MultiSelectAutocomplete from "./TopicOrImpactSelect";

const TopicSelect = ({
  defaultValue,
  onChange,
  placeholder,
  isDisabled,
  dataCy,
}: ITopicSelect) => {
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

export default TopicSelect;
