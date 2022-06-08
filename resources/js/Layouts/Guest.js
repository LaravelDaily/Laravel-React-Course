import {Outlet, Link} from "react-router-dom";

export default function Guest() {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
            <div>
                <Link to="/posts">
                    React Course
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
                <Outlet />
            </div>
        </div>
    )
}
