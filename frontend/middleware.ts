import { MiddlewareConfig, NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateAuth } from "./app/lib/validateAuth";
import { Middleware } from "next/dist/lib/load-custom-routes";


export const middleware = async (req: NextRequest) => {
    const cookieStore = await cookies();

    if(!cookieStore.get('access_token') || cookieStore.get('refresh_token')) {
        const url = req.nextUrl.clone(); 
        url.pathname = '/login';

        return NextResponse.rewrite(url);
    }

    const authData = await validateAuth();
    console.log("Middleware auth data:", authData);
    if (!authData || !authData.success) {
        const url = req.nextUrl.clone(); 
        url.pathname = '/login';

        return NextResponse.rewrite(url);
    }

}

export const config: MiddlewareConfig = {
    // matcher: "/profile/:path",
    matcher: "/profile/",
};