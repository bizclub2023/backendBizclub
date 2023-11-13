/* eslint-disable @typescript-eslint/no-explicit-any */
import { equal } from 'assert';
import  Parse  from 'parse/node';

var userEmail="";
var roomAdmin="";

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

var room="meetingRoom"

Parse.Cloud.define("setRoom", async (request: any) => {
  
  const {salon} = request.params;
room=salon
  
});
Parse.Cloud.define("getRoom", async (request: any) => {
 

  // Devuelve el 'salon' asociado al usuario
  return room;
});

Parse.Cloud.define("getSalon", async (request: any) => {
  const user = request.user; // Obtiene el usuario actual

  if (!user) {
    // Si no se proporciona un usuario válido, regresa un error o maneja la situación como desees
    return Promise.reject("Usuario no autenticado.");
  }

  // Obtiene el 'salon' asociado al usuario actual
  const salon = user.get("salon");

  // Puedes manejar la situación si 'salon' es null o undefined
  if (!salon) {
    return Promise.reject("El usuario no tiene asignado un salon.");
  }

  // Devuelve el 'salon' asociado al usuario
  return salon;
});



Parse.Cloud.define("getEventsAdmin", async (request: any) => {
  const query = new Parse.Query("Reserves");
 
  
  if(room==="meetingRoom"){
    await query.equalTo("areaName","meetingRoom")

  } else if(room==="trainingRoom"){
    await query.equalTo("areaName","trainingRoom")

  } else if(room==="office8Room"){
    await query.equalTo("areaName","office8Room")

  } else if(room==="office4Room"){
    await query.equalTo("areaName","office4Room")

  } else if(room==="office2Room"){
    await query.equalTo("areaName","office2Room")

  } else if(room==="deskRoom"){
    await query.equalTo("areaName","deskRoom")

  } else if(room==="shareRoom"){
    await query.equalTo("areaName","shareRoom")

  }  else{
   await query.equalTo("areaName","shareRoom")

  }
  query.limit(1000)

    let object= await query.find()
    let eventos:any=[]
    let eventosUser:any=[]

  if(object){
    let currentDate=new Date()

    for(let i=0;i<object.length;i++){ 
      if(object[i].attributes.event&&currentDate>=object[i].attributes.event.start){

      eventos=[...eventos,{
        event_id: null,
        title: object[i].attributes.title,
        start: object[i].attributes.event.start,
        end: object[i].attributes.event.end,
        admin_id: 1,
        editable: false,
        deletable: false,
        color: userEmail===object[i].attributes.user?"red":"#50b500"
      }]
    } else {
      if(object[i].attributes.event){
        eventos=[...eventos,{
          event_id: null,
          title: object[i].attributes.title,
          start: object[i].attributes.event.start,
          end: object[i].attributes.event.end,
          admin_id: 1,
          editable: false,
          deletable: false,
          color: userEmail===object[i].attributes.user?"blue":"#50b500"
        }]
      }
       
      }

      if(userEmail===object[i].attributes.user){
        if(currentDate<=object[i].attributes.event.start){

        eventosUser=[...eventosUser,{
          id:i,
          title: object[i].attributes.title,
          start: object[i].attributes.event.start.toString(),
          end: (object[i].attributes.event.end).toString(),
          user:object[i].attributes.user,      
          room:object[i].attributes.areaName==="meetingRoom"?"SalaReuniones":"SalonComun",
          }]
          
        }
      }
   
    }
  }
return {eventosUser,eventos}
})
Parse.Cloud.define("getRoom", (request: any) => {
  return roomAdmin
})
Parse.Cloud.define("getUserMail", (request: any) => {
  return userEmail
})
Parse.Cloud.define("setSalon", async (request: any) => {
  const { room } = request.params;
  const user = request.user; // Obtiene el usuario actual

  if (!user) {
    // Si no se proporciona un usuario válido, regresa un error o maneja la situación como desees
    return Promise.reject("Usuario no autenticado.");
  }
  // Asocia la variable 'salon' al usuario actual
  user.set("salon", room);

  // Guarda los cambios en el usuario
  await user.save(null, { useMasterKey: true });

  // Puedes devolver algún mensaje de confirmación si lo deseas
  return "Salon asignado correctamente.";
});

