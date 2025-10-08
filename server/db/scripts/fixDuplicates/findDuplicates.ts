import { eq, sql } from "drizzle-orm"
import { db } from "../../../src/server"
import { studentStaffProfiles } from "../../schema";
import { nanoid } from 'nanoid';

export const findDuplicateStudentIDs = async () => {
    const duplicates = await db.execute(sql`
        SELECT student_id, COUNT(*) AS count
        FROM student_staff_profiles
        WHERE student_id IS NOT NULL
        GROUP BY student_id
        HAVING COUNT(*) > 1   
    `);

    console.log("Duplicate student IDs found: ", duplicates.length);
    for (const row of duplicates) {
        console.log('row: ', row.student_id);
        const sid = row.student_id as string;
        const rows = await db.select().from(studentStaffProfiles).where(eq(studentStaffProfiles.studentId, sid));
        // console.log(`rows length: ${rows.length}`);

        const [, ...dupes] = rows;
        for (let dupe=0; dupe<dupes.length; dupe++) {
            const newId = `S${nanoid(8)}`;
            // console.log(`Updating studentId for entity ${dupes[dupe].entityId}: ${sid} → ${newId}`);

            await db.update(studentStaffProfiles).set({ studentId: newId }).where(eq(studentStaffProfiles.studentId, String(dupes[dupe].id)));
            console.log(`operation done for ${dupe} / ${dupes.length}`);
        };
    }

    console.log('Duplicate studentIds fixed');
};

findDuplicateStudentIDs().then(() => {
    console.log('operation done');
    return;
});