import { InferInsertModel, InferSelectModel, relations, sql } from "drizzle-orm"
import {
  boolean,
  index,
  integer,
  pgEnum,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"
import { pgTable } from "./utils"

export const roleEnum = pgEnum("role", ["member", "admin"])
export const accountTypeEnum = ["email", "google", "github"] as const

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 100 }),
  email: varchar("username").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  createdOn: timestamp("created_on").defaultNow().notNull(),
  updatedOn: timestamp("updated_on", { mode: "date" }).$onUpdate(
    () => new Date()
  ),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export const accounts = pgTable(
  "accounts",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 100 }),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    accountType: text("account_type", { enum: accountTypeEnum }).notNull(),
    githubId: text("github_id").unique(),
    googleId: text("google_id").unique(),
    password: text("password"),
    salt: text("salt"),
    createdOn: timestamp("created_on").defaultNow().notNull(),
    updatedOn: timestamp("updated_on", { mode: "date" }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    userIdAccountTypeIdx: index("accounts_user_id_account_type_idx").on(
      table.userId,
      table.accountType
    ),
  })
)

export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert

export const magicLinks = pgTable(
  "magic_links",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 100 }),
    email: text("email").notNull().unique(),
    token: text("token"),
    tokenExpiresAt: timestamp("token_expires_at", { mode: "date" }).notNull(),
  },
  (table) => ({
    tokenIdx: index("magic_links_token_idx").on(table.token),
  })
)

export const resetTokens = pgTable(
  "reset_tokens",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 100 }),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .unique()
      .notNull(),
    token: text("token"),
    tokenExpiresAt: timestamp("token_expires_at", { mode: "date" }),
  },
  (table) => ({
    tokenIdx: index("reset_tokens_token_idx").on(table.token),
  })
)

export const verifyEmailTokens = pgTable(
  "verify_email_tokens",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 100 }),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .unique()
      .notNull(),
    token: text("token"),
    tokenExpiresAt: timestamp("token_expires_at", { mode: "date" }).notNull(),
  },
  (table) => ({
    tokenIdx: index("verify_email_tokens_token_idx").on(table.token),
  })
)

export const profiles = pgTable("profiles", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 100 }),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  displayName: text("display_name"),
  imageId: text("image_id"),
  image: text("image"),
  bio: text("bio").notNull().default(""),
  createdOn: timestamp("created_on").defaultNow().notNull(),
  updatedOn: timestamp("updated_on", { mode: "date" }).$onUpdate(
    () => new Date()
  ),
})

export type Profile = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert

export const subscriptions = pgTable(
  "subscriptions",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 100 }),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .unique()
      .notNull(),
    stripeSubscriptionId: text("stripe_subscription_id").notNull(),
    stripeCustomerId: text("stripe_customer_id").notNull(),
    stripePriceId: text("stripe_price_id").notNull(),
    stripeCurrentPeriodEnd: timestamp("expires", { mode: "date" }).notNull(),
    createdOn: timestamp("created_on").defaultNow().notNull(),
    updatedOn: timestamp("updated_on", { mode: "date" }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    stripeSubscriptionIdIdx: index(
      "subscriptions_stripe_subscription_id_idx"
    ).on(table.stripeSubscriptionId),
  })
)

export type Subscription = typeof subscriptions.$inferSelect
export type NewSubscription = typeof subscriptions.$inferInsert

export const following = pgTable(
  "gf_following",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 100 }),
    userId: integer("userId")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    foreignUserId: integer("foreignUserId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdOn: timestamp("created_on").defaultNow().notNull(),
    updatedOn: timestamp("updated_on", { mode: "date" }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    userIdForeignUserIdIdx: index("following_user_id_foreign_user_id_idx").on(
      table.userId,
      table.foreignUserId
    ),
  })
)

export const newsletters = pgTable("gf_newsletter", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 100 }),
  email: text("email").notNull().unique(),
  createdOn: timestamp("created_on").defaultNow().notNull(),
  updatedOn: timestamp("updated_on", { mode: "date" }).$onUpdate(
    () => new Date()
  ),
})

export const groups = pgTable(
  "groups",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 100 }),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    name: text("name").notNull(),
    description: text("description").notNull(),
    isPublic: boolean("is_public").notNull().default(false),
    bannerId: text("bannerId"),
    info: text("info").default(""),
    youtubeLink: text("youtubeLink").default(""),
    discordLink: text("discordLink").default(""),
    githubLink: text("githubLink").default(""),
    xLink: text("x_link").default(""),
    createdOn: timestamp("created_on").defaultNow().notNull(),
    updatedOn: timestamp("updated_on", { mode: "date" }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    userIdIsPublicIdx: index("groups_user_id_is_public_idx").on(
      table.userId,
      table.isPublic
    ),
  })
)

