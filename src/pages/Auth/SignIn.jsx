import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { authenticateUser } from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";

function SignIn() {
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user); // Select user from Redux state

    useEffect(() => {
        if (user) {
            // Redirect based on user role if already authenticated
            if (user.role === "Admin") {
                navigate("/admin/dashboard");
            } else if (user.role === "Order Coordinator") {
                navigate("/coordinator/assign-orders");
            } else if (user.role === "Staff") {
                navigate("/staff/list-orders");
            } else if (user.role === "Manager") {
                navigate("/manager/list-staffs");
            } else if (user.role === 'Content Staff') {
                navigate('/content-staff/blogs');
            }
        }
    }, [user, navigate]);

    const onSubmit = async (data) => {
        console.log(data);
        try {
            const decoded = await authenticateUser(dispatch, data);
            if (decoded.role === "Admin") {
                navigate("/admin/dashboard");
            } else if (decoded.role === "Order Coordinator") {
                navigate("/coordinator/assign-orders");
            } else if (decoded.role === "Staff") {
                navigate("/staff/list-orders");
            } else if (decoded.role === "Manager") {
                navigate("/manager/list-staffs");
            } else if (decoded.role === 'Content Staff') {
                navigate('/content-staff/blogs');
            } else {
                console.error("Unknown role:", decoded.role);
                navigate('/');
                dispatch(logout());
                localStorage.clear();
                alert("You don't have permission to access this page.");
            }
        } catch (error) {
            console.error("Login failed", error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex backdrop-blur-lg bg-gradient-to-r from-blue-200 to-blue-700 items-center justify-center h-screen ">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded shadow-md w-80 space-y-2"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">2 Sport Employees</h2>

                <div className="flex items-center ">
                    <label className="block pr-2 text-gray-700" htmlFor="username">
                        <FontAwesomeIcon icon={faUser} />
                    </label>
                    <input
                        id="username"
                        type="text"
                        {...register("userName", {
                            required: true,
                            maxLength: 20,
                            pattern: /^[a-zA-Z0-9_]+$/,
                        })}
                        className={`mt-1 block w-full p-2 border ${errors.userName ? 'border-red-500' : 'border-gray-300'} rounded`}
                    />
                </div>
                {errors.userName && (
                    <p className="text-red-400 text-sm italic">{errors.userName.message}</p>
                )}

                <div className="flex items-center pb-4">
                    <label className="block pr-2 text-gray-700" htmlFor="password">
                        <FontAwesomeIcon icon={faKey} />
                    </label>
                    <div className="relative w-full">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            {...register("password", { required: "Password is required" })}
                            className={`mt-1 block w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded`}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className="cursor-pointer text-orange-400"
                                onClick={togglePasswordVisibility}
                            />
                        </div>
                    </div>
                </div>
                {errors.password && <p className="pb-4 text-red-500 text-xs mt-1">{errors.password.message}</p>}

                <button
                    type="submit"
                    className="w-2/5 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Đăng nhập
                </button>
            </form>
        </div>
    );
}

export default SignIn;