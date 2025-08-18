import NavbarDesktop from "./navbar-desktop";
import NavbarMobile from "./navbar-mobile";
import Sidebar from "./sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Sidebar />
      <div className="lg:pl-72">
        <NavbarDesktop />
        <NavbarMobile />
        <main>{children}</main>
      </div>
    </div>
  );
}
