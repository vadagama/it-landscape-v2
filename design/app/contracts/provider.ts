/* Провайдер контрактов: то, что экраны получают из контекста (src/data/context). Пока бэкенда нет —
   createMockProvider (src/data), потом — реализация поверх API с теми же интерфейсами. */
import type { Example } from './entities';

export interface ExampleQuery {
  listExamples(): Promise<Example[]>;
}

export interface ExampleActions {
  createExample(title: string): Promise<Example>;
}

export interface DataProvider {
  example: ExampleQuery & ExampleActions;
}
