import React, { useState, useEffect } from "react";
import MultiSelectAutocomplete from "../../topics/TopicOrImpactSelect";
import { IImpactAreaSelect, ManualTopic } from "../../../types/Topic";

const ImpactAreaSelect = ({
  onChange,
  placeholder,
}: IImpactAreaSelect) => {
  const [value, setValue] = useState<ManualTopic[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    onChange(value);
  }, []);
  
  return (
    <MultiSelectAutocomplete
      placeholder={placeholder}
      onChange={onChange}
      setIsLoading={setIsLoading}
      isLoading={isLoading}
      setSelectedTags={setValue}
      isMultiple={false}
    />
  );
};

export default ImpactAreaSelect;
