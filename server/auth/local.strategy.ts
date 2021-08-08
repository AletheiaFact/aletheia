import { Strategy } from "passport-local";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { User, UserDocument } from "../users/schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {
        super({ usernameField: "email" }, userModel.authenticate());
    }
}
