import { beforeEach, afterAll, jest } from "@jest/globals"

// Configurar timeout global
jest.setTimeout(30000)

// Limpar mocks antes de cada teste
beforeEach(() => {
  jest.clearAllMocks()
})

// Cleanup após todos os testes
afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
})
