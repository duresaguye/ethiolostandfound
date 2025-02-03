import { betterAuth } from "better-auth";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        connectionString: "postgres://postgres:duresaguye4372!@localhost:5432/better-auth"
    }),
    emailAndPassword: {    
        enabled: true
    }
});