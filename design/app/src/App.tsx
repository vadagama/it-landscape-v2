/* Оболочка макетов: маршрут, тема, язык, раскладка и состояние экрана — из адреса
   (#/home?theme=dark&locale=ru-RU&layout=desktop&state=…): так канвас снимает каждый экран и слой без кликов, а дерево
   блоков отдаёт экспортёр, которого съёмка встраивает сама — в приложении для неё ни строки. Вживую, без параметров, —
   тема системы, язык базы и раскладка по ширине окна. Данные экранов — из src/data (пока моки). */
import { I18nProvider, Toast } from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import { DataRoot } from './data/context';
import { BASE_LOCALE, makeT } from './i18n';
import { SHOWCASES, SHOWCASE_PREFIX } from './components/showcases';
import { ROUTES, SCREENS, type Env, type Route, type ShowcaseRoute } from './screens';

/* #/component-<имя> — витрина своего компонента (src/components/showcases.ts): все варианты и состояния */
function parse(): { route: Route; params: URLSearchParams; showcase: string | null } {
  const hash = location.hash.replace(/^#/, '') || '/';
  const [path = '', query = ''] = hash.split('?');
  const name = path.replace(/^\//, '');
  const showcase = name.startsWith(SHOWCASE_PREFIX) && SHOWCASES[name.slice(SHOWCASE_PREFIX.length)]
    ? name.slice(SHOWCASE_PREFIX.length) : null;
  const route = (ROUTES as string[]).includes(name) ? (name as Route) : ROUTES[0];
  return { route, params: new URLSearchParams(query), showcase };
}

/* адрес другого экрана: тема, язык и раскладка кадра переходят с экрана на экран, состояние у экрана своё */
function href(route: Route | ShowcaseRoute, state = ''): string {
  const now = parse().params;
  const query = new URLSearchParams();
  for (const key of ['theme', 'locale', 'layout']) {
    const value = now.get(key);
    if (value) query.set(key, value);
  }
  if (state) query.set('state', state);
  const text = query.toString();
  return `/${route}${text ? `?${text}` : ''}`;
}

function themeOf(value: string | null): Env['theme'] {
  if (value === 'dark' || value === 'light') return value;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function layoutOf(value: string | null): Env['layout'] {
  if (value === 'mobile' || value === 'tablet' || value === 'desktop') return value;
  return window.innerWidth >= 1024 ? 'desktop' : window.innerWidth >= 768 ? 'tablet' : 'mobile';
}

export function App() {
  const [, tick] = useState(0);
  useEffect(() => {
    const again = () => tick((n) => n + 1);
    window.addEventListener('hashchange', again);
    window.addEventListener('resize', again);                  // раскладка без параметра следует за шириной окна
    return () => {
      window.removeEventListener('hashchange', again);
      window.removeEventListener('resize', again);
    };
  }, []);
  const { route, params, showcase } = parse();
  const state = params.get('state') || '';
  const theme = themeOf(params.get('theme'));
  const locale = params.get('locale') || BASE_LOCALE;
  const layout = layoutOf(params.get('layout'));
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.classList.toggle('light', theme !== 'dark');
    root.dataset.theme = theme;
    root.lang = locale;
  }, [theme, locale]);
  const env = useMemo<Env>(() => ({
    route, state, theme, locale, layout, t: makeT(locale),
    go: (to, next) => { location.hash = href(to, next); },
  }), [route, state, theme, locale, layout]);
  const Screen = (showcase && SHOWCASES[showcase]) || SCREENS[route];
  // I18nProvider — язык полей кита (даты, числа, календарь React Aria); тост на телефоне — сверху: внизу панель действия
  return (
    <I18nProvider locale={locale}>
      <DataRoot>
        <Screen env={env} />
      </DataRoot>
      <Toast.Provider placement={layout === 'desktop' ? 'bottom end' : 'top'} />
    </I18nProvider>
  );
}
