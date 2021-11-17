import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UrlDocument = URL & Document

@Schema()
export class Url extends Document {
    @Prop()
    originalUrl: string

    @Prop()
    shortUrl: string

    @Prop({ index: true, expires: 0 })
    expireAt: Date

    @Prop({ default: 0 })
    redirectCount: number
}

export const UrlSchema = SchemaFactory.createForClass(Url)