export type Group = typeof groups.$inferSelect
export type NewGroup = typeof groups.$inferInsert

export const memberships = pgTable(
  "membership",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 100 }),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    groupId: integer("group_id")
      .references(() => groups.id, { onDelete: "cascade" })
      .notNull(),
    role: roleEnum("role").default("member").notNull(),
    createdOn: timestamp("created_on").defaultNow().notNull(),
    updatedOn: timestamp("updated_on", { mode: "date" }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => ({
    userIdGroupIdIdx: index("memberships_user_id_group_id_idx").on(
      table.userId,
      table.groupId
    ),
  })
)

export type Membership = typeof memberships.$inferSelect
export type NewMembership = typeof memberships.$inferInsert

export const invites = pgTable("invites", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 100 }),
  token: text("token")
    .notNull()
    .unique()
    .default(sql`gen_random_uuid()`),
  tokenExpiresAt: timestamp("token_expires_at", { mode: "date" }),
  groupId: integer("group_id")
    .references(() => groups.id, { onDelete: "cascade" })
    .notNull(),
  createdOn: timestamp("created_on").defaultNow().notNull(),
  updatedOn: timestamp("updated_on", { mode: "date" }).$onUpdate(
    () => new Date()
  ),
})

export const events = pgTable("events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 100 }),
  groupId: integer("group_id").references(() => groups.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageId: text("image_id"),
  startsOn: timestamp("startsOn", { mode: "date" }).notNull(),
})

export const posts = pgTable(
  "posts",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 100 }),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    groupId: integer("group_id")
      .references(() => groups.id, { onDelete: "cascade" })
      .notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    excerpt: varchar("excerpt", { length: 255 }).notNull(),
    message: text("message").notNull(),
    status: varchar("status", { length: 10, enum: ["draft", "published"] })
      .default("draft")
      .notNull(),
    tags: varchar("tags", { length: 255 }),
    createdOn: timestamp("created_on").defaultNow().notNull(),
    updatedOn: timestamp("updated_on", { mode: "date" }).$onUpdate(
      () => new Date()
    ),
  },
  (t) => ({
    userIdx: index("post_user_idx").on(t.userId),
    createdOnIdx: index("post_created_on_idx").on(t.createdOn),
  })
)

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert

export const notifications = pgTable("notifications", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 100 }),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  groupId: integer("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  postId: integer("post_id")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  isRead: boolean("is_read").notNull().default(false),
  type: text("type").notNull(),
  message: text("message").notNull(),
  createdOn: timestamp("createdOn", { mode: "date" }).notNull(),
})

export type Notification = typeof notifications.$inferSelect
export type NewNotification = typeof notifications.$inferInsert

export const replies = pgTable(
  "replies",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 100 }),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    postId: integer("post_id")
      .references(() => posts.id, { onDelete: "cascade" })
      .notNull(),
    groupId: integer("group_id")
      .references(() => groups.id, { onDelete: "cascade" })
      .notNull(),
    message: text("message").notNull(),
    createdOn: timestamp("created_on", { mode: "date" }).notNull().defaultNow(),
  },
  (table) => ({
    postIdIdx: index("replies_post_id_idx").on(table.postId),
  })
)

export const comments = pgTable("comments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 100 }),
  text: text("text"),
  authorId: integer("author_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  postId: integer("post_id")
    .references(() => posts.id, { onDelete: "cascade" })
    .notNull(),
  createdOn: timestamp("created_on").defaultNow().notNull(),
  updatedOn: timestamp("updated_on", { mode: "date" }).$onUpdate(
    () => new Date()
  ),
})

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 255 }).primaryKey().notNull(),
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .unique()
      .notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => ({
    userIdIdx: index("sessions_usere_id_idx").on(table.userId),
  })
)

export type Session = InferSelectModel<typeof sessions>
export type NewSession = InferInsertModel<typeof comments>

/**
 * Relationships
 */

export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  memberships: many(memberships),
}))

export const groupsRelations = relations(groups, ({ many }) => ({
  memberships: many(memberships),
}))

export const membershipsRelations = relations(memberships, ({ one }) => ({
  users: one(users, { fields: [memberships.id], references: [users.id] }),
  profiles: one(profiles, {
    fields: [memberships.userId],
    references: [profiles.userId],
  }),
  groups: one(groups, {
    fields: [memberships.groupId],
    references: [groups.id],
  }),
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  users: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  groups: one(groups, { fields: [posts.groupId], references: [groups.id] }),
  comments: many(comments),
}))

export const followingsRelations = relations(following, ({ one }) => ({
  foreignProfile: one(profiles, {
    fields: [following.foreignUserId],
    references: [profiles.userId],
  }),
  userProfile: one(profiles, {
    fields: [following.userId],
    references: [profiles.userId],
  }),
}))

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}))
