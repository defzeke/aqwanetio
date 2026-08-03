import TopHeader from "@/components/TopHeader";
import SideNavBar from "@/components/SideNavBar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopHeader />
      <SideNavBar />
      <main className="flex-1 ml-[280px] mt-16">{children}</main>
    </>
  );
}
