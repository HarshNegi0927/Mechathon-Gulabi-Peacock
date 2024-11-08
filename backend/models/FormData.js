const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken")
const SECRET_KEY = process.env.SECRET_KEY
const FormDataSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Not Valid Email")
            }
        }
    },
    password: { type: String, },
    tokens: [
        {
            token: {
                type: String,
                required: true,
            }
        }
    ]

});
FormDataSchema.methods.generateAuthtoken = async function(req,res){
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY, { expiresIn: '1d' }); // Token expires in 1 day
    this.tokens = this.tokens.concat({ token }); // Add token to user's tokens array
    await this.save();
    return token;
}

const FormDataModel = mongoose.model('User', FormDataSchema);

module.exports = FormDataModel;
