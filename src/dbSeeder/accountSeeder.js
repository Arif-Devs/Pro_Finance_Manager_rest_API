import Account from '../model/account.js'
import { faker } from '@faker-js/faker'

const accountSeed = async (id, numOfAccounts = 1) => {
  console.log('account are being created....')
  let account = []
  for (let i = 0; i < numOfAccounts; i++) {
    const name = faker.lorem({ min: 3, max: 5 })
    const accountDetails = faker.lorem.sentence()
    const initial_value = faker.number.int({ min: 1000, max: 100000 })
    const userId = id

    const account = new Account({
      name,
      accountDetails,
      initial_value,
      userId,
    })

    account.push(account._doc._id)
    await account.save()
  }
  console.log('account created successful!')
  return account
}

export default accountSeed
