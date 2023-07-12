/* eslint-disable @typescript-eslint/no-explicit-any */
import Parse from 'parse/node';

Parse.Cloud.beforeSave('Trasactions', async (request: any) => {
  if (request.object?.get('to') === '0x0000000000000000000000000000000000000000') {
    const query = new Parse.Query('TokensMintedERC721');

    query.equalTo('address', request.object?.get('address'));
    query.equalTo('tokenId', request.object?.get('tokenId'));
    const object = await query.first({ useMasterKey: true });

    await object?.destroy({ useMasterKey: true });
  }
});

Parse.Cloud.beforeSave('SalesRemoved', async (request: any) => {
  const query = new Parse.Query('SalesCreated');

  query.equalTo('nftContractAddress', request.object?.get('nftContractAddress'));
  query.equalTo('tokenId', request.object?.get('tokenId'));

  const object = await query.first({ useMasterKey: true });

  if (object) {
    await object?.destroy({ useMasterKey: true });
  }
});

Parse.Cloud.beforeSave('BidsMade', async (request: any) => {
  const query = new Parse.Query('SalesCreated');

  query.equalTo('nftContractAddress', request.object?.get('nftContractAddress'));
  query.equalTo('tokenId', request.object?.get('tokenId'));
  const object = await query.first();

  if (object) {
    if (object?.get('buyNowPrice') === request.object?.get('tokenAmount')) {
      const query2 = new Parse.Query('TokensMintedERC721');
      query2.equalTo('tokenAddress', request.object?.get('nftContractAddress'));
      query2.equalTo('tokenId', request.object?.get('tokenId'));
      const object2 = await query2.first();
      if (object2) {
        object2.set('owner', request.object?.get('bidder'));
        await object2.save();
      }

      await object?.destroy({ useMasterKey: true });
    }
  }
});

Parse.Cloud.beforeSave('ItemsSold', async (request: any) => {
  const newOwner = request.object?.get('nftRecipient');
  const tokenId = request.object?.get('tokenId');

  const queryItemsMinted = new Parse.Query('ItemsMinted');
  queryItemsMinted.equalTo('tokenId', tokenId);
  const resultItemsMinted = await queryItemsMinted.first({
    useMasterKey: true,
  });

  const ownerItemsMinted = resultItemsMinted?.attributes.ownerAddress;

  if (ownerItemsMinted !== newOwner) {
    resultItemsMinted?.set('ownerAddress', newOwner);
    await resultItemsMinted?.save();
  }

  const queryToknsMintedERC721 = new Parse.Query('TokensMintedERC721');
  queryToknsMintedERC721.equalTo('tokenId', tokenId);
  const resultToknsERC721 = await queryToknsMintedERC721.first({
    useMasterKey: true,
  });

  const ownerToknsERC721 = resultToknsERC721?.attributes.ownerAddress;

  if (ownerToknsERC721 !== newOwner) {
    resultToknsERC721?.set('ownerAddress', newOwner);
    await resultToknsERC721?.save();
  }
});

Parse.Cloud.define('getTotalSelling', async (request: any) => {
  const { ethAddress } = request.params;
  const query = new Parse.Query('User');
  query.equalTo('ethAddress', ethAddress);
  query.equalTo('totalSelling', true);
  const queryResult = await query.first({ useMasterKey: true });

  let resultTotal;

  const queryValueSell = queryResult?.attributes?.valueSell ? queryResult?.attributes.valueSell : '';

  if (!queryResult) {
    return undefined;
  }

  if (queryValueSell === '') {
    resultTotal = await queryResult?.get('valueSell');
    await resultTotal.save(null, { useMasterKey: true });
  } else {
    resultTotal = await queryResult?.get('valueSell');
    await resultTotal.save(null, { useMasterKey: true });
  }

  return resultTotal;
});

// test clouds
Parse.Cloud.define('getItemsMinted', async (request: any) => {
  const { collectionAddress } = request.params;

  const query = new Parse.Query('ItemsMinted');
  query.equalTo('ownerAddress', collectionAddress);
  const queryResult = await query.first();

  return queryResult;
});

Parse.Cloud.define('getFilterItemsHome', async (request: any) => {
  const { inputValue } = request.params;
  const resultFilter: any = [];

  const query = new Parse.Query('ItemsMinted');
  query.limit(1000000);
  const resultQuery = await query.find();
  const objStr = JSON.stringify(resultQuery);
  const objJson = JSON.parse(objStr);

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('_User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  await Promise.all(
    objJson.map(async (element: any) => {
      if (inputValue.length > 0) {
        if (element.metadataNft.name.search(inputValue) === 0) {
          const { username, userAvatar } = await getUser(element.ownerAddress);
          element.username = username;
          element.userAvatar = userAvatar;
          resultFilter.push(element);
        }
      }
    }),
  );
  
  return resultFilter;
});

Parse.Cloud.define('getActivityNft', async (request: any) => {
  const { itemId } = request.params;

  const query = new Parse.Query('Activity');
  query.descending('createdAt');
  query.equalTo('tokenId', itemId);

  const resultQuery = await query.find({ useMasterKey: true });

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  const response = await Promise.all(
    resultQuery.map(async (value: any) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const ownerAddress = objJson.from_address;

      let newArr = [];

      const { username, userAvatar } = await getUser(ownerAddress);

      newArr = { ...objJson, username, userAvatar };

      return newArr;
    }),
  );

  return response;
});

Parse.Cloud.define('getTopSellers', async () => {
  const newArrayTopseller: any = [];
  const query = new Parse.Query('User');
  query.descending('TotalSoldInToken');
  query.limit(12);
  const resultQuery = await query.find({ useMasterKey: true });

  await Promise.all(
    resultQuery.map(async (value: any) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const userAvatar = objJson?.userAvatar ? objJson.userAvatar : '';
      const username = objJson?.username ? objJson.username : '';
      const ethAddress = objJson?.ethAddress ? objJson.ethAddress : '';
      const TotalSoldInToken = objJson?.TotalSoldInToken ? objJson.TotalSoldInToken : '';

      const newArr = {
        userAvatar,
        username,
        ethAddress,
        TotalSoldInToken,
      };
      newArrayTopseller.push(newArr);
    }),
  );

  return newArrayTopseller;
});
