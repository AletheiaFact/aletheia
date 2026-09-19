import { useEffect, useRef, useState } from "react";
import userApi from "../../api/userApi";
import verificationRequestApi from "../../api/verificationRequestApi";
import SelectOptions from "./SelectOptions";

interface SelectOption {
    label: string;
    value: any;
}

interface FetchInputProps {
    fieldName: string;
    placeholder: string;
    onChange: any;
    dataCy: string;
    dataLoader: any;
    isMultiple?: boolean;
    style?: {};
    value?: any;
    preloadedOptions?: string[];
}

const USER_FIELDS = ["usersId", "crossCheckerId", "reviewerId"];

const getApiFunction = (fieldName: string) => {
    return USER_FIELDS.includes(fieldName)
        ? userApi.getById
        : verificationRequestApi.getById;
};

const FetchInput = ({
    fieldName,
    placeholder,
    onChange,
    dataCy,
    dataLoader,
    isMultiple = true,
    style = {},
    value = null,
    preloadedOptions = [],
}: FetchInputProps) => {
    const [treatedValue, setTreatedValue] = useState<SelectOption | SelectOption[] | null>(isMultiple ? [] : null);
    const [isLoading, setIsLoading] = useState(false);

    const optimisticallySetRef = useRef(null);
    const apiFunction = getApiFunction(fieldName);

    useEffect(() => {
        const hydrateValues = async () => {
            if (JSON.stringify(value) === JSON.stringify(optimisticallySetRef.current)) return;

            if (value && (Array.isArray(value) ? value.length > 0 : value !== "")) {
                try {
                    setIsLoading(true);
                    const Promises = Array.isArray(value)
                        ? value.map(id => apiFunction(id))
                        : [apiFunction(value)];
                    const results = await Promise.all(Promises);
                    const treatedValues = results.map(item => ({
                        label: item?.name || item?.content || "",
                        value: item?._id,
                    }));

                    const finalValue = isMultiple ? treatedValues : treatedValues[0];

                    setTreatedValue(finalValue);
                    optimisticallySetRef.current = value;
                } catch (error) {
                    console.error("Hydration error:", error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setTreatedValue(isMultiple ? [] : null);
            }
        };

        hydrateValues();
    }, [value, isMultiple, apiFunction]);

    const onSelectionChange = (ids, selectedOptions) => {
        setTreatedValue(selectedOptions);
        optimisticallySetRef.current = ids;
        onChange(ids);
    };

    return (
        <SelectOptions
            fieldName={fieldName}
            fetchOptions={dataLoader}
            placeholder={placeholder}
            onChange={onSelectionChange}
            data-cy={dataCy}
            style={{ width: "100%", ...style }}
            isMultiple={isMultiple}
            value={treatedValue}
            preloadedTopics={preloadedOptions}
            loading={isLoading}
        />
    );
};

export default FetchInput;
