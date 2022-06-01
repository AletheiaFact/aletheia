import * as React from "react";
import { useForm, useFieldArray } from "react-hook-form";

type FormValues = {
  firstContent: string;
  fieldArray: { content: string }[];
};


export default function InputTextList(props) {
  const { register, control, watch } = useForm<FormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "fieldArray"
  });
  const watchFieldArray = watch("fieldArray");
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index]
    };
  });

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      const contentArray = [value.firstContent]
      value.fieldArray.forEach(field => {
        contentArray.push(field.content)
      })
      props.onChange(contentArray)
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div>
        <input {...register("firstContent")} placeholder={props.placeholder} />

        {controlledFields.map((field, index) => {
          return (
          <section key={`fieldArray.${index}.content`} >
            <input {...register(`fieldArray.${index}.content` as const)} placeholder={props.placeholder} />
            <button type="button" onClick={() => remove(index)}>
              DELETE
            </button>
          </section> 
          )
        })}

        <button
          type="button"
          onClick={() =>
            append({
              content: ""
            })
          }
        >
          Append
        </button>
    </div>
  );
}