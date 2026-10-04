/* Строки макетов. Ключ — фраза базового языка, как она написана в коде: t('Главная'). Другой язык — словарь
   src/i18n/<язык>.json с теми же ключами (его же читает сторож переводов канваса `board.py langcheck`: i18n.dir в
   design/canvas.config.json) и строка в DICTIONARIES ниже; языки доски — capture.dimensions.locale. Строка с числом или
   именем переводится целиком: подстановки {имя} заменяются после перевода. Даты — языком приложения (formatDate), не
   литеральной локалью базы. */
export type Locale = string;                  // тег языка из адреса кадра: 'ru-RU', 'en-US'

/* язык, на котором написаны строки в коде */
export const BASE_LOCALE: Locale = 'ru-RU';

const DICTIONARIES: Record<string, Record<string, string>> = {
  // en: en,           ← import en from './i18n/en.json'
};

const language = (locale: Locale): string => locale.split('-')[0].toLowerCase();

export function makeT(locale: Locale) {
  const dict = DICTIONARIES[language(locale)] ?? {};
  return (s: string, vars?: Record<string, string | number>): string => {
    let out = dict[s] ?? s;
    for (const [k, v] of Object.entries(vars ?? {})) out = out.split(`{${k}}`).join(String(v));
    return out;
  };
}

/* дата из данных (ISO) — число и месяц словом на языке приложения: «1 января», «January 1» */
export function formatDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? iso : new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long' }).format(date);
}
