/* Активный набор моков: сохранённый выбор → переменная сборки → набор по умолчанию.
   Хранилище (localStorage, AsyncStorage) подключается в проекте: здесь — контракт и хранилище в памяти. */
import { DEFAULT_MOCK_SET, MOCK_SETS } from '../../mocks';
import type { MockSetName } from '../../contracts/mock-set';

export interface MockSetStore {
  get(): Promise<MockSetName | null>;
  set(name: MockSetName): Promise<void>;
}

const memory: { value: MockSetName | null } = { value: null };
export const memoryStore: MockSetStore = {
  async get() { return memory.value; },
  async set(name) { memory.value = name; },
};

export function knownMockSet(name: string | null | undefined): MockSetName | null {
  return name && name in MOCK_SETS ? name : null;
}

export async function resolveMockSet(store: MockSetStore = memoryStore, fromBuild?: string): Promise<MockSetName> {
  return knownMockSet(await store.get()) ?? knownMockSet(fromBuild) ?? DEFAULT_MOCK_SET;
}

export async function selectMockSet(name: string, store: MockSetStore = memoryStore): Promise<MockSetName> {
  const known = knownMockSet(name);
  if (!known) throw new Error(`неизвестный набор моков: ${name}`);
  await store.set(known);
  return known;
}
