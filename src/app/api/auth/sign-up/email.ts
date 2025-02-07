import { signUp  } from '../../../../../lib/auth-client'; // Assuming Better-Auth has a signUp method for user registration
import { supabase } from '../../../../../lib/supabaseClient'; // Supabase client initialization
import { NextApiRequest, NextApiResponse } from 'next';
import { User } from 'better-auth'; // Assuming Better-Auth has a User type

interface SignUpRequestBody {
    email: string;
    password: string;
}

interface SignUpResponse {
    user: User;
    error: { message: string } | null;
}

interface SupabaseInsertResponse {
    data: any;
    error: { message: string } | null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { email, password }: SignUpRequestBody = req.body; // Extract email and password from the request body

            // Ensure both email and password are provided
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required' });
            }

            // Step 1: Register the user using Better-Auth (replace with correct method if different)
            const { user, error: signUpError }: SignUpResponse = await signUp({ email, password });

            if (signUpError) {
                throw new Error(signUpError.message); // Handle any errors during sign-up
            }

            // Step 2: Store additional user details in Supabase (optional)
            const { data, error }: SupabaseInsertResponse = await supabase
                .from('users') // Replace with your own table name in Supabase
                .insert([{ email: user.email, user_id: user.id }]);

            if (error) {
                throw new Error(error.message);
            }

            // Return success response with user data
            return res.status(200).json({ message: 'User created and stored in Supabase', data });
        } catch (error: any) {
            // Catch and log any errors
            console.error('Error creating user:', error);
            return res.status(500).json({ error: error.message });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
}
