import Header from "../Header";
import Footer from "../Footer";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4 pt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
