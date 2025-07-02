import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("register", "routes/register.tsx"),
    route("profile", "routes/profile.tsx"),
    route("auth/reddit/callback", "routes/reddit-callback.tsx"),
] satisfies RouteConfig;
