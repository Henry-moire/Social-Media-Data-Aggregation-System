import { type MetaFunction } from "react-router";
import { redirect } from "react-router";
import type { Route } from "./+types/profile";
import { logout } from "../services/session.server";

export default function Profile() {
    return <div>Showing finances</div>
};

export async function action({ request }: Route.ActionArgs) {
  return logout(request);
}
