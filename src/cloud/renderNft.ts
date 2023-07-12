/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable complexity */
import Parse from 'parse/node';

Parse.Cloud.define('getCollectionSelect', async (request: any) => {
  const { userAddress } = request.params;

  const query = new Parse.Query('CollectionsPolygon');
  query.equalTo('owner', userAddress);
  const results = await query.find({ useMasterKey: true });

  const defaultCollection = {
    artist: '0x069dFfD8D5E00952D956aEF824D3E3DcDadeEA63',
    collectionAddress: '0x1C7d04C4DDEE4d13c31E800568039AcEabDCc3C8',
    description: 'Collection',
    fileHash: 'QmRPTQ5sTRB9WBqnEPKSTZUabZJg7pZKQsGidpdj4Cn9Za',
    filePath: 'https://gateway.pinata.cloud/ipfs/QmR3EJqMF5C2vd6grQZJ6YwT9j2SxZWBZGZfKERJmqdiwp',
    name: 'KOOLINART',
    owner: '0x069dFfD8D5E00952D956aEF824D3E3DcDadeEA63',
    symbol: 'KNRTC',
  };

  const newArr = results.map((value, _index) => {
    const objStr = JSON.stringify(value);
    const objJson = JSON.parse(objStr);
    return objJson;
  });

  newArr.push(defaultCollection);

  const reverseObj = newArr.reverse();

  return reverseObj;
});

Parse.Cloud.define('getNftCarouselLive', async () => {
  const query = new Parse.Query('ItemsMinted');
  query.descending('updatedAt');
  query.limit(14);
  const results = await query.find({ useMasterKey: true });

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  const response = await Promise.all(
    results.map(async (value) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const { ownerAddress } = objJson;

      let newArr = [];

      const { username, userAvatar } = await getUser(ownerAddress);

      newArr = { ...objJson, username, userAvatar };

      return newArr;
    }),
  );

  return response;
});

Parse.Cloud.define('getNftCarouselExplore', async () => {
  const query = new Parse.Query('ItemsMinted');
  const results = await query.find({ useMasterKey: true });

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  const response = await Promise.all(
    results.map(async (value) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const { ownerAddress } = objJson;

      let newArr = [];

      const { username, userAvatar } = await getUser(ownerAddress);

      newArr = { ...objJson, username, userAvatar };

      return newArr;
    }),
  );
  const dataNft = JSON.stringify(response);
  const dataObjNft = JSON.parse(dataNft);

  const NewNftRender = dataObjNft
    .map((value: any) => ({ value, sort: Math.random() }))
    .sort((a: any, b: any) => a.sort - b.sort)
    .map(({ value }: any) => value);
  // .slice(0, 5)

  return NewNftRender;
});

Parse.Cloud.define('getNftCarouselCollection', async () => {
  const query = new Parse.Query('CollectionsPolygon');
  const results = await query.find({ useMasterKey: true });

  async function getUser(owner: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', owner);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  const response = await Promise.all(
    results.map(async (value) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const owner = objJson.owner.toLowerCase();

      let newArr = [];

      const { username, userAvatar } = await getUser(owner);

      newArr = { ...objJson, username, userAvatar };

      return newArr;
    }),
  );

  return response.reverse();
});

