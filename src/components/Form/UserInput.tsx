import React, { useEffect, useState } from "react";
import SelectOptions from "./SelectOptions";
import userApi from "../../api/userApi";

interface UserInputProps {
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

const UserInput = ({
    fieldName,
    placeholder,
    onChange,
    dataCy,
    dataLoader,
    mode = "multiple",
    style = {},
    value = [],
    preloadedOptions = [],
}: UserInputProps) => {
    const [treatedValue, setTreatedValue] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUserNames = async () => {
            if (
                Array.isArray(value) ? value.length > 0 : value !== "" && value
            ) {
                try {
                    setIsLoading(true);
                    const userPromises = Array.isArray(value)
                        ? value.map((id) => userApi.getById(id))
                        : [userApi.getById(value)];
                    const users = await Promise.all(userPromises);
                    const treatedValues = users.map((user) => ({
                        label: user?.name,
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

        fetchUserNames().catch((error) => {
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

export default UserInput;
