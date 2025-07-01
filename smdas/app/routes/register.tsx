import { Form, redirect, type ActionFunctionArgs } from "react-router";
import { supabase } from "~/supabase-client";

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    
    if(!email || !password || !name) {
        return {error: "Missing data"};
    }

    const {data, error} = await supabase.from("Users").insert({name, password, email});

    if(error) {
        return {error: error.message};
    }

    return redirect("/login");
}

export default function Register() {
    return (
        <div>
            <h2>Register a new account</h2>
            <Form method = "post">
                <div>
                    <label> Email </label>
                    <input type="text" name="email" required/>
                </div>
                <div>
                    <label> password </label>
                    <input type="text" name="password" required/>
                </div>
                <div>
                    <label> Username </label>
                    <input type="text" name="name" required/>
                </div>
                <button type="submit">Create account</button>
            </Form>
        </div>
    );
}