Parse.Cloud.define('getNftPerfilNft', async (request: any) => {
  const { idConvertType } = request.params;
  const query = new Parse.Query('ItemsMinted');
  query.equalTo('tokenId', idConvertType);
  const results = await query.find({ useMasterKey: true });

  const nftStr = JSON.stringify(results);
  const nftJson = JSON.parse(nftStr);

  const ObjNft = nftJson[0];

  const owner = ObjNft?.ownerAddress ? ObjNft.ownerAddress : '';
  const collectionAddress = ObjNft?.collectionAddress ? ObjNft.collectionAddress : '';

  async function getUser(owner: any) {
    const queryUser = new Parse.Query('User');

    queryUser.equalTo('ethAddress', owner);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  async function getCollection(collectionAddress: any) {
    const queryUser = new Parse.Query('CollectionsPolygon');
    queryUser.equalTo('collectionAddress', collectionAddress);

    const resultCollec = await queryUser.first({ useMasterKey: true });

    const fileHashImgCollec =
      resultCollec?.attributes?.fileHash != null || undefined ? resultCollec?.attributes.fileHash : '';
    const symbolCollec = resultCollec?.attributes?.symbol != null || undefined ? resultCollec?.attributes.symbol : '';
    const descriptionCollec =
      resultCollec?.attributes?.description != null || undefined ? resultCollec?.attributes.description : '';
    const nameCollec = resultCollec?.attributes?.name != null || undefined ? resultCollec?.attributes.name : '';

    return { fileHashImgCollec, symbolCollec, descriptionCollec, nameCollec };
  }

  const { username, userAvatar } = await getUser(owner);

  const { fileHashImgCollec, symbolCollec, descriptionCollec, nameCollec } = await getCollection(collectionAddress);

  const newObjNft = {
    ...ObjNft,
    fileHashImgCollec,
    symbolCollec,
    descriptionCollec,
    nameCollec,
    username,
    userAvatar,
  };

  return newObjNft;
});

Parse.Cloud.define('getTotalNftPageActivity', async (request: any) => {
  const query = new Parse.Query('Activity');
  const { typeTotal } = request.params;
  if (typeTotal === 'All') {
    const count = await query.count();
    return count;
  }
  if (typeTotal === 'purchased') {
    query.equalTo('stateOfHistory', 'purchased');
    const count = await query.count();
    return count;
  }
  if (typeTotal === 'createNft') {
    query.equalTo('stateOfHistory', 'createNft');
    const count = await query.count();
    return count;
  }
  if (typeTotal === 're-sold') {
    query.equalTo('stateOfHistory', 're-sold');
    const count = await query.count();
    return count;
  }
  if (typeTotal === 'auctioned') {
    query.equalTo('stateOfHistory', 'auctioned');
    const count = await query.count();
    return count;
  }
  if (typeTotal === 're-auctioned') {
    query.equalTo('stateOfHistory', 're-auctioned');
    const count = await query.count();
    return count;
  }
  return 'ok';
});

Parse.Cloud.define('getNftPageActivity', async (request: any) => {
  const { skip, typePage } = request.params;
  const query = new Parse.Query('Activity');

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  if (typePage === 'All') {
    query.descending('updatedAt');
    query.skip(skip);
    query.limit(8);
    const results = await query.find({ useMasterKey: true });
    const response = await Promise.all(
      results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;

        let newArr = [];

        const { username, userAvatar } = await getUser(ownerAddress);

        newArr = { ...objJson, username, userAvatar };

        return newArr;
      }),
    );
    return response;
  }
  if (typePage === 'purchased') {
    query.descending('updatedAt');
    query.equalTo('stateOfHistory', 'purchased');
    query.skip(skip);
    query.limit(8);
    const results = await query.find({ useMasterKey: true });
    const response = await Promise.all(
      results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;

        let newArr = [];

        const { username, userAvatar } = await getUser(ownerAddress);

        newArr = { ...objJson, username, userAvatar };

        return newArr;
      }),
    );
    return response;
  }
  if (typePage === 're-sold') {
    query.descending('updatedAt');
    query.equalTo('stateOfHistory', 're-sold');
    query.skip(skip);
    query.limit(8);
    const results = await query.find({ useMasterKey: true });
    const response = await Promise.all(
      results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;

        let newArr = [];

        const { username, userAvatar } = await getUser(ownerAddress);

        newArr = { ...objJson, username, userAvatar };

        return newArr;
      }),
    );
    return response;
  }
  if (typePage === 'createNft') {
    query.descending('updatedAt');
    query.equalTo('stateOfHistory', 'createNft');
    query.skip(skip);
    query.limit(8);
    const results = await query.find({ useMasterKey: true });
    const response = await Promise.all(
      results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;

        let newArr = [];

        const { username, userAvatar } = await getUser(ownerAddress);

        newArr = { ...objJson, username, userAvatar };

        return newArr;
      }),
    );
    return response;
  }
  if (typePage === 'auctioned') {
    query.descending('updatedAt');
    query.equalTo('stateOfHistory', 'auctioned');
    query.skip(skip);
    query.limit(8);
    const results = await query.find({ useMasterKey: true });
    const response = await Promise.all(
      results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;

        let newArr = [];

        const { username, userAvatar } = await getUser(ownerAddress);

        newArr = { ...objJson, username, userAvatar };

        return newArr;
      }),
    );
    return response;
  }
  if (typePage === 're-auctioned') {
    query.descending('updatedAt');
    query.equalTo('stateOfHistory', 're-auctioned');
    query.skip(skip);
    query.limit(8);
    const results = await query.find({ useMasterKey: true });
    const response = await Promise.all(
      results.map(async (value) => {
        const objStr = JSON.stringify(value);
        const objJson = JSON.parse(objStr);
        const { ownerAddress } = objJson;

        let newArr = [];

        const { username, userAvatar } = await getUser(ownerAddress);

        newArr = { ...objJson, username, userAvatar };

        return newArr;
      }),
    );
    return response;
  }

  return 'ok';
});

