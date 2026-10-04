/* Истории своих элементов (docs/CANVAS.md §11 канваса, canvas-ui-rules/rules/components.md): файл
   <имя>/<имя>.stories.tsx рядом с элементом — по образцу Storybook CSF3. Экспорт по умолчанию — defineStories({ name,
   kind, layout, title, summary }), именованные экспорты — истории story({ id, name, render }); render — компонент React,
   в нём можно держать состояние. story() запоминает порядок объявления: у пространства имён модуля экспорты идут по
   алфавиту, а доска режет кадр по историям в порядке файла. Раннер показывает их по адресу витрины #/component-<имя> (src/components/showcases.ts):
   layout 'stack' — все истории подряд, каждая в своём блоке Story (доска режет кадр по историям), сеткой в `columns`
   колонок на десктопе (на планшете — не больше двух, на телефоне — одна; история `wide` — во всю строку, `solo` —
   только своим состоянием: слой витрины, в общий кадр не входит); layout
   'screen' — одна история на весь экран (виджет, шаблон экрана), остальные — состоянием ?state=<id> (слои узла
   витрины на доске).
   Вставка: адрес ?state=<id>&embed=1 показывает одну историю без оболочки экрана и подписи — так её ставит живым
   примером статья элемента в «Библиотеке» доски; высоту содержимого и ширину, которая ему нужна, страница сообщает
   родителю.
   Файл копирует заготовка канваса; на сам канвас он не ссылается. */
import { Card } from '@heroui/react';
import { createElement, useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import type { Env } from '../screens';
import { Shell } from '../screens/shared';

export type ElementKind = 'component' | 'composition' | 'template' | 'widget';

export interface StoriesMeta {
  messages?: Record<string, Record<string, string>>; // переводы примеров путешествуют с пакетом
  name: string;                     // имя элемента, как раздел реестра (PhotoUpload)
  kind?: ElementKind;               // вид элемента; по умолчанию component
  layout?: 'stack' | 'screen';      // stack — истории подряд одним кадром; screen — каждая история на весь экран
  title?: string;                   // строка списка элементов: название — ключ перевода t(…)
  summary?: string;                 // и что делает
  columns?: 1 | 2 | 3;              // stack: колонок сетки историй на десктопе; по умолчанию 1
}

export type StoryArgs = Record<string, string | number | boolean>;
export type StoryControl = { label?: string; type: 'boolean' | 'select' | 'text' | 'number'; options?: string[]; optionLabels?: Record<string, string> };
export interface StoryProps {
  args?: StoryArgs;
  env: Env;
  t: Env['t'];
}

export interface Story {
  preview?: { parent?: string; stateName?: string; hidden?: boolean; capture?: { story: string; kind: string; params: Record<string, string | number | boolean> } };
  id: string;                       // kebab-case: состояние ?state=<id>, слой витрины и ссылка lib:…#<id>
  name: string;                     // подпись истории — ключ перевода
  wide?: boolean;                   // stack: история во всю строку сетки
  solo?: boolean;                   // stack: только своим состоянием — слой витрины, в общий кадр не входит
  args?: StoryArgs;
  controls?: Record<string, StoryControl>;
  render: (props: StoryProps) => ReactNode;
}

export type StoriesModule = { default: StoriesMeta } & Record<string, unknown>;

export function defineStories(meta: StoriesMeta): StoriesMeta {
  return meta;
}

/* порядок объявления историй: счётчик растёт при каждом вызове story() — модуль исполняется сверху вниз */
let declared = 0;
const ORDER = new WeakMap<Story, number>();

/** история элемента: export const Disabled = story({ id: 'disabled', name: 'Выключена', render: … }) */
export function story(s: Story): Story {
  ORDER.set(s, declared++);
  return s;
}

function isStory(value: unknown): value is Story {
  return typeof value === 'object' && value !== null
    && typeof (value as Story).render === 'function' && typeof (value as Story).id === 'string';
}

/** истории модуля в порядке объявления (story()); без story() — по алфавиту имён экспорта, как их отдаёт модуль */
export function storiesOf(module: StoriesModule): Story[] {
  const found = Object.entries(module).filter(([key, value]) => key !== 'default' && isStory(value)).map(([, value]) => value as Story);
  const at = (s: Story) => ORDER.get(s) ?? Number.MAX_SAFE_INTEGER;
  return found.sort((a, b) => at(a) - at(b));
}

/* колонки сетки по окну: литералы классов — Tailwind собирает только написанные целиком */
function gridOf(columns: 1 | 2 | 3, layout: Env['layout']): string {
  if (columns === 1 || layout === 'mobile') return 'grid-cols-1';
  return layout === 'tablet' || columns === 2 ? 'grid-cols-2' : 'grid-cols-3';
}

/* вставка (`embed=1`): параметр читается из адреса сам — из части после # и из строки запроса, какой бы ни был
   роутер макетов; Env экрана для этого не меняется */
function embedded(): boolean {
  if (typeof window === 'undefined') return false;
  const hash = window.location.hash;
  const queries = [hash.includes('?') ? hash.slice(hash.indexOf('?') + 1) : '', window.location.search.replace(/^\?/, '')];
  return queries.some((query) => new URLSearchParams(query).get('embed') === '1');
}

/* ширина истории во вставке — как у карточки витрины на десктопе: сетка в три колонки — узкая, в две — средняя;
   история `wide` (на витрине — во всю строку сетки) во вставке занимает столько, сколько нужно её содержимому, но не
   шире окна: доска уменьшает пример, только когда ему не хватает места, а «во всю ширину окна» уменьшало бы и три
   маленьких превью */
const EMBED_WIDTH: Record<1 | 2 | 3, string> = { 1: 'w-full max-w-3xl', 2: 'w-full max-w-2xl', 3: 'w-full max-w-md' };
const EMBED_WIDE = 'w-fit max-w-full';

/* одна история во вставке: содержимое — в том же блоке Story, на подложке карточки, по центру окна вставки; размеры
   уходят родителю (доске канваса) сообщением: высота содержимого с полями — рамка примера встаёт по его росту, и
   ширина, которая содержимому нужна (блок истории с полями: у истории `wide` — всё окно) — окно профиля шире места
   в статье доска обрезает по бокам, а уменьшает, только когда содержимому места не хватает */
function EmbeddedStory({ env, story, columns }: { env: Env; story: Story; columns: 1 | 2 | 3 }): ReactElement {
  const box = useRef<HTMLDivElement>(null);
  const [args, setArgs] = useState<StoryArgs>(story.args ?? {});
  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source !== window.parent || event.data?.source !== 'canvas-controls' || event.data?.story !== story.id) return;
      const values = event.data.args;
      if (!values || typeof values !== 'object' || Array.isArray(values)) return;
      const next: StoryArgs = { ...story.args };
      for (const [name, control] of Object.entries(story.controls ?? {})) {
        const value = values[name];
        if ((control.type === 'boolean' && typeof value === 'boolean') ||
            (control.type === 'number' && typeof value === 'number' && Number.isFinite(value)) ||
            (control.type === 'text' && typeof value === 'string' && value.length <= 500) ||
            (control.type === 'select' && typeof value === 'string' && control.options?.includes(value))) next[name] = value;
      }
      setArgs(next);
    };
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [story]);
  useEffect(() => {
    const el = box.current;
    if (!el || window.parent === window) return undefined;
    const tell = () => {
      const style = getComputedStyle(el);
      const pad = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
      const block = el.firstElementChild?.getBoundingClientRect().width ?? 0;
      window.parent.postMessage({ source: 'canvas-story', story: story.id, controls: story.controls, args,
        height: Math.ceil(el.getBoundingClientRect().height), width: Math.ceil(block + pad) }, '*');
    };
    const watch = new ResizeObserver(tell);
    watch.observe(el);
    tell();
    return () => watch.disconnect();
  }, [story.id, story.controls, args]);
  return (
    <div data-canvas-embed className="flex min-h-screen items-center justify-center bg-surface text-foreground">
      <div ref={box} className="flex w-full justify-center p-6 sm:p-10">
        <div data-canvas="Story" data-story={story.id} role="group" aria-label={env.t(story.name)}
          className={story.wide ? EMBED_WIDE : EMBED_WIDTH[columns]}>
          {createElement(story.render, { env, t: env.t, args })}
        </div>
      </div>
    </div>
  );
}

