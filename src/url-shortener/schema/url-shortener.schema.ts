import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { User } from 'src/user/schema/user.schema'

export type UrlDocument = URL & Document

@Schema()
export class Url extends Document {
    @Prop()
    original_url: string

    @Prop({ index: true })
    custom_name: string

    @Prop({ index: true, expires: 0 })
    expire_at: Date

    @Prop({ default: 0 })
    redirect_count: number

    @Prop({ default: false })
    is_private: boolean

    @Prop()
    phone_number: string

    @Prop()
    user_id: string
}

export const UrlSchema = SchemaFactory.createForClass(Url)
