import { beforeEach, afterAll, jest } from "@jest/globals"

jest.setTimeout(30000)

beforeEach(() => {
  jest.clearAllMocks()
})

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
})
