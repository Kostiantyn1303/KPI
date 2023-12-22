import { SignInForm } from "../../components/signinForm/SignInForm";
import { GoogleButton } from "@/components/GoogleButton/GoogleButton";
export default async function Signin() {
  return (
    <div className="stack">
      <h1>SignIn</h1>
      <GoogleButton />
      <div>or</div>
      <SignInForm />
    </div>
  );
}
