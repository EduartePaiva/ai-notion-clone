import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import usersToDocuments from "./users-to-documents";

const documentsTable = pgTable("documents", {
    id: uuid().defaultRandom().primaryKey().notNull(),
    title: varchar({ length: 765 }),
    createdAt: timestamp().defaultNow(),
});

export const documentsRelations = relations(documentsTable, ({ many }) => ({
    usersToDocuments: many(usersToDocuments),
}));

export type User = InferSelectModel<typeof documentsTable>;
export type InsertUser = InferInsertModel<typeof documentsTable>;

export default documentsTable;
