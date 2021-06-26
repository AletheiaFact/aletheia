import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import * as passport from "passport";
import { User, UserDocument } from "../users/schemas/user.schema";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class LocalSerializer {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {
        passport.serializeUser(this.userModel.serializeUser());
        passport.deserializeUser(this.userModel.deserializeUser());
    }
}
