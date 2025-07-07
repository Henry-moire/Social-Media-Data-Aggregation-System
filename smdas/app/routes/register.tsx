/* import { Form, redirect, type ActionFunctionArgs } from "react-router";
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
} */

    import { Form, useActionData, redirect, type ActionFunctionArgs } from "react-router";
import { supabase } from "~/supabase-client";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return { error: "All fields are required." };
  }

  const { error } = await supabase.from("Users").insert({ name, password, email });

  if (error) {
    return { error: error.message };
  }

  return redirect("/login");
}

export default function Register() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="max-w-md mx-auto mt-12 bg-white shadow-md rounded px-8 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">
        Register a New Account
      </h2>

      {actionData?.error && (
        <div className="mb-4 text-red-600 bg-red-100 border border-red-300 p-2 rounded">
          {actionData.error}
        </div>
      )}

      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            name="password"
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="name"
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Create Account
        </button>
      </Form>
    </div>
  );
}
