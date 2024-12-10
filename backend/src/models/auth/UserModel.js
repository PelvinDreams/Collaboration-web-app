import mongoose from "mongoose";
import bcrypt from "bcrypt";


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please provide your name"],
    },

    
    email: {
        type: String,
        required: [true, "Please an email"],
        unique: true,
        trim: true,
        match: [
          /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
          "Please add a valid email",
        ],
      },

      password: {
        type: String,
        required: [true, "Please add password!"],
      },
  
      photo: {
        type: String,
        default: "https://avatars.githubusercontent.com/u/19819005?v=4",
      },
  
      bio: {
        type: String,
        default: "I am a new user.",
      },
  
      role: {
        type: String,
        enum: ["user", "admin", "creator"],
        default: "user",
      },
  
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true, minimize: true }
  );


  // hash password before saving user
  UserSchema.pre("save", async function (next) {

  //  check is the password is not modified 
  if(!this.isModified("password")) {
    return next();
  }


  // hash the password ==>
    const salt = await bcrypt.genSalt(10)  

  // has the password with the salt
  const hashedPassword = await bcrypt.hash(this.password, salt); 
  // set the password to the hashed password
  this.password = hashedPassword;

// call the next middleware
 next();

  });

  const User = mongoose.model("User", UserSchema);

  export default User;