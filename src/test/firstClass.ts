import { decodable, decodableArrayAttribute, decodableAttribute, decodableClassAttribute } from "../decorators/decodableClass.decorator";
import { Decodable } from "../decorators/decodableClass.extension";
import { SecondClass } from "./secondClass";

@decodable()
export class MyFirstClass {
    @decodableAttribute()
    attr1: string = "";

    @decodableAttribute({optional: true})
    attr2: number = 12;

    @decodableAttribute()
    attr3: boolean = false;

    @decodableArrayAttribute("String")
    attr4: string[] = ["plop"];

    @decodableArrayAttribute("Number")
    attr5: number[] = [1,2];

    @decodableClassAttribute(new SecondClass().toObjectDecodable())
    attr6: SecondClass = new SecondClass();

    @decodableArrayAttribute(new SecondClass().toObjectDecodable())
    attr7: SecondClass[] = [new SecondClass];

}