/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable complexity */
import  Parse  from 'parse/node';

/*      
template id verify: d-14b1c0d89ea648dd8335d500fc189471
template id welcome: d-330654bf7bc649858b95f2c844979675
template id reset account: d-1f96ec531f544a12b52038da41b25a5e
*/ 

Parse.Cloud.define('sendVerificationEmail', async (request) => {

  try {
    
    const { currentUser } = request.params;
    const User = await Parse.Object.extend('_User'); 
    const query = await new Parse.Query(User);
    await query.equalTo('email', currentUser);

    const userObject = await query.first({ useMasterKey: true });
    
    if (userObject && !userObject.get('emailVerified')) {
      await Parse.User.requestEmailVerification( currentUser); 
      return { success: true };
    }
      throw new Parse.Error(Parse.Error.INVALID_EMAIL_ADDRESS, 'Correo invalido o ya tienes una cuenta con ese correo.');
  } catch (error) { 
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Fallo el envio de verificacion.');
  }
});

Parse.Cloud.define('requestPasswordReset', async (request) => {
  try {
    const { currentUser } = request.params;
      


      await Parse.User.requestPasswordReset(currentUser); 
    return { success: true };
  
  } catch (error) { 
    throw new Parse.Error(Parse.Error.INTERNAL_SERVER_ERROR, 'Fallo el envio del reinicio de contraseña.');
  }
});
