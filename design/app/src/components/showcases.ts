/* Витрины своих элементов (docs/CANVAS.md §11 канваса, canvas-ui-rules/rules/components.md п. 7): адрес —
   #/component-<имя>. Два формата рядом с элементом, Vite собирает оба сам (import.meta.glob), регистрировать не нужно:
   - <имя>/<имя>.stories.tsx — истории по образцу Storybook CSF3 (src/components/stories.tsx, v1.2.0): доска режет кадр по
     историям, ссылка на историю — lib:…#<id>;
   - <имя>/<имя>.showcase.tsx — витрина одной страницей (v1.1.0): экспорт по умолчанию — экран ({ env }), `meta` — строка
     списка элементов.
   Узел витрины на доске — python3 .canvas/board.py component showcase <имя>. */
import { createElement, type ReactElement } from 'react';
import type { Env } from '../screens';
import { StoriesScreen, type StoriesModule } from './stories';

/* строка списка элементов: название и что делает — ключи перевода t(…) */
export interface ShowcaseMeta {
  title: string;
  summary: string;
}

export interface ShowcaseModule {
  default: (props: { env: Env }) => ReactElement | null;
  meta?: ShowcaseMeta;
}

export const SHOWCASE_PREFIX = 'component-';

const pages = import.meta.glob<ShowcaseModule>('./*/*.showcase.tsx', { eager: true });
const stories = import.meta.glob<StoriesModule>('./*/*.stories.tsx', { eager: true });
const folder = (path: string) => path.split('/')[1] ?? path;

/** имя папки элемента → экран витрины (истории главнее страницы, если есть оба файла) */
export const SHOWCASES: Record<string, ShowcaseModule['default']> = {
  ...Object.fromEntries(Object.entries(pages).map(([path, mod]) => [folder(path), mod.default])),
  ...Object.fromEntries(Object.entries(stories).map(([path, mod]) => [
    folder(path), ({ env }: { env: Env }) => createElement(StoriesScreen, { env, module: mod }),
  ])),
};

/** имя папки элемента → строка списка элементов */
export const SHOWCASE_META: Record<string, ShowcaseMeta> = {
  ...Object.fromEntries(Object.entries(pages).flatMap(([path, mod]) => (mod.meta ? [[folder(path), mod.meta]] : []))),
  ...Object.fromEntries(Object.entries(stories).flatMap(([path, mod]) => (mod.default.title
    ? [[folder(path), { title: mod.default.title, summary: mod.default.summary ?? '' }]] : []))),
};
