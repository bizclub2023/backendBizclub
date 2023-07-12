/* eslint-disable etc/no-commented-out-code */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable complexity */
//@ts-nocheck
import  Parse  from 'parse/node';
import config from "../config";

const adminsAddress = [
  config.ADMIN_ADDRES1,
  config.ADMIN_ADDRES2,
  config.ADMIN_ADDRES3,
  config.ADMIN_ADDRES4,
  config.ADMIN_ADDRES5,
  config.ADMIN_ADDRES6
];

Parse.Cloud.define('getUserByCollection', async (request: any) => {

  try{
  const { owner }  = request.params

  const query = new Parse.Query('User')
  query.equalTo('ethAddress', owner); 
  const results = await query.first({ useMasterKey: true });   
  
  const userAvatar = (results?.attributes.userAvatar != null || undefined) ? results?.attributes.userAvatar : ''
  const userBanner = (results?.attributes.userBanner != null || undefined) ? results?.attributes.userBanner : ''
  const username = (results?.attributes.username != null || undefined) ? results?.attributes.username : '';
  const ethAddress = (results?.attributes.ethAddress != null || undefined) ? results?.attributes.ethAddress : ''

    const user = {
      "info": 'entro en getUserByCollection',
      "userAvatar": userAvatar,
      "userBanner": userBanner, 
      "username": username, 
      "ethAddress": ethAddress,
    };
    
  return user
      
  }catch(e){
    return e
  }

});

Parse.Cloud.define("getCollectionsAdmin", async (request: any) => {
  const { user } = request;
  if (user) {

    const userAddress = user.get("ethAddress"); 
    if (adminsAddress.some((element: any) => element.toLowerCase() === userAddress.toLowerCase())) {

      const CollectionAdmins = new Parse.Query('CollectionsAdmins');
      CollectionAdmins.descending("createdAt");
      const results = await CollectionAdmins.find();

      const objStr = JSON.stringify(results);
      const objJson = JSON.parse(objStr);

      // CollectionAdmins.select(['fileHash', 'name', 'owner', 'collectionAddress', 'symbol', 'description']);
      return objJson
      
    }
  }
  return [];
});

Parse.Cloud.define('getCollectionFunc', async () => {

  const query = new Parse.Query('CollectionsPolygon')
  const results = await query.find();

  return results;

});

Parse.Cloud.beforeSave("TokensMintedERC721", async (request: any) => {
  const query = new Parse.Query("PolygonNFTTransfers"); 

  query.equalTo("token_address", request.object?.get('address'));
  query.equalTo("token_id", request.object?.get('tokenIdMinted'));
  const object = await query.first();

  if (object){
    const userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo("accounts", request.object?.get('mintedTo'));
    const userObject = await userQuery.first({useMasterKey:true});
    if (userObject){
        request.object?.set('user', userObject);
      
    }
    request.object?.set('buyer', "");
    request.object?.set('contractType', "ERC721");
    request.object?.set('royalties', "0");
    request.object?.set('ownerAddress', request.object?.get('mintedTo'));
    request.object?.set('tokenId', request.object?.get('tokenIdMinted'));
    request.object?.set('tokenAddress', request.object?.get('address'));
  
  }
});

Parse.Cloud.afterSave("PolygonNFTTransfers", async (request: any) => {

  const tokenIdTransfer = request.object?.get("token_id");
  const toAddress = request.object?.get("to_address");

  const query = new Parse.Query("ItemsMinted"); 
  query.equalTo( "tokenId", parseInt(tokenIdTransfer) );
  const object = await query.first({ useMasterKey: true });


  const ownerAddress = object?.get('ownerAddress')
  
  if (  ownerAddress !== toAddress ){


    object?.set('forSale', false);
    object?.set('minimumBid', 0 );
    object?.set('buyNowPrice', 0 );
    object?.set('ownerAddress', toAddress );
    await object?.save(null, {useMasterKey: true});

  }


});