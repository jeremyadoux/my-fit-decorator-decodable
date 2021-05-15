import "reflect-metadata";
const paramsMetadataKey = Symbol("params");

export function params(): ParameterDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        parameterIndex: number
    ) {
        let existingRequiredParameters: number[] =
            Reflect.getOwnMetadata(paramsMetadataKey, target, propertyKey) || [];

        existingRequiredParameters.push(parameterIndex);

        Reflect.defineMetadata(
            paramsMetadataKey,
            existingRequiredParameters,
            target,
            propertyKey
        );
    }
}

export function validate(): MethodDecorator {
    return function (
        target: Object,
        propertyName: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        let method = descriptor.value;
        descriptor.value = function () {
            let requiredParameters: number[] = Reflect.getOwnMetadata(
                paramsMetadataKey,
                target,
                propertyName
            );
            if (requiredParameters) {
                for (let parameterIndex of requiredParameters) {

                    console.log(arguments[parameterIndex]);
                }
            }

            return method.apply(this, arguments);
        };
    }
}