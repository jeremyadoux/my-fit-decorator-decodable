import { params, validate } from "../decorators/decodableParam.decorator";
import { MyFirstClass } from "./firstClass";

export class Task {
    @validate()
    run(@params(new MyFirstClass) json: any): void {
        console.log(json);
    }
}