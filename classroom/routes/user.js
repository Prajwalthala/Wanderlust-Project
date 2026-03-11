const express=require("express");
const router =express.Router();

//index route
router.get("/",(req,res)=>{
    res.send("get for users");
});
// show -user
router.get("/:id",(req,res)=>{
    res.send("get for  show users");
});
//post  user
router.post("/",(req,res)=>{
    res.send("post for users");
});
// delete user
router.delete("/:id",(req,res)=>{
res.send("delete for users");
});
module.exports=router;
