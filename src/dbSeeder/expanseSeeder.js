import { faker } from '@faker-js/faker'
import Expanse from '../model/expanse.js'

//expanse seed
const expanseSeed =async (user, categories, items) => {
  const note = faker.lorem.sentence()
  const amount = faker.number.int({ min: 1000, max: 10000 })
  const userId = user._doc._id
  const categoryId = categories[faker.number.int({ min: 1, max: 5 })]
  const accountId = items

  const expanse = new Expanse({
    note,
    amount,
    userId,
    categoryId,
    accountId,

  })
  await expanse.save()
}

export default expanseSeed