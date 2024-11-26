import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcrypt';

const RoommateGroupSchema = new Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    admins: [
        {
            _id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            name: { type: String, required: true },
            required: true,

            
        },
    ],
    members: [
        {
            _id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
            name: { type: String, required: true },
        },
    ],
});

//mongodb middleware, it runs before saving the group and checks if the password field has been updated: if yes, it hashes the password and stores the hashed password
RoommateGroupSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
});

RoommateGroupSchema.methods.matchPassword = async function (enteredPassword) {
    return await compare(enteredPassword, this.password);
};

export default model('RoommateGroup', RoommateGroupSchema);