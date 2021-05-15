import { decodable, decodableArrayAttribute, decodableAttribute } from "../decorators/decodableClass.decorator";
import { Decodable } from "../decorators/decodableClass.extension";
import { params, validate } from "../decorators/decodableParam.decorator";
import { MyFirstClass } from "./firstClass";

@decodable()
export class SecondClass {
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
}


