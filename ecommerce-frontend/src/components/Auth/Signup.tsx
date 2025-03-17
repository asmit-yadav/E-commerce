import AuthForm from "./AuthForm";

const SignupPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <AuthForm type="register" />
    </div>
  );
};

export default SignupPage;
