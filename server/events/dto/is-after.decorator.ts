import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from "class-validator";

export function IsAfter(
    property: string,
    validationOptions?: ValidationOptions,
) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: "isAfter",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: unknown, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyName];

                    return (
                        value instanceof Date &&
                        relatedValue instanceof Date &&
                        value.getTime() > relatedValue.getTime()
                    );
                },
                defaultMessage(args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    return `${args.property} must be a date later than ${relatedPropertyName}`;
                },
            },
        });
    };
}
