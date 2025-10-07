import fs from 'fs';
import csv from 'csv-parser';
import { db } from '../../src/server';
import { libraryCheckoutLogs } from '../schema';

export const ingestLibraryCheckoutLogs = async (filePath: string) => {
    const rows: { checkoutId: string, entityId: string, bookId: string, checkoutTime: Date, insertedAt: Date }[] = [];

    return new Promise<void>((resolve, reject) => {
        fs
            .createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => {
                rows.push({
                    checkoutId: data.checkout_id,
                    entityId: data.entity_id,
                    bookId: data.book_id,
                    checkoutTime: new Date(data.timestamp),
                    insertedAt: new Date()
                })
            })
            .on("end", async () => {
                try {
                    if (rows.length > 0) {
                        await db.insert(libraryCheckoutLogs).values(rows);
                        console.log(`✅ Inserted ${rows.length} library checkout records`);
                    } else {
                        console.log(`⚠️ No rows found in CSV.`);
                    };

                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting library checkout logs:', error);
                    reject();
                }
            })
    })
}

const filePath = "/Users/ritapdey/appdev/ethos_campus_security_system/server/db/data/library_checkouts.csv";
ingestLibraryCheckoutLogs(filePath).then(() => process.exit(0));