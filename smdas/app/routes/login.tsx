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

    // Check the user's credentials
    // if (email !== "aaron@mail.com" || password !== "password") {
    //   throw new Error("Invalid email or password");
    // }

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
    });


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
    <div className="p-8 min-w-3/4 w-96">
      <h1 className="text-2xl">Login</h1>
      <Form method="post" className="mt-6 ">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row">
            <label className="min-w-24 ">Username:</label>
            <input className="flex-1" type="text" name="email" />
          </div>
          <div className="flex flex-row">
            <label className="min-w-24 ">Password:</label>
            <input className="flex-1" type="password" name="password" />
          </div>
          <div className="flex flex-row-reverse mt-4">
            <button type="submit" className="border rounded px-2.5 py-1 w-32">
              Login
            </button>
          </div>
          {actionData?.error ? (
            <div className="flex flex-row">
              <p className="text-red-600 mt-4 ">{actionData?.error}</p>
            </div>
          ) : null}
        </div>
      </Form>
    </div>
  );
}