export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-green-700">Eco Pancasila</h1>
        <p className="text-sm text-muted-foreground">MGMP PPKn Kabupaten Sukabumi</p>
      </div>
      <div className="w-full max-w-md">{children}</div>
      <p className="mt-8 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Eco Pancasila — Guru Berdaya Digital, Siswa Berkarakter Pancasila
      </p>
    </div>
  );
}
