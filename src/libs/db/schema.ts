import { relations } from 'drizzle-orm'
import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

export const userTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
})

export const sessionTable = pgTable('session', {
  id: serial('id').primaryKey(),
  userId: serial('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
})

export const postTable = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id')
    .references(() => userTable.id, { onDelete: 'cascade' })
    .notNull(),
})

export const commentTable = pgTable('comments', {
  id: serial('id').primaryKey(),
  text: text('text'),
  authorId: integer('author_id')
    .references(() => userTable.id, { onDelete: 'cascade' })
    .notNull(),
  postId: integer('post_id')
    .references(() => postTable.id, { onDelete: 'cascade' })
    .notNull(),
})

export const usersRelations = relations(userTable, ({ many }) => ({
  posts: many(postTable),
}))

export const postsRelations = relations(postTable, ({ one, many }) => ({
  author: one(userTable, {
    fields: [postTable.authorId],
    references: [userTable.id],
  }),
  comments: many(commentTable),
}))

export const commentsRelations = relations(commentTable, ({ one }) => ({
  post: one(postTable, {
    fields: [commentTable.postId],
    references: [postTable.id],
  }),
}))