Parse.Cloud.define('getTotalNftExplore', async (request: any) => {
  const query = new Parse.Query('ItemsMinted');
  const { typeTotal } = request.params;
  if (typeTotal === 'All') {
    const count = await query.count();
    return count;
  }
  if (typeTotal === 'On sale') {
    query.equalTo('forSale', true);
    const count = await query.count();
    return count;
  }
  if (typeTotal === 'No sale') {
    query.equalTo('forSale', false);
    const count = await query.count();
    return count;
  }
  if (typeTotal === 'Bids') {
    query.equalTo('marketType', 'bids');
    query.equalTo('forSale', true);
    const count = await query.count();
    return count;
  }
  return 'ok';
});

Parse.Cloud.define('getNftPageExplore', async (request: any) => {
  const { skip } = request.params;
  const query = new Parse.Query('ItemsMinted');

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }
  query.descending('updatedAt');
  query.skip(skip);
  query.limit(8);
  const results = await query.find({ useMasterKey: true });
  const response = await Promise.all(
    results.map(async (value) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const { ownerAddress } = objJson;

      let newArr = [];

      const { username, userAvatar } = await getUser(ownerAddress);

      newArr = { ...objJson, username, userAvatar };

      return newArr;
    }),
  );
  const dataNft = JSON.stringify(response);

  const dataObjNft = JSON.parse(dataNft);

  const NewNftRender = dataObjNft
    .map((value: any) => ({ value, sort: Math.random() }))
    .sort((a: any, b: any) => a.sort - b.sort)
    .map(({ value }: any) => value);
  return NewNftRender;
});

