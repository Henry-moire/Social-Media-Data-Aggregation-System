import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Form, Link, type MetaFunction } from "react-router";
import { getUserId } from "~/services/session.server";
import { getUserName } from "~/services/session.server";
import { redirect } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  // Check if the user is already logged in
    const userId = await getUserId(request);
    const name = await getUserName(request);
    console.log(name);
    if (!userId) {
      throw redirect("/login");
    } else {
      return { userId, name };
    }

}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl">Welcome to the Socail Media Data Aggregation System</h1>
      <div className="mt-6">
        {loaderData?.userId ? (
          <div>
            <p className="mb-6">You are logged in {loaderData?.name}</p>
            <Form action="/logout" method="post">
              <button type="submit" className="border rounded px-2.5 py-1">
                Logout
              </button>
            </Form>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </div>
  );
}
