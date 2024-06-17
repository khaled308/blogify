import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { login } from "../redux/authSlice";
import { SubmitHandler, useForm } from "react-hook-form";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error } = useSelector((state: RootState) => state.auth);

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      const result = await dispatch(login(data));
      if (result.meta.requestStatus === "fulfilled") {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <section className="py-16 xl:pb-56 bg-white overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center max-w-md mx-auto">
          <h2 className="mb-4 text-3xl md:text-7xl text-center font-bold font-heading tracking-px-n leading-tight">
            Login to your account
          </h2>
          <p className="mb-12 font-medium text-lg text-gray-600 leading-normal">
            Enter your details below.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="block mb-5">
              <input
                className="px-4 py-3.5 w-full text-gray-500 font-medium placeholder-gray-500 bg-white outline-none border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                type="email"
                placeholder="Enter Email"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-600">{errors.email.message}</span>
              )}
            </label>

            <label className="block mb-5">
              <input
                className="px-4 py-3.5 w-full text-gray-500 font-medium placeholder-gray-500 bg-white outline-none border border-gray-300 rounded-lg focus:ring focus:ring-indigo-300"
                type="password"
                placeholder="Enter your Password"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-red-600">{errors.password.message}</span>
              )}
            </label>

            <button
              className="mb-8 py-4 px-9 w-full text-white font-semibold border border-indigo-700 rounded-xl shadow-4xl focus:ring focus:ring-indigo-300 bg-indigo-600 hover:bg-indigo-700 transition ease-in-out duration-200"
              type="submit"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Logging in..." : "Login Account"}
            </button>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <p className="font-medium">
              <span className="m-2">Forgot Password?</span>
              <Link
                className="text-indigo-600 hover:text-indigo-700"
                to="/forgot-password"
              >
                Reset Password
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
