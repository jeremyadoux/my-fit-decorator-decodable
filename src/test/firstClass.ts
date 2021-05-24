import { decodable, decodableArrayAttribute, decodableAttribute, decodableParamType } from "../decorators/decodableClass.decorator";
import { FirstEnum } from "./firstEnum";
import { SecondClass } from "./secondClass";

@decodable()
export class MyFirstClass {
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

    @decodableAttribute({type: decodableParamType.CLASS, object: new SecondClass})
    attr6: SecondClass = new SecondClass();

    @decodableArrayAttribute({type: decodableParamType.CLASS, object: new SecondClass})
    attr7: SecondClass[] = [new SecondClass];

    @decodableAttribute({type: decodableParamType.ENUM, object: FirstEnum})
    testEnum: FirstEnum;

    @decodableArrayAttribute({type: decodableParamType.ENUM, object: FirstEnum})
    testEnumArray: FirstEnum[];

}