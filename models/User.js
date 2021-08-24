const mongoose = require('mongoose');
const { MONGO_URL } = require('../conf');
const bcrybt =require('bcrypt');


mongoose.set('useCreateIndex', true);

mongoose.connect(MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
    .then(()=>console.log('database conected'))
    .catch(err =>{console.log(err)});

const userSchema = new mongoose.Schema({

    username:{
        type: String,
        unique: true,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    }
});
/* userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({ username })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
} */
// if the   Uesr is not creating for the first Time will NOt Hash password for Him
userSchema.pre('save',function (next) {
    if(!this.isModified("password")){
        return next();
    }
    //Uesr is creating for the first Time will Hash password 
    this.password = bcrybt.hashSync(this.password,5)
    next();
});

userSchema.methods.comparePassowrd = function(plainText,callback){
    return callback(null,bcrybt.compareSync(plainText,this.password))
}

const userModel = mongoose.model("user",userSchema);

module.exports = userModel;