Parse.Cloud.define('getSearchExploreFilterCoincidence', async (request: any) => {
  const { inputValue } = request.params;
  const resultFilter: any = [];
  const query = new Parse.Query('ItemsMinted');
  query.limit(1000000);
  const resultQuery = await query.find();
  const objStr = JSON.stringify(resultQuery);
  const objJson = JSON.parse(objStr);

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
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

Parse.Cloud.define('getSearchExplore', async (request: any) => {
  const { valueSearch, valueSearchId } = request.params;
  const resultFilter: any = [];
  const query = new Parse.Query('ItemsMinted');
  query.limit(1000000);
  const resultQuery = await query.find();
  const objStr = JSON.stringify(resultQuery);
  const objJson = JSON.parse(objStr);

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }
  await Promise.all(
    objJson.map(async (element: any) => {
      if (valueSearch.length > 0) {
        if (element.metadataNft.name == valueSearch && element.tokenId == valueSearchId) {
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

Parse.Cloud.define('getTotalNftPageArtworks', async () => {
  const query = new Parse.Query('ItemsMinted');
  const count = await query.count();
  return count;
});

Parse.Cloud.define('getNftPageArtworks', async (request: any) => {
  const { skip } = request.params;

  const query = new Parse.Query('ItemsMinted');
  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }
  query.descending('updatedAt');
  query.skip(skip);
  query.limit(8);
  let resultQueryAll = await query.find({ useMasterKey: true });

  const response = await Promise.all(
    resultQueryAll.map(async (value) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const { ownerAddress } = objJson;
      let newArr = [];
      const { username, userAvatar } = await getUser(ownerAddress);
      newArr = { ...objJson, username, userAvatar };
      return newArr;
    }),
  );
  return response;
});

Parse.Cloud.define('getSearchArtworksPage', async (request: any) => {
  const { valueSearch } = request.params;
  let resultFilter: any = [];
  const query = new Parse.Query('ItemsMinted');
  query.equalTo('tokenId', valueSearch);
  query.limit(1000000);
  const resultQuery = await query.find({ useMasterKey: true });
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
      const { username, userAvatar } = await getUser(element.ownerAddress);
      element.username = username;
      element.userAvatar = userAvatar;
      resultFilter.push(element);
    }),
  );

  return resultFilter;
});

Parse.Cloud.define('getCollectionsFilterOptionsArtworks', async (request: any) => {
  const { valueSearch } = request.params;
  const resultFilter: any = [];
  const query = new Parse.Query('CollectionsPolygon');
  query.limit(1000000);
  query.descending('updatedAt');
  const results = await query.find({ useMasterKey: true });
  const objStr = JSON.stringify(results);
  const objJson = JSON.parse(objStr);
  await Promise.all(
    objJson.map(async (element: any) => {
      if (valueSearch.length > 0) {
        if (element.name.search(valueSearch) === 0) {
          resultFilter.push(element);
        }
      }
    }),
  );

  return resultFilter;
});

Parse.Cloud.define('setPageColletionsArtworksFiterlOtionsAutocomplete', async (request) => {
  const { inputValue } = request.params;
  var resultFilter: any = [];
  const query = new Parse.Query('CollectionsPolygon');
  query.limit(1000000);
  query.descending('updatedAt');
  const results = await query.find({ useMasterKey: true });
  let objStr = JSON.stringify(results);
  let objJson = JSON.parse(objStr);
  const response = await Promise.all(
    objJson.map(async (element: any) => {
      if (inputValue.length > 0) {
        if (element.name.search(inputValue) == 0) {
          resultFilter.push(element);
        }
      }
    }),
  );

  return resultFilter;
});

Parse.Cloud.define('setFilterVariousCategoriesArtworks', async (request: any) => {
  const { objFilter, skip } = request.params;

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('_User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  objFilter.minPrice == 0 && objFilter.maxPrice == 0
    ? ((objFilter.minPrice = 'All'), (objFilter.maxPrice = 'All'))
    : null;

  const query = new Parse.Query('ItemsMinted');
  query.descending('updatedAt');

  switch (
    objFilter.status &&
    objFilter.ratio &&
    objFilter.eggs &&
    objFilter.collectionsSearch &&
    objFilter.minPrice &&
    objFilter.maxPrice
  ) {
    case 'All':
      query.skip(skip);
      query.limit(8);
      let resultQuery = await query.find({ useMasterKey: true });
      const response = await Promise.all(
        resultQuery.map(async (value) => {
          const objStr = JSON.stringify(value);
          const objJson = JSON.parse(objStr);
          const { ownerAddress } = objJson;
          let newArr = [];
          const { username, userAvatar } = await getUser(ownerAddress);
          newArr = { ...objJson, username, userAvatar };
          return newArr;
        }),
      );
      return response;
      break;
    default:
      switch (objFilter.collectionsSearch) {
        case 'All':
          break;

        default:
          query.equalTo('collectionAddress', objFilter.collectionsSearch.id);
          query.greaterThan('buyNowPrice', objFilter.minPrice);
          if (objFilter.status == 'Buynow') {
            query.equalTo('forSale', true);
          } else if (objFilter.status == 'Bids') {
            query.equalTo('forSale', true);
            query.equalTo('marketType', 'bids');
          }
          if (objFilter.maxPrice > 0) {
            query.lessThan('buyNowPrice', objFilter.maxPrice);
          }
          if (objFilter.ratio != 'All') {
            query.equalTo('buyNowPrice', objFilter.maxPrice);
          }
          // query.limit(8);
          break;
      }
      break;
  }

  // const resultQuery = await query.find({ useMasterKey: true });
  // const objStr = JSON.stringify(resultQuery);
  // const objJson = JSON.parse(objStr);

  // async function getUser(ownerAddress: any) {
  //   const queryUser = new Parse.Query('_User');
  //   queryUser.equalTo('ethAddress', ownerAddress);

  //   const resultUser = await queryUser.first({ useMasterKey: true });

  //   const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
  //   const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

  //   return { username, userAvatar };
  // }

  // await Promise.all(
  //   objJson.map(async (element: any) => {
  //     const { username, userAvatar } = await getUser(element.ownerAddress);
  //         element.username = username;
  //         element.userAvatar = userAvatar;
  //         resultFilter.push(element);

  //   }),
  // );

  // // return resultFilter;
  // return objFilter.collectionsSearch;
});

Parse.Cloud.define('getTotalNftPageArtists', async () => {
  const query = new Parse.Query('User');
  const count = await query.count({ useMasterKey: true });
  return count;
});

Parse.Cloud.define('getNftPageArtists', async (request: any) => {
  const { skip } = request.params;
  const query = new Parse.Query('User');
  query.descending('createdAt');
  query.skip(skip);
  query.limit(12);
  const results = await query.find({ useMasterKey: true });

  const response = await Promise.all(
    results.map(async (value) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);

      const userBanner = objJson?.userBanner ? objJson.userBanner : '';
      const userAvatar = objJson?.userAvatar ? objJson.userAvatar : '';
      const biography = objJson?.biography ? objJson.biography : '';
      const username = objJson?.username ? objJson.username : '';
      const fullname = objJson?.fullname ? objJson.fullname : '';
      const ethAddress = objJson?.ethAddress ? objJson.ethAddress : '';

      let newArr: any = [];

      newArr = {
        userBanner,
        userAvatar,
        biography,
        username,
        fullname,
        ethAddress,
      };

      return newArr;
    }),
  );

  return response;
});

Parse.Cloud.define('getNftPageArtistsFilter', async (request: any) => {
  const { inputValue } = request.params;
  const resultFilter: any = [];
  const query = new Parse.Query('User');
  query.descending('createdAt');
  query.limit(1000000);
  const results = await query.find({ useMasterKey: true });
  const objStr = JSON.stringify(results);
  const objJson = JSON.parse(objStr);

  await Promise.all(
    objJson.map(async (element: any) => {
      if (inputValue.length > 0) {
        if (element.username.search(inputValue) === 0) {
          const userBanner = element?.userBanner ? element.userBanner : '';
          const userAvatar = element?.userAvatar ? element.userAvatar : '';
          const biography = element?.biography ? element.biography : '';
          const username = element?.username ? element.username : '';
          const fullname = element?.fullname ? element.fullname : '';
          const ethAddress = element?.ethAddress ? element.ethAddress : '';

          const newArr = {
            userBanner,
            userAvatar,
            biography,
            username,
            fullname,
            ethAddress,
          };

          resultFilter.push(newArr);
        }
      }
    }),
  );
  return resultFilter;
});

Parse.Cloud.define('getTotalPageExploreCollections', async () => {
  const query = new Parse.Query('CollectionsPolygon');
  const count = await query.count();
  return count;
});

Parse.Cloud.define('setPageExploreCollections', async (request: any) => {
  const { skip } = request.params;
  const query = new Parse.Query('CollectionsPolygon');
  query.descending('updatedAt');
  query.skip(skip);
  query.limit(12);
  const results = await query.find({ useMasterKey: true });

  async function getUser(owner: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', owner);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  const response = await Promise.all(
    results.map(async (value) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const owner = objJson.owner.toLowerCase();

      let newArr = [];

      const { username, userAvatar } = await getUser(owner);

      newArr = { ...objJson, username, userAvatar };

      return newArr;
    }),
  );

  return response;
});

Parse.Cloud.define('setExploreCollectionsFilterOptionsAutocomplete', async (request: any) => {
  const { inputValue } = request.params;
  const resultFilter: any = [];
  const query = new Parse.Query('CollectionsPolygon');
  query.limit(1000000);
  query.descending('updatedAt');
  const results = await query.find({ useMasterKey: true });
  const objStr = JSON.stringify(results);
  const objJson = JSON.parse(objStr);
  await Promise.all(
    objJson.map(async (element: any) => {
      if (inputValue.length > 0) {
        if (element.name.search(inputValue) === 0) {
          resultFilter.push(element);
        }
      }
    }),
  );

  return resultFilter;
});

Parse.Cloud.define('setExploreCollectionsSearch', async (request: any) => {
  const { collectionName, collectionAddress } = request.params;
  const resultFilter: any = [];
  const query = new Parse.Query('CollectionsPolygon');
  query.limit(1000000);
  query.descending('updatedAt');
  const results = await query.find({ useMasterKey: true });
  const objStr = JSON.stringify(results);
  const objJson = JSON.parse(objStr);
  await Promise.all(
    objJson.map(async (element: any) => {
      if (collectionName.length > 0) {
        if (element.name === collectionName && element.collectionAddress == collectionAddress) {
          resultFilter.push(element);
        }
      }
    }),
  );

  return resultFilter;
});

Parse.Cloud.define('getTotalExploreUser', async () => {
  const query = new Parse.Query('User');
  const count = await query.count({ useMasterKey: true });
  return count;
});

Parse.Cloud.define('setPageExploreUser', async (request: any) => {
  const { skip } = request.params;
  const query = new Parse.Query('User');
  query.descending('createdAt');
  query.skip(skip);
  query.limit(12);
  const results = await query.find({ useMasterKey: true });

  const response = await Promise.all(
    results.map(async (value) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);

      const userBanner = objJson?.userBanner ? objJson.userBanner : '';
      const userAvatar = objJson?.userAvatar ? objJson.userAvatar : '';
      const biography = objJson?.biography ? objJson.biography : '';
      const username = objJson?.username ? objJson.username : '';
      const fullname = objJson?.fullname ? objJson.fullname : '';
      const ethAddress = objJson?.ethAddress ? objJson.ethAddress : '';

      let newArr: any = [];

      newArr = {
        userBanner,
        userAvatar,
        biography,
        username,
        fullname,
        ethAddress,
      };

      return newArr;
    }),
  );

  return response;
});

