import { type RouteConfig, index, route, layout } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("post/:postId", "routes/post.tsx"),

    //Nested Routes
    layout("routes/dashboard.tsx", [
        route("finances", "routes/finances.tsx"),
        route("personal", "routes/personal.tsx")
    ]),
] satisfies RouteConfig;
