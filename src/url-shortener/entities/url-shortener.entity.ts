import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UrlDocument = URL & Document;

@Schema()
export class URL {
    @Prop()
    originalUrl: string;

    @Prop()
    shortUrl: string;

}

export const UrlSchema = SchemaFactory.createForClass(URL);