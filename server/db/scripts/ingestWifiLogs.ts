import fs from 'fs';
import csv from 'csv-parser';
import { db } from '../../src/server';
import { wifiLogs } from '../schema';

export const ingestWifiLogs = async (filePath: string) => {
    const rows: { deviceHash: string, apId: string, wifiTime: Date, insertedAt: Date }[] = [];

    return new Promise<void>((resolve, reject) => {
        fs
            .createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => {
                rows.push({
                    deviceHash: data.device_hash,
                    apId: data.ap_id,
                    wifiTime: new Date(data.timestamp),
                    insertedAt: new Date()
                })
            })
            .on("end", async () => {
                try {
                    if (rows.length > 0) {
                        await db.insert(wifiLogs).values(rows);
                        console.log(`✅ Inserted ${rows.length} wifi records`);
                    } else {
                        console.log(`⚠️ No rows found in CSV.`);
                    };

                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting wifi logs:', error);
                    reject();
                }
            })
    })
}

const filePath = "/Users/ritapdey/appdev/ethos_campus_security_system/server/db/data/wifi_associations_logs.csv";
ingestWifiLogs(filePath).then(() => process.exit(0));