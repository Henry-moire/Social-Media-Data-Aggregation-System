import { Form, redirect, type MetaFunction } from "react-router";
import type { Route } from "./+types/login";
import { createUserSession, getUserId } from "~/services/session.server";
import { supabase } from "~/supabase-client";

export const meta: MetaFunction = () => {
  return [
    { title: "Login" },
    { name: "description", content: "Welcome to React Router!" },
  ];
};

export async function loader({ request }: Route.LoaderArgs) {
  // Check if the user is already logged in
  const userId = await getUserId(request);
  if (userId) {
    return redirect("/");
  }

}

export async function action({ request }: Route.ActionArgs) {
  let response: Response;
  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    // Query the Users table for a matching user
    const { data: users, error: fetchError } = await supabase
      .from("Users")
      .select("*")
      .eq("email", email)
      .eq("password", password); // 🔴 Reminder: plain text passwords = not secure!

    if (fetchError) {
      return { error: fetchError.message };
    }

    if (!users || users.length === 0) {
      return { error: "Invalid email or password" };
    }

    const user = users[0];


    // Create a session
    response = await createUserSession({
      request,
      userId: user.id, // or user.email if you're not using UUIDs
      remember: true,
      name: user.name,
    });
    console.log("The name is " + user.name);


    if (!response) {
      throw new Error("An error occurred while creating the session");
    }
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: "An unknown error occurred" };
  }
  
  throw response;
}

export default function Login({ actionData }: Route.ComponentProps) {
  return (
    <div className="max-w-md mx-auto mt-12 bg-white shadow-md rounded px-8 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600">Login</h2>

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
            name="email"
            type="email"
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Login
        </button>
      </Form>
    </div>
  );
}
