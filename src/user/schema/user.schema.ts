import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { hash } from 'bcrypt'


export type UserDocument = User & Document

@Schema()
export class User extends Document {
    @Prop()
    user_name: string

    @Prop()
    phone_number: string

    @Prop()
    password: string
}
export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.pre('save', async function (next) {
    if (this.password) {
        this.password = await hash(this.password, 10)
        next()
    }
})