Parse.Cloud.define('setExploreUserFilterOptionsAutocomplete', async (request: any) => {
  const { inputValue } = request.params;
  const resultFilter: any = [];
  const query = new Parse.Query('_User');
  query.limit(1000000);
  query.descending('updatedAt');
  const results = await query.find({ useMasterKey: true });
  const objStr = JSON.stringify(results);
  const objJson = JSON.parse(objStr);
  await Promise.all(
    objJson.map(async (element: any) => {
      if (inputValue.length > 0) {
        if (element.username.search(inputValue) === 0) {
          resultFilter.push(element);
        }
      }
    }),
  );

  return resultFilter;
});

Parse.Cloud.define('setExploreUserSearch', async (request: any) => {
  const { username, ethAddress } = request.params;
  const resultFilter: any = [];
  const query = new Parse.Query('_User');
  query.limit(1000000);
  query.descending('updatedAt');
  const results = await query.find({ useMasterKey: true });
  const objStr = JSON.stringify(results);
  const objJson = JSON.parse(objStr);
  await Promise.all(
    objJson.map(async (element: any) => {
      if (username.length > 0) {
        if (element.username === username && element.ethAddress == ethAddress) {
          resultFilter.push(element);
        }
      }
    }),
  );

  return resultFilter;
});

Parse.Cloud.define('getTotaPageCollections', async () => {
  const query = new Parse.Query('CollectionsPolygon');
  const count = await query.count();
  return count;
});

