import { useState } from "react";
import { useForm } from "react-hook-form";
import { signUp } from "../lib/auth";
import { useAppStore } from "../store/useAppStore";
import { Button } from "@dopamind/ui";

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

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

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
    } catch (e: any) {
      setError(e.message ?? "Erro ao criar conta. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
          onClick={handleDismiss}
        />
      )}

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A24] rounded-t-3xl px-5 pt-6 pb-8 transition-transform duration-300"
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(100%)",
          paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        {/* Drag handle */}
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

        {success ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🎉</div>
            <p className="text-white font-semibold">Conta criada!</p>
            <p className="text-white/50 text-sm mt-1">Seu progresso está salvo.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-white text-xl font-bold">🔐 Salve seu progresso</h2>
              <p className="text-white/50 text-sm mt-2 leading-relaxed">
                Seus dados desaparecem se você limpar o navegador. Crie uma conta
                gratuita para protegê-los permanentemente.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <input
                {...register("email", { required: true })}
                type="email"
                placeholder="Seu e-mail"
                autoComplete="email"
                className="w-full bg-[#111118] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30"
              />
              <input
                {...register("password", { required: true, minLength: 8 })}
                type="password"
                placeholder="Senha (mínimo 8 caracteres)"
                autoComplete="new-password"
                className="w-full bg-[#111118] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/30"
              />
              {(errors.password?.type === "minLength") && (
                <p className="text-red-400 text-xs">Senha deve ter no mínimo 8 caracteres.</p>
              )}
              {error && <p className="text-red-400 text-xs">{error}</p>}

              <Button
                type="submit"
                size="lg"
                accentColor="#4499FF"
                loading={submitting}
                className="w-full mt-2"
              >
                Criar conta gratuita
              </Button>
            </form>

            <button
              onClick={handleDismiss}
              className="w-full text-center text-white/40 text-sm mt-4 py-2"
            >
              Agora não
            </button>
          </>
        )}
      </div>
    </>
  );
}
