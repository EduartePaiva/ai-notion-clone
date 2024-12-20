import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import {
    pgEnum,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uuid,
} from "drizzle-orm/pg-core";

import documentsTable from "./documents";
import usersTable from "./users";

export const roomRoleEnum = pgEnum("room_role_enum", ["owner", "editor"]);

// this table link a user to a document, and document to a user. it's many to many relation
const usersToDocuments = pgTable(
    "users_to_documents",
    {
        userId: text()
            .notNull()
            .references(() => usersTable.id),
        documentId: uuid()
            .notNull()
            .references(() => documentsTable.id),
        role: roomRoleEnum().notNull(),
        createdAt: timestamp().defaultNow(),
    },
    (t) => [primaryKey({ columns: [t.userId, t.documentId] })]
);

export const usersToDocumentsRelations = relations(
    usersToDocuments,
    ({ one }) => ({
        document: one(documentsTable, {
            fields: [usersToDocuments.documentId],
            references: [documentsTable.id],
        }),
        user: one(usersTable, {
            fields: [usersToDocuments.userId],
            references: [usersTable.id],
        }),
    })
);

export type User = InferSelectModel<typeof usersToDocuments>;
export type InsertUser = InferInsertModel<typeof usersToDocuments>;

export default usersToDocuments;
