import dotenv from 'dotenv';
dotenv.config();

export const config = {
    // dev database connection strings
    SUPABASE_DEV_REST_URL: process.env.SUPABASE_DEV_REST_URL,
    SUPABASE_DEV_PASSWORD: process.env.SUPABASE_DEV_PASSWORD,
    SUPABASE_DEV_CONNECTION_URL: process.env.SUPABASE_DEV_CONNECTION_STRING,

    // prod database connection strings
    SUPABASE_PROD_REST_URL: '',
    SUPABASE_PROD_PASSWORD: '',
    SUPABASE_PROD_CONNECTION_URL: '',
    
    // port
    PORT: 8000,
    // NODE_ENV: 'production',
    NODE_ENV: 'development'
}