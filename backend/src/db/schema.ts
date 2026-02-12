import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const symptoms = sqliteTable('symptoms', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull()
});
