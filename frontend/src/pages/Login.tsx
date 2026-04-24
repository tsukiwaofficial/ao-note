import { useState, type SubmitEvent } from "react";
import Section from "../layouts/Section";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Form } from "../components/ui/Form";
import { FaUser } from "react-icons/fa";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa6";
import { Button } from "../components/ui/Button";
import AuthBanner from "../components/AuthBanner";
import AoNoteError from "../components/AoNoteError";
import { useAuthActions, useAuthRole } from "../features/user/useUserAuthStore";
import { useError } from "../hooks/useError";
import { useIsLoading } from "../hooks/useIsLoading";
import { useErrorFields } from "../hooks/useErrorFields";
import type { User } from "../features/user/user.types";
import { timer } from "../shared/utils/timer.util";

export default function Login() {
  const [data, setData] = useState<User>({ username: "", password: "" });
  const navigate = useNavigate();
  const role = useAuthRole();
  const { useLogin } = useAuthActions();
  const { error, setError } = useError();
  const { isLoading, setIsLoading } = useIsLoading();
  const { errorFields, setErrorFields } = useErrorFields();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleLogin = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsLoading(true);
    setErrorFields([]);

    const { response, result } = await useLogin(data);

    if (!response.ok) {
      setIsLoading(false);
      setError(result.message);
      if (result.error) setErrorFields([result.error]);

      await timer(3);
      setError("");

      return;
    }

    setIsLoading(false);
    setError("");
    setErrorFields([]);
    navigate("/");
  };

  const handleShowPasswordToggle = () => {
    setShowPassword((prevState) => !prevState);
  };

  if (role !== "user")
    return (
      <Section>
        <div
          className={`overflow-hidden relative grid grid-cols-4 rounded-xl shadow-xl ${error && "animate-shake"}`}
        >
          <AuthBanner page="login" mode="display" />
          <AuthBanner page="login" mode="background" />
          <Form
            onSubmit={handleLogin}
            variant="login"
            className="flex flex-col col-span-2"
          >
            <h3 className="mb-20 text-center">Login</h3>
            <div className="space-y-6">
              <div className="flex flex-col">
                <label htmlFor="username">Username</label>
                <span
                  className={`relative flex items-center border-b-2 ${errorFields.includes("username") ? "border-error" : "border-gray-400"} transition-colors`}
                >
                  <FaUser className="absolute text-gray-400 pointer-events-none" />
                  <input
                    type="username"
                    id="username"
                    name="username"
                    placeholder="Username"
                    className="w-full px-10 py-4 bg-transparent outline-none autofill:bg-transparent"
                    value={data.username}
                    onChange={handleInputChange}
                    autoFocus
                  />
                </span>
              </div>
              <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <div
                  className={`relative flex items-center border-b-2 ${errorFields.includes("password") ? "border-error" : "border-gray-400"}`}
                >
                  <FaLock className="absolute text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="w-full px-10 py-4 bg-transparent outline-none autofill:bg-transparent"
                    value={data.password}
                    onChange={handleInputChange}
                  />

                  <span
                    className="ml-auto cursor-pointer p-4 text-2xl opacity-50 hover:opacity-100 transition-opacity"
                    onClick={handleShowPasswordToggle}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>
              <AoNoteError error={error} />
            </div>
            <Button
              type="submit"
              variant="cta"
              disabled={isLoading}
              className={`rounded-full w-full ${isLoading && "cursor-progress"}`}
            >
              {isLoading ? "Please wait" : "Login"}
            </Button>
            <div className="my-auto h-max text-base text-center">
              Don't have an account to Ao Note?{" "}
              <Link
                to="/signup"
                className="font-semibold text-primary underline"
              >
                Click here to Sign Up!
              </Link>
            </div>
          </Form>
        </div>
      </Section>
    );
  else return <Navigate to="/" />;
}
