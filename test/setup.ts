import * as dotenv from 'dotenv';
import { beforeEach, afterAll, jest } from '@jest/globals';

dotenv.config({ path: 'env/.env.test' });

jest.setTimeout(30000);

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
});
