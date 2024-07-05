import React, { useEffect, useState } from "react";
import SelectOptions from "./SelectOptions";
import userApi from "../../api/userApi";
import verificationRequestApi from "../../api/verificationRequestApi";

interface FetchInputProps {
    fieldName: string;
    placeholder: string;
    onChange: any;
    dataCy: string;
    dataLoader: any;
    mode?: string;
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
    mode = "multiple",
    style = {},
    value = null,
    preloadedOptions = [],
}: FetchInputProps) => {
    const [treatedValue, setTreatedValue] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const userFields = ["usersId", "crossCheckerId", "reviewerId"];
    const apiFunction = userFields.includes(fieldName)
        ? userApi.getById
        : verificationRequestApi.getById;

    useEffect(() => {
        const fetchSelectedContent = async () => {
            if (
                Array.isArray(value) ? value.length > 0 : value !== "" && value
            ) {
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

    return (
        <SelectOptions
            fieldName={fieldName}
            fetchOptions={dataLoader}
            placeholder={placeholder}
            onChange={onChange}
            data-cy={dataCy}
            style={{ width: "100%", ...style }}
            mode={mode}
            value={treatedValue}
            preloadedTopics={preloadedOptions}
            loading={isLoading}
        />
    );
};

export default FetchInput;
