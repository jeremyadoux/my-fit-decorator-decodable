import { decodable, decodableArrayAttribute, decodableAttribute, decodableParamType } from "../decorators/decodableClass.decorator";

@decodable()
export class SecondClass {
    @decodableAttribute()
    attr1: string = "";

    @decodableAttribute({type: decodableParamType.PRIMARY}, {optional: true})
    attr2: number = 12;

    @decodableAttribute()
    attr3: boolean = false;

    @decodableArrayAttribute({type: decodableParamType.PRIMARY, object: "String"})
    attr4: string[] = ["plop"];

    @decodableArrayAttribute({type: decodableParamType.PRIMARY, object: "Number"})
    attr5: number[] = [1,2];
}


