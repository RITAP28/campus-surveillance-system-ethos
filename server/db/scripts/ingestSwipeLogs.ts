import fs from 'fs';
import csv from 'csv-parser';
import { db } from '../../src/server';
import { swipeLogs } from '../schema';

export const ingestSwipeLogs = async (filePath: string) => {
    const rows: { cardId: string, locationId: string, swipeTime: Date, insertedAt: Date }[] = [];

    return new Promise<void>((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => {
                rows.push({
                    cardId: data.card_id,
                    locationId: data.location_id,
                    swipeTime: new Date(data.timestamp),
                    insertedAt: new Date()
                });
            })
            .on("end", async () => {
                try {
                    if (rows.length > 0) {
                        await db.insert(swipeLogs).values(rows);
                        console.log(`✅ Inserted ${rows.length} swipe records`);
                    } else {
                        console.log(`⚠️ No rows found in CSV.`);
                    };

                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting swipe logs:', error);
                    reject();
                }
            })
            .on("error", reject);
    })
};

const filePath = "/Users/ritapdey/appdev/ethos_campus_security_system/server/db/data/campus card_swipes.csv";
ingestSwipeLogs(filePath).then(() => process.exit(0));