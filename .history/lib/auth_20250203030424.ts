import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        user: 'postgres',
        host: 'localhost',
        database: '',
        password: 'duresaguye4372!',
        port: 5432, 
    })
});