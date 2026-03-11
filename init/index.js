const mongoose=require("mongoose");
const initData= require("./data.js");
const Listing= require("../models/listing.js");
 const url="mongodb://127.0.0.1:27017/wanderlust";
 async function main(){
     await mongoose.connect(url);
 };
 main().then((res)=>{
     console.log("connected to mongodb");
 }).catch((err)=>{
     console.log("not connected to mongodb");
 });
 const initDB =async ()=>{
    await Listing.deleteMany({});
   initData.data= initData.data.map((obj)=>({...obj,owner:"69ae74919da2665fd8aaa692"}));
    await Listing.insertMany(initData.data);
    console.log("data was initalized");
 };
 initDB();