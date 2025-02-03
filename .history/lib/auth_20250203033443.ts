import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        connectionString: "postgres://user:password@localhost:5432/database"
    }),
    emailAndPassword: {    
        enabled: true
    }
});