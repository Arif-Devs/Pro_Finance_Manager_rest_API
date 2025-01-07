import { faker } from '@faker-js/faker'
import Income from '../model/income.js'

const incomeSeed = async (user, categories, items) => {
  const incomeNote = faker.lorem.sentence()
  const incomeAmount = faker.number.int({ min: 1000, max: 10000 })
  const incomeUserId = user._doc._id
  const incomeCategoryId = categories[faker.number.int({ min: 1, max: 5 })]
  const incomeAccountId = items

  const income = new Income({
    incomeNote,
    incomeAmount,
    incomeUserId,
    incomeCategoryId,
    incomeAccountId,
  })

  await income.save()
}

export default incomeSeed
