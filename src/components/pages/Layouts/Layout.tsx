import { Outlet } from "react-router";
import { Header } from "@/components/custom/header";

export default function Layout() {
  return (
    <div className="w-full h-full bg-black text-white">
      <Header />

      {/* Контент страниц */}
      <Outlet />
    </div>
  );
}
