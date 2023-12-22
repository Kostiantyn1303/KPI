"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res && !res.error) {
      router.push("/");
    } else {
      console.log(res);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input type="email" name="email" required />
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        required
      />
      <button type="button" onClick={handleTogglePassword}>
        {showPassword ? "Hide" : "Show"} Password
      </button>
      <button type="submit">Sign In</button>
    </form>
  );
};

export { SignInForm };