Parse.Cloud.define('setPageCollections', async (request: any) => {
  const { skip } = request.params;
  const query = new Parse.Query('CollectionsPolygon');
  query.descending('createdAt');
  query.skip(skip);
  query.limit(6);
  const results = await query.find({ useMasterKey: true });

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  const response = await Promise.all(
    results.map(async (value: any) => {
      const collecStr = JSON.stringify(value);
      const collecJson = JSON.parse(collecStr);

      const fileHash = collecJson.fileHash ? collecJson.fileHash : '';
      const name = collecJson.name ? collecJson.name : '';
      const owner = collecJson.owner ? collecJson.owner : '';
      const symbol = collecJson.symbol ? collecJson.symbol : '';
      const collectionAddress = collecJson.collectionAddress ? collecJson.collectionAddress : '';
      const description = collecJson.description ? collecJson.description : '';

      const newQuery = new Parse.Query('ItemsMinted');
      newQuery.equalTo('collectionAddress', collectionAddress);
      newQuery.descending('updatedAt');
      const results = await newQuery.find({ useMasterKey: true });

      const nftcollecStr = JSON.stringify(results);
      const nftCollecJson = JSON.parse(nftcollecStr);
      const { username, userAvatar } = await getUser(owner);

      //   let floorPriceMath = nftCollecJson.reduce(function(prev:any, curr:any) {
      //     if (curr.buyNowPrice > 0 && curr.buyNowPrice < prev.buyNowPrice) {
      //         return curr;
      //     } else {
      //         return prev;
      //     }
      // },Infinity);
      // let floorPrice = floorPriceMath.buyNowPrice
      let floorPriceMath = [];
      if (nftCollecJson.length > 0) {
        floorPriceMath = nftCollecJson.reduce(function (prev: any, curr: any) {
          if (curr.buyNowPrice > 0 && curr.buyNowPrice < prev.buyNowPrice) {
            return curr;
          } else {
            return prev;
          }
        });
      }
      let floorPrice = floorPriceMath?.buyNowPrice ? floorPriceMath?.buyNowPrice : floorPriceMath;

      const collect = nftCollecJson.length
        ? {
            colletions: { fileHash, name, owner, collectionAddress, symbol, description, username, userAvatar },
            Nft: {
              nftCollecJson,
              username,
              userAvatar,
              floorPrice,
            },
          }
        : {
            colletions: { fileHash, name, owner, collectionAddress, symbol, description, username, userAvatar },
          };
      return collect;
    }),
  );

  return response;
});

Parse.Cloud.define('PageCollectionsSearch', async (request: any) => {
  const { valueSearch } = request.params;
  const query = new Parse.Query('CollectionsPolygon');
  query.equalTo('collectionAddress', valueSearch);
  const results = await query.find({ useMasterKey: true });

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  const response = await Promise.all(
    results.map(async (value: any) => {
      const collecStr = JSON.stringify(value);
      const collecJson = JSON.parse(collecStr);

      const fileHash = collecJson.fileHash ? collecJson.fileHash : '';
      const name = collecJson.name ? collecJson.name : '';
      const owner = collecJson.owner ? collecJson.owner : '';
      const symbol = collecJson.symbol ? collecJson.symbol : '';
      const collectionAddress = collecJson.collectionAddress ? collecJson.collectionAddress : '';
      const description = collecJson.description ? collecJson.description : '';

      const newQuery = new Parse.Query('ItemsMinted');
      newQuery.equalTo('collectionAddress', collectionAddress);
      newQuery.descending('updatedAt');
      const results = await newQuery.find({ useMasterKey: true });

      const nftcollecStr = JSON.stringify(results);
      const nftCollecJson = JSON.parse(nftcollecStr);
      const { username, userAvatar } = await getUser(owner);
      let floorPriceMath = [];
      if (nftCollecJson.length > 0) {
        floorPriceMath = nftCollecJson.reduce(function (prev: any, curr: any) {
          if (curr.buyNowPrice > 0 && curr.buyNowPrice < prev.buyNowPrice) {
            return curr;
          } else {
            return prev;
          }
        });
      }
      let floorPrice = floorPriceMath?.buyNowPrice ? floorPriceMath?.buyNowPrice : floorPriceMath;

      const collect = nftCollecJson.length
        ? {
            colletions: { fileHash, name, owner, collectionAddress, symbol, description, username, userAvatar },
            Nft: {
              nftCollecJson,
              username,
              userAvatar,
              floorPrice,
            },
          }
        : {
            colletions: { fileHash, name, owner, collectionAddress, symbol, description, username, userAvatar },
          };
      return collect;
    }),
  );

  return response;
});

