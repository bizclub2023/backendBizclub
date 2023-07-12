/* eslint-disable @typescript-eslint/no-explicit-any */
import  Parse  from 'parse/node';

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