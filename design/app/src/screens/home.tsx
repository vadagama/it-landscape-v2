/* Экран «Главная» (home). Правка — .canvas/workflows/canvas-screen.md; самопроверка — python3 .canvas/board.py screen home */
import { Card, Skeleton, Typography } from '@heroui/react';
import { useEffect, useState } from 'react';
import type { Example } from '../../contracts/entities';
import { useData } from '../data/context';
import { formatDate } from '../i18n';
import type { Env } from '../screens';
import { Shell } from './shared';

/* Заготовка первого экрана: пояснение и записи из моков — путь данных от контракта (contracts/) до экрана. Настоящий
   экран собирается по брифу из design/specs/01-screens.md; пока данные грузятся — скелетоны той же высоты, что строки. */
export function Home({ env }: { env: Env }) {
  const { t } = env;
  const data = useData();
  const [examples, setExamples] = useState<Example[] | null>(null);
  useEffect(() => {
    let alive = true;
    data.example.listExamples().then((list) => { if (alive) setExamples(list); });
    return () => { alive = false; };
  }, [data]);
  return (
    <Shell env={env} title={t('Главная')}>
      <Typography>{t('Это стартовый экран макета. Опишите агенту, каким он должен быть: экран соберётся на ките, а данные придут из моков.')}</Typography>
      <Card>
        <Card.Header>
          <Card.Title>{t('Записи из моков')}</Card.Title>
          <Card.Description>{t('Набор default — файл mocks/default/example.json')}</Card.Description>
        </Card.Header>
        <Card.Content>
          {/* загрузку диктор слышит словами, а строки-скелетоны пропускает (UX, v1.0.0; образец — patterns.md) */}
          {examples === null && <span role="status" className="sr-only">{t('Загружаем записи')}</span>}
          <ul aria-busy={examples === null} className="flex flex-col divide-y divide-border">
            {examples === null
              ? [0, 1].map((i) => (
                <li key={i} aria-hidden className="flex flex-col gap-0.5 py-3">
                  <div className="flex h-6 items-center"><Skeleton className="h-3.5 w-2/3 rounded-lg" /></div>
                  <div className="flex h-5 items-center"><Skeleton className="h-3 w-1/3 rounded-lg" /></div>
                </li>
              ))
              : examples.map((item) => (
                <li key={item.id} className="flex flex-col gap-0.5 py-3">
                  <Typography type="body-sm" weight="medium">{item.title}</Typography>
                  <Typography type="body-xs" color="muted">{formatDate(item.createdAt, env.locale)}</Typography>
                </li>
              ))}
          </ul>
        </Card.Content>
      </Card>
    </Shell>
  );
}
