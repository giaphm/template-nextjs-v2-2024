import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const userTable = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 100 }),
  name: varchar('name').notNull(),
})

export type User = typeof userTable.$inferSelect
export type NewUser = typeof userTable.$inferInsert

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
})

export const postTable = pgTable('posts', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 100 }),
  title: varchar('title').notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id')
    .references(() => userTable.id, { onDelete: 'cascade' })
    .notNull(),
})

export type Post = typeof postTable.$inferSelect
export type NewPost = typeof postTable.$inferInsert

export const commentTable = pgTable('comments', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 100 }),
  text: text('text'),
  authorId: integer('author_id')
    .references(() => userTable.id, { onDelete: 'cascade' })
    .notNull(),
  postId: integer('post_id')
    .references(() => postTable.id, { onDelete: 'cascade' })
    .notNull(),
})

export type Comment = typeof commentTable.$inferSelect
export type NewComment = typeof commentTable.$inferInsert

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
