/* eslint-disable @typescript-eslint/no-explicit-any */
import { equal } from 'assert';
import  Parse  from 'parse/node';

function diff_hours(dt2:any, dt1:any) 
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(Math.round(diff));
  
 } 
Parse.Cloud.define("setUserHours", async (request: any) => {
});

Parse.Cloud.define("SetSettingsUser", async (request: any) => {
  
  const query = new Parse.Query("_User");
  const {owner} = request.params;

  query.equalTo("ethAddress", owner);
  const queryResult = await query.first({ useMasterKey: true });

  if (!queryResult) {return undefined;}

  queryResult.set("bio", request.params.bio);

  await queryResult.save(null, { useMasterKey: true });
  return "ok"
});
let userEmail=""

Parse.Cloud.define("setUserEmail", async (request: any) => {
  
  const {email} = request.params;
userEmail=email

});

Parse.Cloud.define("getUserEmail", async (request: any) => {
  var currentDate=new Date()
  const user =  await Parse.Cloud.run("getUser",{email:userEmail});

  if(currentDate<=request.params.event.start&&currentDate<=request.params.event.end&&user){
    let hoursCalculated=await diff_hours(request.params.event.start,request.params.event.end)

    if(user.get("meetingRoomHours")<hoursCalculated){
        
      return false
    } 

    
const query = new Parse.Query("Reserves");


let object= await query.find()
   for(let i=0;i<object.length;i++){
     

       var dFecha1 = new Date(request.params.event.start.valueOf());
       var dFecha2 = new Date(request.params.event.end.valueOf());
       var dRangoInicio = new Date(object[i].attributes.event.start);
       var dRangoFin = new Date(object[i].attributes.event.end);
     
       // Verificar si las fechas están dentro del rango
       if ((dFecha1 > dRangoInicio && dFecha1 < dRangoFin) ||
          ( dFecha2 > dRangoInicio && dFecha2 < dRangoFin)) {
     
            return false
         
       }

 
   }



  
    const Reserves=await Parse.Object.extend("Reserves")
   
  if(user?.get("meetingRoomHours")<=0){
    return false
  } else {
    let hoursCalculated=await diff_hours(request.params.event.start,request.params.event.end)
  
  
    user?.set("meetingRoomHours",user.get("meetingRoomHours")-hoursCalculated)
    user?.save()
    
  
    let uniqueID=parseInt((Date.now()+ Math.random()).toString())
  
    const reserve= await new Reserves() 
    reserve.set("uid",uniqueID)       
    
    reserve.set("user",userEmail)  
    reserve.set("title",JSON.stringify(request.params.event.title)  )
    let uniqueID2=parseInt((Date.now()+ Math.random()).toString())
  
  reserve.set("event",{
    event_id: uniqueID2,
    title: request.params.event.title,
    start: request.params.event.start,
    end: request.params.event.end,
   })
   
   await reserve.save()
   return true

       
  }
}
});
Parse.Cloud.define("getUser", async (request: any) => {

  const query = new Parse.Query("_User");
  query.equalTo("email",request.params.email)
  const results = await query.first({useMasterKey:true});
 
 return results

});
Parse.Cloud.define("getAllUsers", async (request: any) => {

  const query = new Parse.Query("_User");
  const results = await query.find({useMasterKey:true});
 
 return results

});
Parse.Cloud.define("getNftPerfilUserOnSale", async (request: any) => {

  const { ethAddress } = request.params;
  const query = new Parse.Query("ItemsMinted");
  query.equalTo("ownerAddress", ethAddress);
  query.equalTo("forSale", true);
  query.descending('updatedAt');
  const results = await query.find({useMasterKey:true});
  
  async function getUser(ownerAddress: any) {

   const queryUser = new Parse.Query("User");
   queryUser.equalTo('ethAddress', ownerAddress)

   const resultUser = await queryUser.first({ useMasterKey: true });

   const username =  resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';
   const userAvatar =  resultUser?.attributes.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

   return {username, userAvatar }
 }

 const response = await Promise.all(
   results.map( async (value: any) => {
     
     const objStr =  JSON.stringify(value);
     const objJson = JSON.parse(objStr);
     const {ownerAddress} = objJson;

     let newArr = [];

     const { username, userAvatar } = await getUser(ownerAddress); 


     newArr = {...objJson, username, userAvatar } 

     return newArr;
   }) 
 ) 
 const dataNft = JSON.stringify(response);
 const dataObjNft = JSON.parse(dataNft);


 return dataObjNft;
});

Parse.Cloud.define("getNftPerfilUserOwned", async (request: any) => {
  
  const { ethAddress } = request.params;
  const query = new Parse.Query("ItemsMinted");
  query.equalTo("ownerAddress", ethAddress);
  query.descending('updatedAt');
  const results = await query.find({useMasterKey:true});
  
  async function getUser(ownerAddress: any) {

   const queryUser = new Parse.Query("User");
   queryUser.equalTo('ethAddress', ownerAddress)

   const resultUser = await queryUser.first({ useMasterKey: true });

   const username =  resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';
   const userAvatar =  resultUser?.attributes.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

   return {username, userAvatar }
 }

 const response = await Promise.all(
   results.map( async (value: any) => {
     
     const objStr =  JSON.stringify(value);
     const objJson = JSON.parse(objStr);
     const {ownerAddress} = objJson;

     let newArr = [];

     const { username, userAvatar } = await getUser(ownerAddress); 


     newArr = {...objJson, username, userAvatar } 

     return newArr;
   }) 
 ) 
 const dataNft = JSON.stringify(response);
 const dataObjNft = JSON.parse(dataNft);


 return dataObjNft;
  
});