Parse.Cloud.define('setPageColletionsFiterlOtionsAutocomplete', async (request) => {
  const { inputValue } = request.params;
  var resultFilter: any = [];
  const query = new Parse.Query('CollectionsPolygon');
  query.limit(1000000);
  query.descending('updatedAt');
  const results = await query.find({ useMasterKey: true });
  let objStr = JSON.stringify(results);
  let objJson = JSON.parse(objStr);
  const response = await Promise.all(
    objJson.map(async (element: any) => {
      if (inputValue.length > 0) {
        if (element.name.search(inputValue) == 0) {
          resultFilter.push(element);
        }
      }
    }),
  );

  return resultFilter;
});

Parse.Cloud.define('getArtistPerfilArtist', async (request: any) => {
  const { ethAddress } = request.params;
  const query = new Parse.Query('User');
  query.equalTo('ethAddress', ethAddress);
  query.descending('updatedAt');
  const results = await query.first({ useMasterKey: true });

  const userStr = JSON.stringify(results);
  const userJson = JSON.parse(userStr);

  const userBanner = userJson?.userBanner ? userJson.userBanner : '';
  const userAvatar = userJson?.userAvatar ? userJson.userAvatar : '';
  const biography = userJson?.biography ? userJson.biography : '';
  const username = userJson?.username ? userJson.username : '';
  const fullname = userJson?.fullname ? userJson.fullname : '';

  let user = {};

  user = { userBanner, userAvatar, biography, username, fullname, ethAddress };

  return user;
});

Parse.Cloud.define('getNftPerfilArtistOwned', async (request: any) => {
  const { ethAddress } = request.params;
  const query = new Parse.Query('ItemsMinted');
  query.equalTo('ownerAddress', ethAddress);
  query.descending('updatedAt');
  const results = await query.find({ useMasterKey: true });

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  const response = await Promise.all(
    results.map(async (value) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const { ownerAddress } = objJson;

      let newArr = [];

      const { username, userAvatar } = await getUser(ownerAddress);

      newArr = { ...objJson, username, userAvatar };

      return newArr;
    }),
  );
  const dataNft = JSON.stringify(response);
  const dataObjNft = JSON.parse(dataNft);

  return dataObjNft;
});

Parse.Cloud.define('getNftPerfilArtistOnSale', async (request: any) => {
  const { ethAddress } = request.params;
  const query = new Parse.Query('ItemsMinted');
  query.equalTo('ownerAddress', ethAddress);
  query.equalTo('forSale', true);
  query.descending('updatedAt');
  const results = await query.find({ useMasterKey: true });

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  const response = await Promise.all(
    results.map(async (value) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const { ownerAddress } = objJson;

      let newArr = [];

      const { username, userAvatar } = await getUser(ownerAddress);

      newArr = { ...objJson, username, userAvatar };

      return newArr;
    }),
  );
  const dataNft = JSON.stringify(response);
  const dataObjNft = JSON.parse(dataNft);

  return dataObjNft;
});

Parse.Cloud.define('getNftPerfilArtistCollection', async (request: any) => {
  const { ethAddress } = request.params;
  const query = new Parse.Query('CollectionsPolygon');
  query.equalTo('owner', ethAddress);
  query.descending('updatedAt');
  const results = await query.find({ useMasterKey: true });

  async function getUser(ethAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ethAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  const response = await Promise.all(
    results.map(async (value) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);

      let newArr = [];

      const { username, userAvatar } = await getUser(ethAddress);

      newArr = { ...objJson, username, userAvatar };

      return newArr;
    }),
  );

  return response;
});

Parse.Cloud.define('getCollectionPerfilCollection', async (request: any) => {
  const { collectionAddress } = request.params;
  const query = new Parse.Query('CollectionsPolygon');
  query.equalTo('collectionAddress', collectionAddress);
  const results = await query.first({ useMasterKey: true });

  const collecStr = JSON.stringify(results);
  const collecJson = JSON.parse(collecStr);

  const fileHash = collecJson.fileHash ? collecJson.fileHash : '';
  const name = collecJson.name ? collecJson.name : '';
  const owner = collecJson.owner ? collecJson.owner : '';
  const symbol = collecJson.symbol ? collecJson.symbol : '';
  const description = collecJson.description ? collecJson.description : '';

  async function getUser(owner: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', owner);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes?.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes?.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  const { username, userAvatar } = await getUser(owner);

  const collect = {
    fileHash,
    name,
    owner,
    collectionAddress,
    symbol,
    description,
    username,
    userAvatar,
  };

  return collect;
});

Parse.Cloud.define('getNftPerfilCollectionOwned', async (request: any) => {
  const { collectionAddress } = request.params;
  const query = new Parse.Query('ItemsMinted');
  query.equalTo('collectionAddress', collectionAddress);
  query.descending('updatedAt');
  const results = await query.find({ useMasterKey: true });

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';
    return { username, userAvatar };
  }

  const response = await Promise.all(
    results.map(async (value) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const { ownerAddress } = objJson;

      let newArr = [];

      const { username, userAvatar } = await getUser(ownerAddress);

      newArr = { ...objJson, username, userAvatar };

      return newArr;
    }),
  );
  const dataNft = JSON.stringify(response);
  const dataObjNft = JSON.parse(dataNft);

  return dataObjNft;
});

