export default function Home() {
  return (
    <div className="mx-auto flex h-full w-full max-w-7xl flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* {session && session.user.role.code === "SYS" && (
          <>
            <RoleDistributionChart />
            <LotStatusChart />
          </>
        )} */}
      </div>
    </div>
  );
}
