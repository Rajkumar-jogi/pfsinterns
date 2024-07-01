
const User = require('../models/userModel')

const bcrypt = require('bcryptjs');


const generateToken = require('../utils/generateToken')


// register user
const registerUser = async (request, response) => {
   try{
      
      const {name, email, password} = request.body;
      
      // Validation: Check if required fields are missing
      if(!name || !email || !password ){
        return response.status(400).json({message: 'Please provide all required fields...'})
      } 

      const user = await User.findOne({email})
      
      // Validation: Check if email is already registered
      if(user){
        return response.status(400).json({message: "user already exists..."})
      }
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10)
     
      const userDetails = {
        name,
        email,
        password: hashedPassword,
      }

      // create new user instance
      const newUser = new User(userDetails)
      
      // Save user to database
      await newUser.save()
      const token = generateToken(newUser)
      response.status(201).json({message: 'User created successfully', token })

   }catch(error){
      console.log(error)
      return response.status(500).json({error: 'Internal Server Error..'})
   }
}


// login user
const LoginUser = async (request, response) => {

    try{
        const {email, password } = request.body
        if(!email || !password ){
            return response.status(400).json({message: 'Please enter required username and password'})
        }

        const user = await User.findOne({email})

        if(!user){
            return response.status(401).json({message: "Invalid email"})
        }

        const dbPassword = user.password
        // console.log(dbPassword)

        const isPasswordMatched = await bcrypt.compare(password, dbPassword)
        if(isPasswordMatched){
            // console.log(user)
            const token = generateToken(user)
            // console.log('token: ', token)
            return response.status(200).json({message: "Login Success", token})
        }else{
            return response.status(401).json({message: "Invalid Password"})
        }
    }catch(err){
        console.log(err)
        return response.status(500).json({message: "Internal Server Error!"})
    }
    
}

module.exports = {registerUser, LoginUser}