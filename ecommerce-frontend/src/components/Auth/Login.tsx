import AuthForm from "./AuthForm";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <AuthForm type="login" />
    </div>
  );
};

export default LoginPage;
