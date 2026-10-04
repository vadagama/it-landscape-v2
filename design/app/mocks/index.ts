/* Реестр наборов моков. Статические import: сборщик должен видеть файлы заранее. Новый набор — каталог рядом
   (mocks/<набор>/<сущность>.json) и строка здесь. */
import type { MockSetName, MockSetRaw } from '../contracts/mock-set';
import defaultExample from './default/example.json';

export const MOCK_SETS: Record<MockSetName, MockSetRaw> = {
  default: { example: defaultExample },
};

export const DEFAULT_MOCK_SET: MockSetName = 'default';
