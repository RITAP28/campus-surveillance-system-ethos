import fs from 'fs';
import csv from 'csv-parser';
import { db } from '../../src/server';
import { faceEmbeddingLogs } from '../schema';

export const ingestFaceEmbeddings = async (filePath: string) => {
    const rows: { faceId: string, embedding: number[], insertedAt: Date }[] = [];

    return new Promise<void>((resolve, reject) => {
        fs
            .createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => {
                rows.push({
                    faceId: data.face_id,
                    embedding: data.face_embedding,
                    insertedAt: new Date()
                })
            })
            .on("end", async () => {
                try {
                    if (rows.length > 0) {
                        await db.insert(faceEmbeddingLogs).values(rows);
                        console.log(`✅ Inserted ${rows.length} face embedding records`);
                    } else {
                        console.log(`⚠️ No rows found in CSV.`);
                    };

                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting face embedding logs:', error);
                    reject();
                }
            })
    })
}

const filePath = "/Users/ritapdey/appdev/ethos_campus_security_system/server/db/data/face_embeddings.csv";
ingestFaceEmbeddings(filePath).then(() => process.exit(0));