import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        lazy: async () => {
            const { default: SignUp } = await import("../pages/auth/signup/SignUp");
            return { Component: SignUp };
        },
    },
    {
        path: "/signup",
        lazy: async () => {
            const { default: SignUp } = await import("../pages/auth/signup/SignUp");
            return { Component: SignUp };
        },
    },
    {
        path: "/signin",
        lazy: async () => {
            const { default: SignIn } = await import("../pages/auth/signin/SignIn");
            return { Component: SignIn };
        },
    },
    {
        path: "/user/dashboard",
        lazy: async () => {
            const { default: UserDashboard } = await import("../pages/user/UserDashboard");
            return { Component: UserDashboard };
        },
    },
    {
        path: "/user/riwayat-lamaran",
        lazy: async () => {
            const { default: RiwayatLamaran } = await import("../pages/user/RiwayatLamaran");
            return { Component: RiwayatLamaran };
        },
    },
    {
        path: "/admin",
        lazy: async () => {
            const { default: AdminDashboard } = await import("../pages/admin/AdminDashboard");
            return { Component: AdminDashboard };
        },
    },
    {
        path: "/admin/create-lowongan",
        lazy: async () => {
            const { default: CreateLowongan } = await import("../pages/admin/CreateLowongan");
            return { Component: CreateLowongan };
        },
    },
    {
        path: "/admin/edit-lowongan/:id",
        lazy: async () => {
            const { default: EditLowongan } = await import("../pages/admin/EditLowongan");
            return { Component: EditLowongan };
        },
    }
]);

export default router;

