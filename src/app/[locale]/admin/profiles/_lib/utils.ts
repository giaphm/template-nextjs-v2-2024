import { faker } from "@faker-js/faker"
import { NewProfile } from "~/lib/db/schema"

export function generateRandomProfile(userId?: number): NewProfile {
  return {
    userId: userId ?? faker.number.int({ max: 10000 }),
    displayName: faker.internet.displayName(),
    imageId: "",
    image: "",
    bio: faker.person.bio(),
    createdOn: new Date(),
    updatedOn: new Date(),
  }
}
