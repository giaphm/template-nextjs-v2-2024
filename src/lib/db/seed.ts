/* eslint-disable no-console */
import { faker } from '@faker-js/faker'
import { accounts, groups, profiles, users } from './schema'
import { queryClient, db } from './database'
import { hashPassword } from '../auth/hashing'

const main = async () => {
  const newUsers: (typeof users.$inferInsert)[] = []
  const newAccounts: (typeof accounts.$inferInsert)[] = []
  const newProfiles: (typeof profiles.$inferInsert)[] = []
  const newGroups: (typeof groups.$inferInsert)[] = []

  const password = faker.internet.password()
  const hashedPassword = await hashPassword(password, 'seed-salt')

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 20; i++) {
    newUsers.push({
      email: faker.internet.email(),
      emailVerified: new Date(),
    })

    newAccounts.push({
      userId: 100 + i,
      accountType: 'email',
      githubId: faker.string.alphanumeric(10),
      googleId: faker.string.alphanumeric(10),
      password: hashedPassword,
      salt: hashedPassword,
    })

    newProfiles.push({
      userId: 100 + i,
      displayName: faker.internet.displayName(),
    })

    newGroups.push({
      userId: 100 + i,
      name: faker.company.name(),
      description: 'description...',
    })
  }

  console.log('Seed start')
  await db.insert(users).values(newUsers)
  await db.insert(accounts).values(newAccounts)
  await db.insert(profiles).values(newProfiles)
  console.log('Seed done')
  await queryClient.end()
}

main()
