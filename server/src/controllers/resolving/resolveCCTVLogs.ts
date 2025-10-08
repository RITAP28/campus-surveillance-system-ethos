import { eq } from "drizzle-orm";
import { cctvLogs, studentStaffProfiles } from "../../../db/schema";
import { db } from "../../server";


export const resolveCCTVLogs = async () => {
    try {
        const batchSize = 1000;
        let offset = 0;

        while (true) {
            const logsCCTV = await db.select().from(cctvLogs).limit(batchSize).offset(offset);
            if (logsCCTV.length === 0) break;

            // const [profile] = await db.select().from(studentStaffProfiles).where(eq(studentStaffProfiles.))
        }
    } catch (error) {
        console.error('error while resolving cctv logs: ', error);
    }
}