const userService=require('../services/user')

module.exports.userSignup=async(req,res)=>{
        const result=await userService.signUp(req);
        return res.status(result.status).json({ message: result.message, error: result.error });
 
}