import { guard } from "decoders";
import "reflect-metadata";
const paramsMetadataKey = Symbol("params");

export function params(typeControlled: any): ParameterDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        parameterIndex: number
    ) {
        let existingRequiredParameters: any[] =
            Reflect.getOwnMetadata(paramsMetadataKey, target, propertyKey) || [];

        if(typeof typeControlled.toObjectDecodable !== "function") {
            throw new Error(typeControlled.constructor.name + " need to be implement : @decodable to work.");
        }

        existingRequiredParameters.push({
            index: parameterIndex,
            class: typeControlled,
        });

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
            let parameters: any[] = Reflect.getOwnMetadata(
                paramsMetadataKey,
                target,
                propertyName
            );
            if (parameters) {
                for (let parameterIndex of parameters) {
                    const payloadGuard = guard(parameterIndex.class.toObjectDecodable(), {});
                    let controlledData = payloadGuard(arguments[parameterIndex.index]);

                    arguments[parameterIndex.index] = Object.assign(parameterIndex.class, controlledData);
                }
            }

            return method.apply(this, arguments);
        };
    }
}