Parse.Cloud.define("getEvents", async (request: any) => {
  const {email} = request.params;
  const {room} = request.params;

  const User = Parse.Object.extend('_User'); 

  const queryUser = new Parse.Query(User);

  queryUser.equalTo("email",email)
  const user = await queryUser.first({useMasterKey:true});
  

if(user){
  let salon = user.get("salon");

  
  if(!salon){
    await Parse.Cloud.run("setSalon",{room:"meetingRoom"});
  salon="meetingRoom"
  }
    const query =await new Parse.Query("Reserves");
  if(room){
    if(room==="meetingRoom"){
      await query.equalTo("areaName","meetingRoom")
  
    } else if(room==="trainingRoom"){
      await query.equalTo("areaName","trainingRoom")
  
    } else if(room==="office8Room"){
      await query.equalTo("areaName","office8Room")
  
    } else if(room==="office4Room"){
      await query.equalTo("areaName","office4Room")
  
    } else if(room==="office2Room"){
      await query.equalTo("areaName","office2Room")
  
    } else if(room==="deskRoom"){
      await query.equalTo("areaName","deskRoom")
  
    } else if(room==="shareRoom"){
      await query.equalTo("areaName","shareRoom")
  
    }  else{
     await query.equalTo("areaName","meetingRoom")
  
    }
  }else{
    if(salon==="meetingRoom"){
      await query.equalTo("areaName","meetingRoom")
  
    } else if(salon==="trainingRoom"){
      await query.equalTo("areaName","trainingRoom")
  
    } else if(salon==="office8Room"){
      await query.equalTo("areaName","office8Room")
  
    } else if(salon==="office4Room"){
      await query.equalTo("areaName","office4Room")
  
    } else if(salon==="office2Room"){
      await query.equalTo("areaName","office2Room")
  
    } else if(salon==="deskRoom"){
      await query.equalTo("areaName","deskRoom")
  
    } else if(salon==="shareRoom"){
      await query.equalTo("areaName","shareRoom")
  
    }  else{
     await query.equalTo("areaName","meetingRoom")
  
    }
  }
   
    await query.limit(1000)
      let object= await query.find()
      let eventos:any=[]
    if(object){
      
      for(let i=0;i<object.length;i++){ 
        if(object[i].attributes.title&&object[i].attributes.event){
        eventos=await [...eventos,{
          event_id: null,
          title: object[i].attributes.title,
          start: object[i].attributes.event.start,
          end: object[i].attributes.event.end,
          admin_id: 1,
          editable: false,
          deletable: false,
          color: await user.get("email")===object[i].attributes.user?"red":"#50b500"
        }]
     
      }
      }
  return eventos
  
}
}

});
Parse.Cloud.define("setUserEmail", async (request: any) => {
  
  const {email} = request.params;
userEmail=email

});

Parse.Cloud.define("getUserEmail", async (request: any) => {
  const queryUser = new Parse.Query("_User");

  queryUser.equalTo("email",userEmail)
  const user = await queryUser.first({useMasterKey:true});

  const eventStart = request.params.event.start;
  const eventEnd = request.params.event.end;
if(!user){
return { success: false, error: "No User"  }
}
  // Verificar si el usuario tiene suficientes horas disponibles
  const hoursCalculated = await diff_hours(eventStart, eventEnd);
  if (user.get("meetingRoomHours") < hoursCalculated) {
    return { success: false, error: "No tienes suficientes horas disponibles para esta reserva."+eventStart+" otro "+eventEnd+" horas "+user.get("meetingRoomHours")  };
  }
  // Consulta para verificar si hay eventos que se superponen
  const query = new Parse.Query("Reserves");
  query.equalTo("areaName",room );
  query.greaterThanOrEqualTo("event.start", eventStart);
  query.lessThanOrEqualTo("event.end", eventEnd);

  try {
    const conflictingEvents = await query.find({ useMasterKey: true });

    if (conflictingEvents.length > 0) {
      return { success: false, error: "Ya existe un evento en esa fecha y hora." ,salon:room};
    }

    // Realizar la reserva
    user.set("meetingRoomHours", user.get("meetingRoomHours") - hoursCalculated);

    const uniqueID = parseInt((Date.now() + Math.random()).toString());
    const Reserves = Parse.Object.extend("Reserves");
    const reserve = new Reserves();
    
    reserve.set("uid", uniqueID);
    reserve.set("user", userEmail);
    reserve.set("title", request.params.event.title);
    const uniqueID2 = parseInt((Date.now() + Math.random()).toString());
    
    reserve.set("event", {
      event_id: uniqueID2,
      title: request.params.event.title,
      start: eventStart,
      end: eventEnd,
    });
    
    const areaName = room ;
    reserve.set("areaName", areaName);
    
    await Promise.all([reserve.save(null, { useMasterKey: true }), user.save(null, { useMasterKey: true })]);
    
    return { success: true, message: "Reserva realizada con éxito.",salon:room };
  } catch (error) {
    return { success: false, error: "Se produjo un error al realizar la reserva." ,salon:room};
  }
});
/* 
Parse.Cloud.define("getUserEmail", async (request: any) => {
  var currentDate=new Date()
  
  const query = new Parse.Query("_User");
  query.equalTo("email",userEmail)

  const user = await query.first({useMasterKey:true});


  if(currentDate<=request.params.event.start&&currentDate<=request.params.event.end&&user){
    let hoursCalculated=await diff_hours(request.params.event.start,request.params.event.end)

    if(user.get("meetingRoomHours")<hoursCalculated){
        
      return false
    } 

    
const query = new Parse.Query("Reserves");

query.equalTo("areaName",user.get("salon"))
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



  
   
  if(user?.get("meetingRoomHours")<=0){
    return false
  } else {

    let hoursCalculated= diff_hours(request.params.event.start,request.params.event.end)
  let restante=user?.get("meetingRoomHours")-hoursCalculated
  
    user?.set("meetingRoomHours",restante)

  
    let uniqueID=parseInt((Date.now()+ Math.random()).toString())
    const Reserves=await Parse.Object.extend("Reserves")

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
   let areaName=user.get("salon")
   if(areaName!==""){
  
    reserve.set("areaName", areaName )     
   } else{
    reserve.set("areaName","meetingRoom")     
   } 
   await reserve.save(null, { useMasterKey: true })
   await user.save(null,{ useMasterKey: true })

   return true

       
  }
}
}); */
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