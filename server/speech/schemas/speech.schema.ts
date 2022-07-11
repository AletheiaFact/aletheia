import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type SpeechDocument = Speech & mongoose.Document;

@Schema()
export class Speech {
    @Prop({
        default: "speech",
        required: true,
    })
    type: string;

    @Prop({
        type: mongoose.Types.ObjectId,
        required: true,
        refPath: "onModel",
    })
    targetId: mongoose.Types.ObjectId;
    
    @Prop({ type: Object, required: true })
    content: object;
}

const SpeechSchemaRaw = SchemaFactory.createForClass(Speech);

export const SpeechSchema = SpeechSchemaRaw;
