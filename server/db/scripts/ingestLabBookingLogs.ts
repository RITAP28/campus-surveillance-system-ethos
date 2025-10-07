import fs from 'fs';
import csv from 'csv-parser';
import { db } from '../../src/server';
import { labBookingsLogs } from '../schema';

export const ingestLabBookingsLogs = async (filePath: string) => {
    const rows: { bookingId: string, entityId: string, roomId: string, startTime: Date, endTime: Date, attended: boolean, insertedAt: Date }[] = [];

    return new Promise<void>((resolve, reject) => {
        fs
            .createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => {
                rows.push({
                    bookingId: data.booking_id,
                    entityId: data.entity_id,
                    roomId: data.room_id,
                    startTime: new Date(data.start_time),
                    endTime: new Date(data.end_time),
                    attended: data.attended,
                    insertedAt: new Date()
                })
            })
            .on("end", async () => {
                try {
                    if (rows.length > 0) {
                        await db.insert(labBookingsLogs).values(rows);
                        console.log(`✅ Inserted ${rows.length} lab booking records`);
                    } else {
                        console.log(`⚠️ No rows found in CSV.`);
                    };

                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting lab booking logs:', error);
                    reject();
                }
            })
    })
}

const filePath = "/Users/ritapdey/appdev/ethos_campus_security_system/server/db/data/lab_bookings.csv";
ingestLabBookingsLogs(filePath).then(() => process.exit(0));