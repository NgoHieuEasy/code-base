
interface Props {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center  min-h-screen  ">
      {children}
    </div>
  );
};

export default AuthLayout;
