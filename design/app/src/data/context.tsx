/* Данные для экранов: набор моков выбирается при запуске (переменная сборки VITE_MOCK_SET, без неё — default), экраны
   берут провайдер хуком useData() и не импортируют mocks/ напрямую. Бэкенд готов — вместо createMockProvider здесь встаёт
   реализация поверх API с теми же интерфейсами contracts/provider.ts, и экраны не меняются. */
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { DataProvider } from '../../contracts/provider';
import { DEFAULT_MOCK_SET, MOCK_SETS } from '../../mocks';
import { createMockProvider } from './createMockProvider';
import { knownMockSet } from './mockSet';

const DataContext = createContext<DataProvider | null>(null);

export function DataRoot({ children }: { children: ReactNode }) {
  const name = knownMockSet(import.meta.env.VITE_MOCK_SET) ?? DEFAULT_MOCK_SET;
  const provider = useMemo(() => createMockProvider(MOCK_SETS[name]), [name]);
  return <DataContext.Provider value={provider}>{children}</DataContext.Provider>;
}

export function useData(): DataProvider {
  const provider = useContext(DataContext);
  if (!provider) throw new Error('useData() вне <DataRoot>: приложение оборачивает DataRoot в src/App.tsx');
  return provider;
}
