import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useLogin } from "@/hooks/useAuth";
import { LoginInput, loginSchema } from "@/validations/schemas";

import InputPassword from "./ui/InputPassword";

const LoginForm = () => {
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          className="py-2 px-1 mt-1 block w-full rounded border border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <InputPassword
          {...register("password")}
          className="py-2 px-1 mt-1 block w-full rounded border border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {loginMutation.error && (
        <p className="text-sm text-red-600">{loginMutation.error.message}</p>
      )}

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {loginMutation.isPending ? "Loading..." : "Sign In"}
      </button>
    </form>
  );
};

export default LoginForm;
