
export default function UnloggedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <section className={`text-black`}>
        <div className='min-h-screen min-w-screen bg-slate-100'>
          {children}
        </div>
      </section>
  )
}