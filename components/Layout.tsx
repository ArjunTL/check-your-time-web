import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow bg-white">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
