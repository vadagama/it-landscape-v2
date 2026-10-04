/* Сырой набор моков: JSON как есть; сужение до типов делает src/data/createMockProvider. */
export interface MockSetRaw {
  example: unknown;
}

export type MockSetName = string;
