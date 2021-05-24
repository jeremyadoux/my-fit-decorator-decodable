import "reflect-metadata";
import { array, boolean, Decoder, exact, guard, inexact, number, object, optional, string } from 'decoders';


const decodableAttributeMetadataKey = Symbol("decodableAttribute");

export function decodableAttribute(options: OptionsDecodableObject = {type: decodableParamType.PRIMARY}, optionsNvie: OptionsDecodableNVIE = {optional: false}) {

    return function (
        target: Object,
        propertyKey: string
    ): void {

        options.name = propertyKey;
        if(options.type == decodableParamType.PRIMARY) {

            options.object = (Reflect.getMetadata("design:type", target, propertyKey)).name;
        } else if(options.type == decodableParamType.CLASS) {
            if(!options.object) {
                throw new Error("Property "+ propertyKey +" need to pass class instance.");
            }

            if(typeof options.object.toObjectDecodable !== "function") {
                throw new Error("Property "+ propertyKey +" need to be implement : @decodable to work.");
            }
        } else if(options.type == decodableParamType.ENUM) {
            if(!options.object) {
                throw new Error("Property "+ propertyKey +" need to pass class instance.");
            }

            /*if(typeof options.object.toObjectDecodable !== "function") {
                throw new Error("Property "+ propertyKey +" need to be implement : @decodable to work.");
            }*/
        }


        const fields: OptionsDecodableAttribute[] = Reflect.getOwnMetadata(decodableAttributeMetadataKey, target) || [];

        fields.push({
            objects: options,
            decodable: optionsNvie
        });
        
        Reflect.defineMetadata(decodableAttributeMetadataKey, fields, target)
    }
}

export function decodableArrayAttribute(options: OptionsDecodableObject = {type: decodableParamType.PRIMARY}, optionsNvie: OptionsDecodableNVIE = {optional: false}) {

    return function (
        target: Object,
        propertyKey: string
    ): void {

        options.name = propertyKey;
        if(options.type == decodableParamType.CLASS) {
            if(!options.object) {
                throw new Error("Property "+ propertyKey +" need to pass class instance.");
            }

            if(typeof options.object.toObjectDecodable !== "function") {
                throw new Error("Property "+ propertyKey +" need to be implement : @decodable to work.");
            }
        } else if(options.type == decodableParamType.ENUM) {
            if(!options.object) {
                throw new Error("Property "+ propertyKey +" need to pass class instance.");
            }

            /*if(typeof options.object.toObjectDecodable !== "function") {
                throw new Error("Property "+ propertyKey +" need to be implement : @decodable to work.");
            }*/
        }


        const fields: OptionsDecodableAttribute[] = Reflect.getOwnMetadata(decodableAttributeMetadataKey, target) || [];

        options.decodableFunction = array

        fields.push({
            objects: options,
            decodable: optionsNvie
        });
        
        Reflect.defineMetadata(decodableAttributeMetadataKey, fields, target)
    }
}

export function decodable(options: OptionsDecodable = {}) {
    const _options = Object.assign(new OptionsDecodable, options);

    return function _decodable<T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            toObjectDecodable = () => {
                let attrList: OptionsDecodableAttribute[]= []
                let target = Object.getPrototypeOf(this);

                while(target != Object.prototype) {
                  let childAttr: OptionsDecodableAttribute[] = Reflect.getOwnMetadata(decodableAttributeMetadataKey, target) || [];
    
                  attrList.push(...childAttr);
                  target = Object.getPrototypeOf(target);
                }
    
                let element = {};

                for(let attr of attrList) {
                    let decodable = convertToDecodableObject2(attr);
                    element[attr.objects.name] = decodable;
                }
    
                switch(_options.method) {
                    case "exact":
                        return exact(element);
                    case "inexact" : 
                        return inexact(element);
                    case "object" : 
                        return object(element);
                }
            }
        };
    }
}

function convertToDecodableObject2(options: OptionsDecodableAttribute) {
    let decodable;
    switch(options.objects.type) {
        case decodableParamType.PRIMARY:
            decodable = getPrimaryTypeDecodable(options.objects.object);
        break;
        case decodableParamType.CLASS:
            decodable = options.objects.object.toObjectDecodable();
        break;
        case decodableParamType.ENUM:
            throw new Error("Decodable : This type is not implemented : " + options.objects.type);
        break;
        default:
            throw new Error("Decodable : This type is not implemented : " + options.objects.type);

    }

    if(options.objects.decodableFunction) {
        decodable = options.objects.decodableFunction(decodable);
    }

    if(options.decodable.optional) {
        decodable = optional(decodable);
    } 

    return decodable;
}

function getPrimaryTypeDecodable(type: string) {
    switch(type) {
        case "Number":
            return number;
        case "String":
            return string;
        case "Boolean":
            return boolean;
        default:
            throw new Error("Decodable : Type are not correctly specified : " + type);
    }
}

class OptionsDecodable {
    method?: "object" | "exact" | "inexact" = "exact";
}

type OptionsDecodableAttribute = {
    objects: OptionsDecodableObject
    decodable: OptionsDecodableNVIE
}

type OptionsDecodableObject = {
    name?: string;
    type: decodableParamType
    object?: any
    decodableFunction?: Function
}

type OptionsDecodableNVIE = {
    optional?: boolean
}

export enum decodableParamType {
    CLASS,
    ENUM,
    PRIMARY
}
