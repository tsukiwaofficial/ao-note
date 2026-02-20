import { Link, Navigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Form } from "../../components/ui/Form";
import Section from "../../layouts/Section";
import { FaUser, FaLock } from "react-icons/fa6";
import { useUserSignup } from "./useUserSignup";
import { useAuthContext } from "./useAuthContext";
import { getNekosiaImage } from "../../shared/utils/get-nekosia.util";

const { image, source, tags, attribution } = await getNekosiaImage();

export default function UserSignup() {
  const { userData, setUserData, error, errorFields, isLoading, signup } =
    useUserSignup();
  const { state: user } = useAuthContext();

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

  if (user.role !== "user")
    return (
      <Section>
        <div
          className={`overflow-hidden relative grid grid-cols-4 rounded-xl shadow-xl ${error && "animate-shake"}`}
        >
          <Link
            to={source}
            target="_blank"
            className="col-span-2 h-230 order-1"
          >
            <img src={image} alt="" className="object-cover w-full h-full" />
          </Link>
          <img
            src={image}
            alt={tags}
            className="object-cover h-full w-full absolute -z-1"
          />
          <Form
            onSubmit={handleSignup}
            variant="login"
            className="flex flex-col col-span-2"
          >
            <h3 className="mb-20 text-center">Sign Up</h3>
            <div className="space-y-6">
              <div className="flex flex-col">
                <label htmlFor="username">Username</label>
                <span className="relative flex items-center">
                  <FaUser className="absolute text-gray-400 pointer-events-none" />
                  <input
                    type="username"
                    id="username"
                    name="username"
                    placeholder="Username"
                    className={`${errorFields.includes("username") ? "border-error" : "border-gray-400"} w-full border-b-2 rounded-none px-10 py-4 bg-transparent outline-none autofill:bg-transparent`}
                    value={userData.username}
                    onChange={handleInputChange}
                    autoFocus
                  />
                </span>
              </div>
              <div className="flex flex-col">
                <label htmlFor="password">Password</label>
                <span className="flex items-center">
                  <FaLock className="absolute text-gray-400 pointer-events-none" />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                    className={`${errorFields.includes("password") ? "border-error" : "border-gray-400"} w-full border-b-2 rounded-none px-10 py-4 bg-transparent outline-none autofill:bg-transparent`}
                    value={userData.password}
                    onChange={handleInputChange}
                  />
                </span>
              </div>
              <div className="flex flex-col">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <span className="flex items-center">
                  <FaLock className="absolute text-gray-400 pointer-events-none" />
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    className={`${errorFields.includes("confirmPassword") ? "border-error" : "border-gray-400"} w-full border-b-2 rounded-none px-10 py-4 bg-transparent outline-none autofill:bg-transparent`}
                    value={userData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </span>
              </div>
              <div
                className={`${error ? "opacity-100 rounded-lg text-error p-4 border-2 border-error bg-error/30 mb-4 h-max" : "h-0"} w-max transition-[opacity_height]`}
              >
                {error}
              </div>
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
            <div className="flex flex-col gap-5 items-center">
              <p className="text-sm text-right text-slate-600">
                {attribution.artist.profile && "Image by"}{" "}
                <Link
                  to={attribution.artist.profile}
                  target="_blank"
                  className="font-semibold text-primary underline"
                >
                  {attribution.artist.username && attribution.artist.username}
                </Link>
              </p>
              <p className="text-sm text-center text-slate-500">
                {attribution.copyright && attribution.copyright}
              </p>
            </div>
          </Form>
        </div>
      </Section>
    );
  else return <Navigate to="/" />;
}
