import { createServerAction } from "zsa"
import { expect } from "@jest/globals"

const publicAction = createServerAction()

const helloWorldAction = publicAction.handler(async () => {
  return "hello world" as const
})

describe("helloWorldAction", () => {
  it('returns "hello world"', async () => {
    const [data, err] = await helloWorldAction()
    // const [data, err] = ["hello world", null]
    const testType: typeof data = "hello world"
    expect(data).toEqual("hello world")
    expect(testType).toEqual("hello world")
    expect(err).toBeNull()
  })
})
