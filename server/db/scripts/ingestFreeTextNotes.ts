import fs from 'fs';
import csv from 'csv-parser';
import { db } from '../../src/server';
import { freeTextNotes } from '../schema';

export const ingestFreeTextNotesLogs = async (filePath: string) => {
    const rows: { noteId: string, entityId: string, category: string, text: string, textTime: Date, insertedAt: Date }[] = [];

    return new Promise<void>((resolve, reject) => {
        fs
            .createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => {
                rows.push({
                    noteId: data.note_id,
                    entityId: data.entity_id,
                    category: data.category,
                    text: data.text,
                    textTime: new Date(data.timestamp),
                    insertedAt: new Date()
                })
            })
            .on("end", async () => {
                try {
                    if (rows.length > 0) {
                        await db.insert(freeTextNotes).values(rows);
                        console.log(`✅ Inserted ${rows.length} free text records`);
                    } else {
                        console.log(`⚠️ No rows found in CSV.`);
                    };

                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting free text logs:', error);
                    reject();
                }
            })
    })
}

const filePath = "/Users/ritapdey/appdev/ethos_campus_security_system/server/db/data/free_text_notes (helpdesk or RSVPs).csv";
ingestFreeTextNotesLogs(filePath).then(() => process.exit(0));