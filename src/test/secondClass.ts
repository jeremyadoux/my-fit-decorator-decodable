import { decodable, decodableArrayAttribute, decodableAttribute } from "../decorators/decodableClass.decorator";
import { Decodable } from "../decorators/decodableClass.extension";
import { params, validate } from "../decorators/decodableParam.decorator";

@decodable()
export class SecondClass extends Decodable {
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


export class Task {
    @validate()
    run(@params() json: any): void {
        console.log("running task, name: " + json);
    }
}