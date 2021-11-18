import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { User } from 'src/user/schema/user.schema'

export type UrlDocument = URL & Document

@Schema()
export class Url extends Document {
    @Prop()
    originalUrl: string

    @Prop({ index: true })
    customName: string

    @Prop({ index: true, expires: 0 })
    expireAt: Date

    @Prop({ default: 0 })
    redirectCount: number

    @Prop({ default: false })
    is_private: boolean

    @Prop()
    phonenumber: string

    @Prop()
    userId: string
}

export const UrlSchema = SchemaFactory.createForClass(Url)
