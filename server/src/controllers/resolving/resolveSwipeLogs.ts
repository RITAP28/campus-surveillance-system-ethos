import { eq } from "drizzle-orm";
import { resolvedEvents, studentStaffProfiles, swipeLogs } from "../../../db/schema";
import { db } from "../../server";


export const resolveSwipeLogs = async () => {
    try {
        const batchSize = 1000;
        let offset = 0;

        while (true) {
            const swipes = await db.select().from(swipeLogs).limit(batchSize).offset(offset);
            if (swipes.length === 0) break;
            console.log(`swipes length: `, swipes.length);
            let i=1;

            for (const swipe of swipes) {
                const [profile] = await db.select().from(studentStaffProfiles).where(eq(studentStaffProfiles.cardId, swipe.cardId)).limit(1);
                if (profile) {
                    await db
                        .insert(resolvedEvents)
                        .values({
                            entityId: profile.entityId,
                            sourceTable: "swipe_logs",
                            sourceRecordId: String(swipe.id),
                            eventTime: swipe.swipeTime,
                            locationId: swipe.locationId
                        })
                }

                console.log(`inserted profile for ${i}`);
                i++;
            };

            offset += batchSize;
        };

        console.log("✅ Deterministic matching complete for swipe_logs");
        const rows = await db.select().from(resolvedEvents);
        console.log('rows: ', rows);
    } catch (error) {
        console.error('error while resolving swipe logs: ', error);
        return;
    };
};

resolveSwipeLogs();