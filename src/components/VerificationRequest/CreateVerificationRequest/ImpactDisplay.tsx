import * as React from "react";
import { useEffect, useState} from "react";
import MultiSelectAutocomplete from "../../topics/TopicOrImpactSelect";


interface ImpactAreaSelectProps {
  onChange: (value: string) => void;
  placeholder?: string;
}

const ImpactAreaSelect: React.FC<ImpactAreaSelectProps> = ({
  onChange,
  placeholder,
}) => {
  const [value, setValue] = useState("");
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
      setInputValue={setValue}
      isMultiple={false}
    />
  );
};

export default ImpactAreaSelect;
