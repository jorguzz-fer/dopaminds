import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@dopamind/ui";
import { Lock, PartyPopper } from "lucide-react";
import { signUp } from "../lib/auth";
import { useAppStore } from "../store/useAppStore";

interface AccountUpgradeSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  email: string;
  password: string;
}

export function AccountUpgradeSheet({ isOpen, onClose }: AccountUpgradeSheetProps) {
  const { refreshUser } = useAppStore();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const handleDismiss = () => {
    localStorage.setItem("dopamind:upgrade_prompt_shown", "true");
    onClose();
  };

  const onSubmit = async (data: FormValues) => {
    setSubmitting(true);
    setError(null);
    try {
      await signUp.email({
        email: data.email,
        password: data.password,
        name: "DopaMind User",
      });
      await refreshUser();
      setSuccess(true);
      localStorage.setItem("dopamind:upgrade_prompt_shown", "true");
      setTimeout(onClose, 1200);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao criar conta. Tente novamente.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
          onClick={handleDismiss}
        />
      )}

      <div
        className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-md rounded-t-[32px] border-t border-white/10 bg-[var(--color-surface-2)]/95 px-5 pt-5 backdrop-blur-2xl transition-transform duration-300"
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/20" />

        {success ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-[0_10px_30px_-10px_rgba(147,51,234,0.55)]">
              <PartyPopper className="h-7 w-7" strokeWidth={1.75} />
            </div>
            <p className="text-lg font-semibold text-white">Conta criada!</p>
            <p className="mt-1 text-sm text-white/55">Seu progresso está salvo.</p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-violet-500/20 border border-violet-400/30 text-violet-200">
                <Lock className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Salve seu progresso</h2>
                <p className="mt-1 text-sm leading-relaxed text-white/55">
                  Seus dados desaparecem se você limpar o navegador. Crie uma conta gratuita
                  para protegê-los permanentemente.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="Seu e-mail"
                autoComplete="email"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-violet-400/40 focus:bg-white/[0.06] focus:outline-none"
              />
              <input
                {...register("password", { required: true, minLength: 8 })}
                type="password"
                placeholder="Senha (mínimo 8 caracteres)"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-violet-400/40 focus:bg-white/[0.06] focus:outline-none"
              />
              {errors.password?.type === "minLength" && (
                <p className="text-xs text-rose-300">
                  Senha deve ter no mínimo 8 caracteres.
                </p>
              )}
              {error && <p className="text-xs text-rose-300">{error}</p>}

              <Button type="submit" size="lg" fullWidth loading={submitting} className="mt-2">
                Criar conta gratuita
              </Button>
            </form>

            <button
              onClick={handleDismiss}
              className="mt-4 w-full py-2 text-center text-sm text-white/45 hover:text-white/70"
            >
              Agora não
            </button>
          </>
        )}
      </div>
    </>
  );
}
