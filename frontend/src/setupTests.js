import { server } from "./mocks/server";
import { beforeAll, afterEach, afterAll } from '@jest/globals';
import { TextEncoder, TextDecoder} from 'util'

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());