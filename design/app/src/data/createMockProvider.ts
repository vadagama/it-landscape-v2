/* Провайдер контрактов поверх фикстур набора. Сужение JSON до типов — здесь, с ошибкой
   на битой фикстуре: экран не должен получать «почти» данные. */
import type { Example } from '../../contracts/entities';
import type { MockSetRaw } from '../../contracts/mock-set';
import type { DataProvider } from '../../contracts/provider';

function asExamples(raw: unknown): Example[] {
  if (!Array.isArray(raw)) throw new Error('фикстура example: ожидался массив');
  return raw.map((r, i) => {
    if (typeof r !== 'object' || r === null || typeof (r as Example).id !== 'string') throw new Error(`фикстура example[${i}]: нет id`);
    return r as Example;
  });
}

export function createMockProvider(set: MockSetRaw): DataProvider {
  const examples = asExamples(set.example);
  return {
    example: {
      async listExamples() { return examples; },
      async createExample(title) {
        const item: Example = { id: `ex-${examples.length + 1}`, title, createdAt: new Date().toISOString() };
        examples.push(item);
        return item;
      },
    },
  };
}
