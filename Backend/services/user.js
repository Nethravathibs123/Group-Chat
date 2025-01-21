
const User=require('../models/user')
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs')
const sequelize=require('../util/database');
const { where } = require('sequelize');


function generateToken(id){
    const key = "Nethra";

    return jwt.sign({ userId: id }, key);
}
module.exports.signUp=async(req)=>{

    
    const{email,phone,password,name}=req.body;
    const salt=5;
    const t=await sequelize.transaction();
    try{
const hash=await bcrypt.hash(password,salt);
const user=
{    email:email,
    phone:phone,
    password:hash,
    name:name
       };

        await User.create(user,{transaction:t});
       
       
     await  t.commit();

       return {status:201,message:"User is Added"};
    }
    catch(e)
    {
        console.log(e);
        
        await t.rollback();
     
        return { status: 409, error: e.message };
    }
    

}
