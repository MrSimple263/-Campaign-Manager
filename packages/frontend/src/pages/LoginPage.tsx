import { useState } from "react";

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";
import type { RootState } from "@/store";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/campaigns" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          {isRegister ? "Create Account" : "Sign In"}
        </h2>

        {!isRegister && <LoginForm />}
        {isRegister && <RegisterForm />}

        <p className="text-center text-sm text-gray-600">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-indigo-600 hover:text-indigo-500"
          >
            {isRegister ? "Sign In" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
