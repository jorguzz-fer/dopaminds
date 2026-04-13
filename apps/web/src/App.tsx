import { useSession } from "./lib/auth";

export function App() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-slate-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold tracking-tight">
        Dopa<span className="text-indigo-400">Mind</span>
      </h1>
      <p className="text-lg text-slate-400">
        Reset consciente do sistema de recompensa cerebral
      </p>
      {session ? (
        <p className="text-sm text-slate-500">
          Sessão ativa: {session.user.id.slice(0, 8)}...
        </p>
      ) : (
        <p className="text-sm text-slate-500">Nenhuma sessão ativa</p>
      )}
    </div>
  );
}
