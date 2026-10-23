import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { softDeletePlugin } from "mongoose-softdelete-typescript";
import * as mongoose from "mongoose";
import type { Image } from "../../../claim/types/image/schemas/image.schema";

export type OrganizationDocument = Organization & mongoose.Document;

@Schema({
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true,
})
export class Organization {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true })
    slug: string;

    @Prop({ type: mongoose.Types.ObjectId, ref: "Image", required: true })
    logo: Image;

    @Prop({ required: false, trim: true })
    website?: string;
}

const OrganizationSchemaRaw = SchemaFactory.createForClass(Organization);

// Mirrored by the create-organizations-slug-unique-index migration.
OrganizationSchemaRaw.index(
    { slug: 1 },
    { unique: true, partialFilterExpression: { isDeleted: false } }
);

OrganizationSchemaRaw.plugin(softDeletePlugin);

export const OrganizationSchema = OrganizationSchemaRaw;
