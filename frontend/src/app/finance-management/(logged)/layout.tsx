import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

export default function LoggedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      <Header/>
      <div className="flex h-screen overflow-hidden">
        <Sidebar/>
        <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
          {children}
        </div>
      </div>
    </section>
  )
  
}
