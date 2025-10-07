import fs from 'fs';
import csv from 'csv-parser';
import { db } from '../../src/server';
import { studentStaffProfiles } from '../schema';

enum IProfileRole {
    student = 'student',
    faculty = 'faculty',
    staff = 'staff'
};

export const ingestProfileLogs = async (filePath: string) => {
    const rows: { entityId: string, name: string, role: IProfileRole, email: string, department: string, studentId: string, staffId: string, cardId: string, deviceHash: string, faceId: string, insertedAt: Date }[] = [];

    return new Promise<void>((resolve, reject) => {
        fs
            .createReadStream(filePath)
            .pipe(csv())
            .on("data", (data) => {
                rows.push({
                    entityId: data.entity_id,
                    name: data.name,
                    role: data.role,
                    email: data.email,
                    department: data.department,
                    studentId: data.student_id,
                    staffId: data.staff_id,
                    cardId: data.card_id,
                    deviceHash: data.device_hash,
                    faceId: data.face_id,
                    insertedAt: new Date()
                })
            })
            .on("end", async () => {
                try {
                    if (rows.length > 0) {
                        // since the parameters are too many, we will batch insert the data
                        const batchSize = 3000;
                        for (let i=0; i<rows.length; i+=batchSize) {
                            const batch = rows.slice(i, i + batchSize);
                            await db.insert(studentStaffProfiles).values(batch);
                            console.log(`inserted batch ${i / batchSize + 1}`);
                        }
                        console.log(`✅ Inserted ${rows.length} profile records`);
                    } else {
                        console.log(`⚠️ No rows found in CSV.`);
                    };

                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting profile logs:', error);
                    reject();
                }
            })
    })
}

const filePath = "/Users/ritapdey/appdev/ethos_campus_security_system/server/db/data/student or staff profiles.csv";
ingestProfileLogs(filePath).then(() => process.exit(0));