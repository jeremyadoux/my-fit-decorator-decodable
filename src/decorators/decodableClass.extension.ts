import { Decoder } from "decoders";

export class Decodable {
    toObjectDecodable(): Decoder<unknown, unknown> {
        throw new Error("Decodable : please use decorator : @decodable on your class.");
    }
}