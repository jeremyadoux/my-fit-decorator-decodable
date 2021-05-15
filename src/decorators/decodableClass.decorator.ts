import "reflect-metadata";
import { array, boolean, Decoder, exact, guard, inexact, number, object, optional, string } from 'decoders';


const decodableAttributeMetadataKey = Symbol("decodableAttribute");

export function decodable(options: OptionsDecodable = {}) {
    const _options = Object.assign(new OptionsDecodable, options);

    return function _decodable<T extends { new(...args: any[]): {} }>(constructor: T) {
        return class extends constructor {
            toObjectDecodable = () => {
                let attrList: MetadataDecodableReflect[]= []
                let target = Object.getPrototypeOf(this);

                while(target != Object.prototype) {
                  let childAttr: MetadataDecodableReflect[] = Reflect.getOwnMetadata(decodableAttributeMetadataKey, target) || [];
    
                  attrList.push(...childAttr);
                  target = Object.getPrototypeOf(target);
                }
    
                let element = {};

                for(let attr of attrList) {
                    let type = convertToDecodableObject(attr);
                    element[attr.name] = type;
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

export function decodableArrayAttribute(subType: any, options: OptionsDecodableAttribute = {}): PropertyDecorator {
    const _options = Object.assign(new OptionsDecodableAttribute, options);

    return function (
        target: Object,
        propertyKey: string
    ): void {
        if(typeof subType == "object" && typeof subType.toObjectDecodable !== "function") {
            throw new Error(subType.constructor.name + " need to be implement : @decodable to work.");
        }

        const fields: MetadataDecodableReflect[] = Reflect.getOwnMetadata(decodableAttributeMetadataKey, target) || [];

        let type = Reflect.getMetadata("design:type", target, propertyKey);

        fields.push({
            name : propertyKey,
            type: type,
            subType: subType,
            options: _options
        });
        
        Reflect.defineMetadata(decodableAttributeMetadataKey, fields, target)
    }
}

export function decodableAttribute(options: OptionsDecodableAttribute = {}): PropertyDecorator {
    const _options = Object.assign(new OptionsDecodableAttribute, options);

    return function (
        target: Object,
        propertyKey: string
    ): void {
        const fields: MetadataDecodableReflect[] = Reflect.getOwnMetadata(decodableAttributeMetadataKey, target) || [];

        let type = Reflect.getMetadata("design:type", target, propertyKey);

        fields.push({
            name : propertyKey,
            type: type,
            options: _options
        });
        
        Reflect.defineMetadata(decodableAttributeMetadataKey, fields, target)
    }
}

export function decodableClassAttribute(subType: any, options: OptionsDecodableAttribute = {}): PropertyDecorator {
    const _options = Object.assign(new OptionsDecodableAttribute, options);

    return function (
        target: Object,
        propertyKey: string
    ): void {

        if(typeof subType.toObjectDecodable !== "function") {
            throw new Error(subType.constructor.name + " need to be implement : @decodable to work.");
        }

        const fields: MetadataDecodableReflect[] = Reflect.getOwnMetadata(decodableAttributeMetadataKey, target) || [];

        fields.push({
            name : propertyKey,
            type: "Class",
            subType: subType,
            options: _options
        });
        
        Reflect.defineMetadata(decodableAttributeMetadataKey, fields, target)
    }
}


function convertToDecodableObject(attr: MetadataDecodableReflect) {
    const typeTS = attr.type;
    const options = attr.options;
    const typeSecondary =  attr.subType;

    let controledElement: string;
    if(typeof typeTS == "function") {
        controledElement = (<Function>typeTS).name;
    } else if(typeof typeTS == "string" && typeTS == "Class") {
        controledElement = "Class";
    } else {
        throw new Error("Decodable : This type is not implemented : " + typeTS);
    }

    let type;

    if(controledElement) {
        switch(controledElement) {            
            case "Array":
                if(typeSecondary && typeof typeSecondary == "string") {
                    type = array<any>(getPrimaryTypeDecodable(typeSecondary));
                } else if(typeof typeSecondary.toObjectDecodable == "function") {
                    type = array<any>(typeSecondary.toObjectDecodable());
                } else {
                    throw new Error("Decodable : This Array type is not implemented : " + typeSecondary);
                }
                break;
            case "Class":
                type = typeSecondary.toObjectDecodable();
                break;
            default:
                type = getPrimaryTypeDecodable(controledElement);
        }

        if(options.optional) {
            type = optional(type);
        } 

        return type;
    }
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

class OptionsDecodableAttribute {
    optional?: boolean = false;
}

interface MetadataDecodableReflect {
    name: string;
    type: string;
    subType?: string | any;
    options: OptionsDecodableAttribute;
}