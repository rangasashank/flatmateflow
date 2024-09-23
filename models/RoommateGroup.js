const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const RoommateGroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,

        },
    ],
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
});

//mongodb middleware, it runs before saving the group and checks if the password field has been updated: if yes, it hashes the password and stores the hashed password
RoommateGroupSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

RoommateGroupSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('RoommateGroup', RoommateGroupSchema);