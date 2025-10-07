import fs from 'fs';
import csv from 'csv-parser';
import { db } from '../../src/server';
import { cctvLogs } from '../schema';

export const ingestCCTVLogs = async (filePath: string) => {
    const rows: { frameId: string, locationId: string, cctvTime: Date, insertedAt: Date }[] = [];

    return new Promise<void>((resolve, reject) => {
        fs
            .createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => {
                rows.push({
                    frameId: data.frame_id,
                    locationId: data.location_id,
                    cctvTime: new Date(data.timestamp),
                    insertedAt: new Date()
                })
            })
            .on("end", async () => {
                try {
                    if (rows.length > 0) {
                        await db.insert(cctvLogs).values(rows);
                        console.log(`✅ Inserted ${rows.length} cctv records`);
                    } else {
                        console.log(`⚠️ No rows found in CSV.`);
                    };

                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting cctv logs:', error);
                    reject();
                }
            })
    })
}

const filePath = "/Users/ritapdey/appdev/ethos_campus_security_system/server/db/data/cctv_frames.csv";
ingestCCTVLogs(filePath).then(() => process.exit(0));