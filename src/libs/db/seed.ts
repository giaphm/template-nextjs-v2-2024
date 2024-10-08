/* eslint-disable no-console */
import { faker } from '@faker-js/faker'
import { userTable } from './schema'
import { queryClient, db } from './database'

const main = async () => {
  const data: (typeof userTable.$inferInsert)[] = []

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 20; i++) {
    data.push({
      name: faker.person.fullName(),
    })
  }

  console.log('Seed start')
  await db.insert(userTable).values(data)
  console.log('Seed done')
  await queryClient.end()
}

main()
