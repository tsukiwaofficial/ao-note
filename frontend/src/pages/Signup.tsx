import { Link, Navigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Form } from "../components/ui/Form";
import Section from "../layouts/Section";
import { FaUser, FaLock, FaEyeSlash, FaEye } from "react-icons/fa6";
import { useUserSignup } from "../features/user/useUserSignup";
import { useAuthContext } from "../features/user/useAuthContext";
import { useState } from "react";
import AuthBanner from "../components/AuthBanner";
import AoNoteError from "../components/AoNoteError";

export default function Signup() {
  const { userData, setUserData, error, errorFields, isLoading, signup } =
    useUserSignup();
  const { state: user } = useAuthContext();
  const [showPassword, setShowPassword] = useState<{
    pass: boolean;
    confirmPass: boolean;
  }>({ pass: false, confirmPass: false });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await signup(userData.username, userData.password);
  };

  const handleShowPasswordToggle = (field: "pass" | "confirmPass") => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  if (user.role !== "user")
    return (
      <Section>
        <div
          className={`overflow-hidden relative grid grid-cols-4 rounded-xl shadow-xl ${error && "animate-shake"}`}
        >
          <AuthBanner page="signup" mode="display" className="order-2" />
          <AuthBanner page="signup" mode="background" />
          <Form
            onSubmit={handleSignup}
            variant="login"
            className="flex flex-col col-span-2"
          >
            <h3 className="mb-20 text-center">Sign Up</h3>
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
                    className="w-full rounded-none px-10 py-4 bg-transparent outline-none autofill:bg-transparent"
                    value={userData.username}
                    onChange={handleInputChange}
                    autoFocus
                  />
                </span>
              </div>
              <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <span
                  className={`relative flex items-center border-b-2 ${errorFields.includes("password") ? "border-error" : "border-gray-400"} transition-colors`}
                >
                  <FaLock className="absolute text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword.pass ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    className="w-full rounded-none px-10 py-4 bg-transparent outline-none autofill:bg-transparent"
                    value={userData.password}
                    onChange={handleInputChange}
                  />
                  <span
                    className="ml-auto cursor-pointer p-4 text-2xl opacity-50 hover:opacity-100 transition-opacity"
                    onClick={() => handleShowPasswordToggle("pass")}
                  >
                    {showPassword.pass ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </span>
              </div>
              <div className="flex flex-col">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <span
                  className={`relative flex items-center border-b-2 ${errorFields.includes("confirmPassword") ? "border-error" : "border-gray-400"} transition-colors`}
                >
                  <FaLock className="absolute text-gray-400 pointer-events-none" />
                  <input
                    type={showPassword.confirmPass ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className="w-full rounded-none px-10 py-4 bg-transparent outline-none autofill:bg-transparent"
                    value={userData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <span
                    className="ml-auto cursor-pointer p-4 text-2xl opacity-50 hover:opacity-100 transition-opacity"
                    onClick={() => handleShowPasswordToggle("confirmPass")}
                  >
                    {showPassword.confirmPass ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </span>
              </div>
              <AoNoteError error={error} />
            </div>
            <Button
              type="submit"
              variant="cta"
              disabled={isLoading}
              className={`rounded-full w-full ${isLoading && "cursor-progress"}`}
            >
              {isLoading ? "Please wait" : "Sign Up"}
            </Button>
            <div className="my-auto h-max text-base text-center">
              Already have an account to Ao Note?{" "}
              <Link
                to="/login"
                className="font-semibold text-primary underline"
              >
                Click here to Login!
              </Link>
            </div>
          </Form>
        </div>
      </Section>
    );
  else return <Navigate to="/" />;
}