Parse.Cloud.define('getNftPerfilCollectionOnSale', async (request: any) => {
  const { collectionAddress } = request.params;
  const query = new Parse.Query('ItemsMinted');
  query.equalTo('collectionAddress', collectionAddress);
  query.descending('updatedAt');
  const results = await query.find({ useMasterKey: true });

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  const response = await Promise.all(
    results.map(async (value) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const { ownerAddress } = objJson;

      let newArr = [];

      const { username, userAvatar } = await getUser(ownerAddress);

      newArr = { ...objJson, username, userAvatar };

      return newArr;
    }),
  );

  const dataNft = JSON.stringify(response);
  const dataObjNft = JSON.parse(dataNft);

  return dataObjNft;
});

Parse.Cloud.define('getCountForTopSellers', async (request: any) => {
  const { collectionAddress } = request.params;
  const query = new Parse.Query('ItemsMinted');
  query.equalTo('collectionAddress', collectionAddress);
  query.descending('updatedAt');
  const results = await query.find({ useMasterKey: true });

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  const response = await Promise.all(
    results.map(async (value) => {
      const objStr = JSON.stringify(value);
      const objJson = JSON.parse(objStr);
      const { ownerAddress } = objJson;

      let newArr = [];

      const { username, userAvatar } = await getUser(ownerAddress);

      newArr = { ...objJson, username, userAvatar };

      return newArr;
    }),
  );

  const dataNft = JSON.stringify(response);
  const dataObjNft = JSON.parse(dataNft);

  return dataObjNft;
});

Parse.Cloud.define('getCountTopSeller', async (request: any) => {
  const { tokenId } = request.params;
  const query = new Parse.Query('ItemsMinted');
  query.equalTo('tokenId', tokenId);
  const obj = await query.first({ useMasterKey: true });

  const countSell = obj?.get('countSell') ? obj?.get('countSell') : 0;

  return countSell;
});

Parse.Cloud.define('setTotalSoldInToken', async (request: any) => {
  const { ownerAddress, price } = request.params;

  const verifyQuery = new Parse.Query('User');
  verifyQuery.equalTo('ethAddress', ownerAddress);
  const obj = await verifyQuery.first({ useMasterKey: true });

  const TotalSoldInToken =
    obj?.attributes.TotalSoldInToken != null || undefined ? parseInt(obj?.attributes.TotalSoldInToken) : 0;

  if (TotalSoldInToken !== 0) {
    const amountTotal = price + TotalSoldInToken;

    obj?.set('TotalSoldInToken', amountTotal);
    await obj?.save(null, { useMasterKey: true });

    return 'add TotalSoldInToken successfully';
  }
  obj?.set('TotalSoldInToken', price);
  await obj?.save(null, { useMasterKey: true });

  return 'add new TotalSoldInToken successfully';
});

Parse.Cloud.define('setColletionFilePath', async (request: any) => {
  const { nameColletion } = request.params;
  let nameFilePath = '';
  const query = new Parse.Query('CollectionsPolygon');
  query.equalTo('collectionAddress', nameColletion);

  const results = await query.first({ useMasterKey: true });

  const objStr = JSON.stringify(results);
  const objJson = JSON.parse(objStr);
  nameFilePath = objJson.filePath;
  return nameFilePath;
});

Parse.Cloud.define('TestCloud', async () => {
  const query = new Parse.Query('ItemsMinted');
  query.greaterThan('minimumBid', 0); // busca nfts donde los bids sean mayores a 0

  const results = await query.find({ useMasterKey: true });
  const objStr = JSON.stringify(results);
  const objJson = JSON.parse(objStr);

  async function getUser(ownerAddress: any) {
    const queryUser = new Parse.Query('User');
    queryUser.equalTo('ethAddress', ownerAddress);

    const resultUser = await queryUser.first({ useMasterKey: true });

    const username = resultUser?.attributes.username != null || undefined ? resultUser?.attributes.username : '';
    const userAvatar = resultUser?.attributes.userAvatar != null || undefined ? resultUser?.attributes.userAvatar : '';

    return { username, userAvatar };
  }

  return objJson;
});
