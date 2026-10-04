/* Сущности предметной области — без React и без сети. Заполняется по спеке экранов; Example — образец, замените своими. */
export type ISODate = string;

export interface Example {
  id: string;
  title: string;
  createdAt: ISODate;
}
