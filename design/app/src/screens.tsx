/* АГЕНТУ, ДО ПРАВКИ: экран меняется по .canvas/workflows/canvas-screen.md (сначала canvas-brief.md), замечания владельца —
   .canvas/workflows/canvas-comments.md (`board.py comments --open`, ответ — только `board.py resolve`).
   Экран — своим файлом src/screens/<id>.tsx, общий каркас — src/screens/shared.tsx; этот файл — только маршрутизатор.
   Компоненты — по навыку canvas-ui-rules (rules/kit.md) и документации HeroUI v3 (MCP heroui-react), не по памяти.
   Самопроверка — `python3 .canvas/board.py screen <id>`; в отчёт — последняя строка ВЕРДИКТ. */
/* Маршрут — id узла доски. Адрес кадра — #/<маршрут>?theme=…&locale=…&layout=…&state=… (app.urlTemplate "#{route}?{query}"):
   канвас снимает каждый экран и его состояние без кликов; новый экран — строка в Route, ROUTES и SCREENS. */
import type { ReactElement } from 'react';
import type { Locale } from './i18n';
import { Home } from './screens/home';

export type Route = 'home';
export const ROUTES: Route[] = ['home'];
/* витрина своего компонента — component-<имя> (src/components/showcases.ts): в неё ведёт env.go, как в экран */
export type ShowcaseRoute = `component-${string}`;

export interface Env {
  route: Route;
  state: string;                                 // состояние экрана из адреса (?state=…) — слой узла на доске
  theme: 'light' | 'dark';
  locale: Locale;
  layout: 'mobile' | 'tablet' | 'desktop';       // tablet — мобильная раскладка на окне планшета
  t: (s: string, vars?: Record<string, string | number>) => string;
  go: (route: Route | ShowcaseRoute, state?: string) => void;
}

export const SCREENS: Record<Route, (p: { env: Env }) => ReactElement> = {
  home: Home,
};
