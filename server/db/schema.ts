import { boolean, jsonb, pgEnum, pgTable, serial, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const profileEnum = pgEnum('student_or_staff', ['student', 'faculty', 'staff']);

export const swipeLogs = pgTable('swipe_logs', {
    id: serial("id").primaryKey(),
    cardId: varchar("card_id", { length: 255 }).notNull(),
    locationId: varchar("location_id", { length: 255 }).notNull(),
    swipeTime: timestamp("swipe_time", { withTimezone: false }).notNull(),
    insertedAt: timestamp("inserted_at", { withTimezone: false }).notNull()
});

export const cctvLogs = pgTable('cctv_logs', {
    id: serial('id').primaryKey(),
    frameId: varchar('frame_id', { length: 255 }).notNull(),
    locationId: varchar("location_id", { length: 255 }).notNull(),
    cctvTime: timestamp("cctv_time", { withTimezone: false }).notNull(),
    insertedAt: timestamp('inserted_at', { withTimezone: false }).notNull()
});

export const faceEmbeddingLogs = pgTable('face_embeddings', {
    id: serial('id').primaryKey(),
    faceId: varchar('face_id', { length: 255 }).notNull(),
    embedding: jsonb('face_embeddings'),
    insertedAt: timestamp('inserted_at', { withTimezone: false }).notNull(),
});

export const labBookingsLogs = pgTable('lab_booking', {
    id: serial('id').primaryKey(),
    bookingId: varchar('booking_id', { length: 255 }).notNull(),
    entityId: varchar('entity_id', { length: 255 }).notNull(),
    roomId: varchar('room_id', { length: 255 }).notNull(),
    startTime: timestamp('start_time', { withTimezone: false }).notNull(),
    endTime: timestamp('end_time', { withTimezone: false }).notNull(),
    attended: boolean('attended').default(false),
    insertedAt: timestamp('inserted_at', { withTimezone: false }).notNull()
});

export const libraryCheckoutLogs = pgTable('library_checkout', {
    id: serial('id').primaryKey(),
    checkoutId: varchar('checkout_id', { length: 255 }).notNull(),
    entityId: varchar('entity_id', { length: 255 }).notNull(),
    bookId: varchar('book_id', { length: 255 }).notNull(),
    checkoutTime: timestamp('checkout_time', { withTimezone: false }).notNull(),
    insertedAt: timestamp('inserted_at', { withTimezone: false }).notNull()
});

export const studentStaffProfiles = pgTable('student_staff_profiles', {
    id: serial('id').primaryKey(),
    entityId: varchar('entity_id', { length: 255 }).notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    role: profileEnum('profile_role').notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    department: varchar('department', { length: 255 }).notNull(),
    studentId: varchar('student_id', { length: 255 }),
    staffId: varchar('staff_id', { length: 255 }),
    cardId: varchar('card_id', { length: 255 }).notNull(),
    deviceHash: varchar('device_hash', { length: 255 }).notNull(),
    faceId: varchar('face_id', { length: 255 }),
    insertedAt: timestamp('inserted_at', { withTimezone: false }).notNull(),
});

export const wifiLogs = pgTable('wifi_associations', {
    id: serial('id').primaryKey(),
    deviceHash: varchar('device_hash', { length: 255 }).notNull(),
    apId: varchar('ap_id', { length: 255 }).notNull(),
    wifiTime: timestamp('wifi_time', { withTimezone: false }).notNull(),
    insertedAt: timestamp('inserted_at', { withTimezone: false }).notNull(),
});

export const freeTextNotes = pgTable('free_text_notes', {
    id: serial('id').primaryKey(),
    noteId: varchar('note_id', { length: 255 }).notNull(),
    entityId: varchar('entity_id', { length: 255 }).notNull(),
    category: varchar('category', { length: 255 }).notNull(),
    text: varchar('text', { length: 255 }).notNull(),
    textTime: timestamp('text_time', { withTimezone: false }).notNull(),
    insertedAt: timestamp('inserted_at', { withTimezone: false }).notNull(),
});

export const resolvedEvents = pgTable('resolved_events', {
    id: serial('id').primaryKey(),
    entityId: varchar('entity_id', { length: 255 }).notNull(),
    sourceTable: varchar('source_table', { length: 255 }).notNull(),
    sourceRecordId: varchar('source_record_id', { length: 255 }).notNull(),
    eventTime: timestamp('event_time', { withTimezone: false }).notNull(),
    locationId: varchar('location_id', { length: 255 }),
    insertedAt: timestamp('inserted_at', { withTimezone: false }).defaultNow()
});

