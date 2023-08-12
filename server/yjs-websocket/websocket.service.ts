import { Injectable } from "@nestjs/common";

@Injectable()
export class websocketService {
    getHello(): string {
        return "Hello World!";
    }
}
