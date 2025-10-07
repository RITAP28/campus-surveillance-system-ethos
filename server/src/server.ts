import express from 'express';
import { config } from './infra/activeConfig';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';

const app = express();
const port = config.PORT || 8000;

app.use(cors());
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "public")));

// initialise the database connection
const dbUrl = config.SUPABASE_DEV_CONNECTION_URL as string;
const client = postgres(dbUrl, { prepare: false });
export const db = drizzle({ client });

// function to test database connection-
async function testDatabaseConnection() {
    try {
        console.log("🔍 Testing database connection...");
        // Simple query to test connection
        const result = sql`SELECT 1 as test`;
        console.log("✅ Database connection successful");
        return true;
    } catch (error) {
        console.error('❌ Database connection failed: ', error);
        return false;
    }
}

// routes for APIs

// main server initialization
app.listen(port, async () => {
    try {
        console.log(`Server listening on port ${port}`);
        const dbConnected = await testDatabaseConnection();

        if (dbConnected) {
            console.log("✅ Server and Database are ready");
        } else {
            console.error("⚠️ Server started but database/redis connection failed");
        }
    } catch (error) {
        console.error("Error connecting to server: ", error);
    };
});