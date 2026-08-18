import Header from "@/components/common/Header";

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex min-h-0 flex-1 flex-col w-full h-full">{children}</main>
    </>
  );
}