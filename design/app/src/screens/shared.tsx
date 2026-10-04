/* Общий каркас экранов (HeroUI v3): шапка с заголовком раздела (и «Назад» у вложенного экрана), содержимое, панель
   главного действия и навигация по разделам — боковая на десктопе, нижняя на телефоне и планшете; пока раздел один,
   навигации нет. Десктоп — колонка max-w-3xl по центру (таблица и дашборд — `wide`, во всю ширину), не растянутый
   телефон. Правка здесь меняет все экраны и старит все кадры доски: то, что нужно одному экрану, — в его файл
   src/screens/<id>.tsx. */
import { Button, Typography } from '@heroui/react';
import { ArrowLeft, House } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Env, Route } from '../screens';

type Section = [Route, string, typeof House];

/* разделы навигации: маршрут, подпись, значок; второй раздел — строкой здесь, и навигация появится на всех экранах */
const SECTIONS: Section[] = [['home', 'Главная', House]];

/* боковая навигация десктопа: строки — Button кита, secondary у текущего раздела, ghost у остальных */
function SideNav({ env, go }: { env: Env; go: (route: Route) => void }) {
  return (
    <nav data-canvas="SideNav" aria-label={env.t('Разделы')} className="sticky top-0 flex h-screen w-60 shrink-0 flex-col gap-1 border-r border-border bg-surface px-3 py-5">
      {SECTIONS.map(([route, label, Icon]) => {
        const active = env.route === route;
        return (
          <Button key={route} variant={active ? 'secondary' : 'ghost'} className="justify-start" aria-current={active ? 'page' : undefined} onPress={() => go(route)}>
            <Icon size={18} aria-hidden /> {env.t(label)}
          </Button>
        );
      })}
    </nav>
  );
}

/* нижняя навигация телефона: у кита её нет — строка из Button кита ghost, значок над подписью (canvas-ui-rules, rules/kit.md) */
function BottomNav({ env, go }: { env: Env; go: (route: Route) => void }) {
  return (
    <nav data-canvas="BottomNav" aria-label={env.t('Разделы')} className="flex items-stretch border-t border-border bg-background pb-[env(safe-area-inset-bottom)]">
      {SECTIONS.map(([route, label, Icon]) => {
        const active = env.route === route;
        return (
          <Button key={route} variant="ghost" aria-current={active ? 'page' : undefined} onPress={() => go(route)}
            className={`h-auto min-w-0 flex-1 flex-col gap-0.5 rounded-xl px-0 py-2 text-xs font-normal ${active ? 'bg-accent-soft text-accent-soft-foreground' : 'text-foreground'}`}>
            <Icon size={22} aria-hidden /><span className="max-w-full truncate">{env.t(label)}</span>
          </Button>
        );
      })}
    </nav>
  );
}

/* Оболочка страницы: `back` — маршрут «Назад» вложенного экрана, `actions` — действия в шапке, `footer` — главное действие
   (на телефоне — панель внизу во всю ширину, на десктопе — под содержимым), `wide` — таблица или дашборд во всю ширину. */
export function Shell({ env, title, back, actions, footer, wide = false, children }: {
  env: Env; title: string; back?: Route; actions?: ReactNode; footer?: ReactNode; wide?: boolean; children: ReactNode;
}) {
  const desktop = env.layout === 'desktop';
  const nav = SECTIONS.length > 1;
  const go = (route: Route) => env.go(route);
  const header = (
    <header data-canvas="PageHeader" className={`flex items-center gap-3 ${desktop ? 'pb-2 pt-6' : 'sticky top-0 z-10 border-b border-border bg-background px-2 py-2'}`}>
      {back ? (
        <Button isIconOnly variant="ghost" size="lg" aria-label={env.t('Назад')} onPress={() => go(back)}>
          <ArrowLeft size={20} aria-hidden />
        </Button>
      ) : null}
      <Typography.Heading level={1} className={`min-w-0 flex-1 ${desktop ? 'text-2xl' : `truncate text-lg ${back ? '' : 'px-2'}`}`}>{title}</Typography.Heading>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  );
  if (desktop) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        {nav ? <SideNav env={env} go={go} /> : null}
        <div className={`mx-auto flex w-full min-w-0 flex-1 flex-col px-8 ${wide ? '' : 'max-w-3xl'}`}>
          {header}
          <main className="flex min-w-0 flex-1 flex-col gap-5 pb-8 pt-3">
            {children}
            {footer ? <div className="flex flex-wrap items-center gap-2 pt-2">{footer}</div> : null}
          </main>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {header}
      <main className="flex min-w-0 flex-1 flex-col gap-4 px-4 pb-6 pt-4">{children}</main>
      {footer || nav ? (
        // панель действия и нижняя навигация прилипают к низу окна, содержимое прокручивается под ними
        <div className="sticky bottom-0 z-10 bg-background">
          {footer ? <div data-canvas="Footer" className="flex flex-col gap-2 border-t border-border px-4 py-3">{footer}</div> : null}
          {nav ? <BottomNav env={env} go={go} /> : null}
        </div>
      ) : null}
    </div>
  );
}
