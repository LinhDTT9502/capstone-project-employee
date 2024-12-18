import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { authenticateUser } from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import logo from "./2sport_logo.png";

function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (user) {
            if (user.role === "Admin") {
                navigate("/admin/dashboard");
            } else if (user.role === "Coordinator") {
                navigate("/coordinator/assign-orders");
            } else if (user.role === "BranchStaff") {
                navigate("/staff/list-orders");
            } else if (user.role === "Manager") {
                navigate("/manager/list-staffs");
            } else if (user.role === 'ContentStaff') {
                navigate('/content-staff/blogs');
            } else {
                
                navigate('/');
                dispatch(logout());
                localStorage.clear();
            }
        }
    }, [user, navigate]);

    const onSubmit = async (data) => {
        console.log(data);
        try {
            const decoded = await authenticateUser(dispatch, data);
            if (decoded.role === "Admin") {
                navigate("/admin/dashboard");
            } else if (decoded.role === "Coordinator") {
                navigate("/coordinator/assign-orders");
            } else if (decoded.role === "BranchStaff") {
                navigate("/staff/list-orders");
            } else if (decoded.role === "Owner") {
                navigate("/owner/dashboard");
            } else if (decoded.role === "Manager") {
                navigate("/manager/list-staffs");
            } else if (decoded.role === 'ContentStaff') {
                navigate('/content-staff/blogs');
            } else {
                console.error("Unknown role:", decoded.role);
                navigate('/');
                dispatch(logout());
                localStorage.clear();
                alert("Bạn không có quyền truy cập vào trang này");
            }
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <style>
                {`
                @keyframes fade {
                    0%, 100% {
                        opacity: 0.5;
                    }
                    50% {
                        opacity: 1;
                    }
                }

                .animate-fade {
                    animation: fade 3s infinite;
                }
                `}
            </style>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-blue-500 opacity-30"></div>
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiPjwvcmVjdD4KPC9zdmc+')] opacity-10"></div>
                    <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-transparent to-blue-600 opacity-20"></div>
                </div>

                <div className="w-full max-w-md px-8 py-10 bg-white rounded-2xl shadow-2xl z-10 transform transition duration-500 ease-in-out hover:scale-105 border border-blue-200">
                    <div className="flex flex-col items-center mb-8">
                        <img
                            src={logo}
                            alt="2Sport Logo"
                            className="w-24 mb-4 animate-fade"
                        />
                        <h2 className="text-3xl font-bold text-blue-600 mb-2 text-center">2 Sport Employees</h2>
                        <p className="text-blue-500 text-center">Admin Portal</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="transform transition duration-300 ease-in-out hover:scale-105">
                            <div className="relative">
                                <FontAwesomeIcon icon={faUser} className="absolute top-3 left-3 text-blue-500" />
                                <input
                                    id="username"
                                    type="text"
                                    {...register("userName", {
                                        required: true,
                                        // maxLength: 20,
                                        // pattern: /^[a-zA-Z0-9_]+$/,
                                    })}
                                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-blue-50 border border-blue-300 text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Username"
                                />
                            </div>
                            {errors.userName && (
                                <p className="mt-1 text-red-500 text-sm">{errors.userName.type === 'required' ? 'Username is required' : 'Invalid username format'}</p>
                            )}
                        </div>

                        <div className="transform transition duration-300 ease-in-out hover:scale-105">
                            <div className="relative">
                                <FontAwesomeIcon icon={faKey} className="absolute top-3 left-3 text-blue-500" />
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    {...register("password", { required: "Password is required" })}
                                    className="w-full pl-10 pr-10 py-2 rounded-lg bg-blue-50 border border-blue-300 text-blue-800 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={togglePasswordVisibility}
                                >
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEyeSlash : faEye}
                                        className="text-blue-500 hover:text-blue-700 transition-colors duration-200"
                                    />
                                </button>
                            </div>
                            {errors.password && <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Đăng nhập
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default SignIn;

