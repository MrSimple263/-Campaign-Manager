import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useRegister } from "@/hooks/useAuth";
import { RegisterInput, registerSchema } from "@/validations/schemas";

import InputPassword from "./ui/InputPassword";

const RegisterForm = () => {
  const registerMutation = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(data);
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
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          {...register("name")}
          type="text"
          className="py-2 px-1 mt-1 block w-full rounded border border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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
      <div>
        <label
          htmlFor="confirm_password"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <InputPassword
          {...register("confirm_password")}
          className="py-2 px-1 mt-1 block w-full rounded border border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.confirm_password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.confirm_password.message}
          </p>
        )}
      </div>

      {registerMutation.error && (
        <p className="text-sm text-red-600">{registerMutation.error.message}</p>
      )}

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {registerMutation.isPending ? "Loading..." : "Sign Up"}
      </button>
    </form>
  );
};
export default RegisterForm;
