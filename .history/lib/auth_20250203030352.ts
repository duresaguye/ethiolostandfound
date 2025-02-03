import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        user: 'postgre',
        host: 'yourHost',
        database: 'yourDatabase',
        password: 'yourPassword',
        port: 5432, // default PostgreSQL port
    })
});