import Account from '../model/account.js'
import { faker } from '@faker-js/faker'

const accountSeed = async (id, numOfAccounts = 1) => {
  let accounts = []; 
  for (let i = 0; i < numOfAccounts; i++) {
    const name = faker.lorem.words({ min: 3, max: 5 }); 
    const accountDetails = faker.lorem.sentence();
    const initial_value = faker.number.int({ min: 1000, max: 100000 });
    const userId = id;

    // Create a new account
    const newAccount = new Account({
      name,
      accountDetails,
      initial_value,
      userId,
    });

    await newAccount.save();
    accounts.push(newAccount._doc._id);
  
  }

  console.log('Accounts created successfully!');
  return accounts;
};

export default accountSeed
