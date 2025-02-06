import { auth } from "../../../../lib/auth"; 
import { headers } from "next/headers";
 
const session = await auth.api.getSession({
    headers: await headers() 
})