/** экран витрины по историям: адрес #/component-<имя>[?state=<id>][&embed=1] */
export function StoriesScreen({ env, module }: { env: Env; module: StoriesModule }): ReactElement | null {
  const meta = module.default;
  const messages = meta.messages?.[env.locale.split('-')[0]!.toLowerCase()];
  const projectT = env.t;
  if (messages) env = { ...env, t: (text, vars) => {
    if (messages[text] === undefined) return projectT(text, vars);
    let translated = messages[text]!;
    for (const [key, value] of Object.entries(vars ?? {})) translated = translated.split(`{${key}}`).join(String(value));
    return translated;
  } };
  const stories = storiesOf(module);
  const picked = stories.find((story) => story.id === env.state);
  if (embedded() && (picked ?? stories[0])) return <EmbeddedStory env={env} story={(picked ?? stories[0])!} columns={meta.columns ?? 1} />;
  if (meta.layout === 'screen') {
    const story = picked ?? stories[0];
    if (!story) return null;
    return (
      <section data-canvas="Story" data-story={story.id} role="group" aria-label={env.t(story.name)} className="min-h-screen">
        {createElement(story.render, { env, t: env.t, args: story.args })}
      </section>
    );
  }
  return (
    <Shell env={env} title={env.t(meta.title ?? meta.name)} back={env.route} wide>
      <div className={`grid gap-4 ${gridOf(picked ? 1 : meta.columns ?? 1, env.layout)}`}>
        {(picked ? [picked] : stories.filter((story) => !story.solo)).map((story) => (
          <Card key={story.id} role="group" aria-label={env.t(story.name)} className={story.wide ? 'col-span-full' : undefined}>
            <Card.Header>
              <Card.Title>{env.t(story.name)}</Card.Title>
            </Card.Header>
            {/* блок Story — само содержимое истории, без заголовка: доска вырезает ровно элемент в этом состоянии */}
            <Card.Content data-canvas="Story" data-story={story.id}>{createElement(story.render, { env, t: env.t, args: story.args })}</Card.Content>
          </Card>
        ))}
      </div>
    </Shell>
  );
}
