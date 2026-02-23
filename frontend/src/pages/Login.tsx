import { useState } from "react";
import { useAuthContext } from "../features/user/useAuthContext";
import { useUserLogin } from "../features/user/useUserLogin";
import Section from "../layouts/Section";
import { Link, Navigate } from "react-router-dom";
import { Form } from "../components/ui/Form";
import { FaUser } from "react-icons/fa";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa6";
import { Button } from "../components/ui/Button";
import AuthBanner from "../components/AuthBanner";
import Error from "../components/Error";

export default function Login() {
  const { userData, setUserData, error, errorFields, isLoading, login } =
    useUserLogin();
  const { state: user } = useAuthContext();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await login(userData.username, userData.password);
  };

  const handleShowPasswordToggle = () => {
    setShowPassword((prevState) => !prevState);
  };

  if (user.role !== "user")
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
                    value={userData.username}
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
                    value={userData.password}
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
              <Error error={error} />
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
