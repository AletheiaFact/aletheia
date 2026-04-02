import React, { useEffect, useRef, useState } from "react";
import SelectOptions from "./SelectOptions";
import userApi from "../../api/userApi";
import verificationRequestApi from "../../api/verificationRequestApi";

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
    const [treatedValue, setTreatedValue] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const optimisticallySetRef = useRef(false);
    const userFields = ["usersId", "crossCheckerId", "reviewerId"];
    const apiFunction = userFields.includes(fieldName)
        ? userApi.getById
        : verificationRequestApi.getById;

    useEffect(() => {
        const fetchSelectedContent = async () => {
            if (
                Array.isArray(value) ? value.length > 0 : value !== "" && value
            ) {
                // Skip fetch if value was just set optimistically from the dropdown
                if (optimisticallySetRef.current) {
                    optimisticallySetRef.current = false;
                    return;
                }

                try {
                    setIsLoading(true);
                    const Promises = Array.isArray(value)
                        ? value.map((id) => apiFunction(id))
                        : [apiFunction(value)];
                    const results = await Promise.all(Promises);
                    const treatedValues = results.map((user) => ({
                        label: user?.name || user?.content,
                        value: user?._id,
                    }));
                    setTreatedValue(treatedValues);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setTreatedValue(value);
            }
        };

        fetchSelectedContent().catch((error) => {
            console.error(error);
            setIsLoading(false);
        });
    }, [value]);

    // Optimistically update displayed chips when user selects from dropdown
    const onSelectionChange = (ids, selectedOptions) => {
        if (selectedOptions) {
            optimisticallySetRef.current = true;
            setTreatedValue(
                Array.isArray(selectedOptions)
                    ? selectedOptions
                    : [selectedOptions]
            );
        }
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
