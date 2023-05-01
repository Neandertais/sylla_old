import { Outlet } from "react-router-dom";

import Header from "@components/Header";

export default function Layout() {
  return (
    <>
      <Header />
      <main className="px-8">
        <Outlet />
      </main>
    </>
  );
}
