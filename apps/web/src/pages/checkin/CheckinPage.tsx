import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import { apiFetch } from "../../lib/api";
import { useAppStore } from "../../store/useAppStore";
import { Button, IconButton } from "@dopamind/ui";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import { MoodSelector } from "./components/MoodSelector";
import { UrgeSlider } from "./components/UrgeSlider";
import { TriggerGrid } from "./components/TriggerGrid";
import { ActivityList } from "./components/ActivityList";
import { RelapseSection } from "./components/RelapseSection";

interface CheckinFormValues {
  moodScore: number;
  urgeLevel: number;
  urgeTriggers: string[];
  healthyActivities: string[];
  relapse: boolean;
  relapseDuration: number | null;
  reflection: string;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-3 text-[11px] uppercase tracking-[0.22em] text-white/45 font-semibold">
      {children}
    </h2>
  );
}

export function CheckinPage() {
  const navigate = useNavigate();
  const store = useAppStore();
  const user = store.user;

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);

  const { control, handleSubmit, watch, register, setValue } = useForm<CheckinFormValues>({
    defaultValues: {
      moodScore: 3,
      urgeLevel: 5,
      urgeTriggers: [],
      healthyActivities: [],
      relapse: false,
      relapseDuration: null,
      reflection: "",
    },
  });

  const onSubmit = async (data: CheckinFormValues) => {
    setSubmitting(true);
    setErrorMsg(null);
    try {
      await apiFetch("/api/checkins", {
        method: "POST",
        body: JSON.stringify(data),
      });
      await store.refreshUser();
      setSuccessToast(true);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Erro ao salvar.";
      setErrorMsg(
        msg === "Já existe um check-in para hoje"
          ? "Você já fez check-in hoje!"
          : "Erro ao salvar. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-violet-400" />
      </div>
    );
  }

  const reflection = watch("reflection");

  return (
    <div className="flex min-h-screen flex-col pb-28">
      <header
        className="flex items-center gap-3 px-5 pt-4 pb-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 16px)" }}
      >
        <IconButton
          icon={<ArrowLeft strokeWidth={2.25} />}
          label="Voltar"
          onClick={() => navigate("/dashboard")}
          variant="default"
        />
        <div>
          <h1 className="text-xl font-semibold leading-tight text-white">Check-in</h1>
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">
            Como você está hoje
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-2 space-y-7 px-5">
        <section>
          <SectionTitle>Como você está?</SectionTitle>
          <Controller
            name="moodScore"
            control={control}
            render={({ field }) => (
              <MoodSelector value={field.value} onChange={field.onChange} phase={user.currentPhase} />
            )}
          />
        </section>

        <section>
          <Controller
            name="urgeLevel"
            control={control}
            render={({ field }) => (
              <UrgeSlider value={field.value} onChange={field.onChange} phase={user.currentPhase} />
            )}
          />
        </section>

        <section>
          <SectionTitle>O que gerou urgência?</SectionTitle>
          <Controller
            name="urgeTriggers"
            control={control}
            render={({ field }) => (
              <TriggerGrid value={field.value} onChange={field.onChange} phase={user.currentPhase} />
            )}
          />
        </section>

        <section>
          <SectionTitle>O que você fez de saudável?</SectionTitle>
          <Controller
            name="healthyActivities"
            control={control}
            render={({ field }) => (
              <ActivityList value={field.value} onChange={field.onChange} phase={user.currentPhase} />
            )}
          />
        </section>

        <Controller
          name="relapse"
          control={control}
          render={({ field }) => (
            <RelapseSection
              value={field.value}
              onChange={field.onChange}
              relapseDuration={watch("relapseDuration")}
              onRelapseDurationChange={(v) => setValue("relapseDuration", v)}
            />
          )}
        />

        <section>
          <SectionTitle>Reflexão (opcional)</SectionTitle>
          <div className="relative">
            <textarea
              {...register("reflection")}
              maxLength={500}
              rows={4}
              placeholder="Como foi seu dia? O que funcionou? O que foi difícil?"
              className="w-full resize-none rounded-3xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white placeholder:text-white/30 focus:border-violet-400/40 focus:bg-white/[0.06] focus:outline-none"
            />
            <span className="absolute bottom-3 right-4 text-[11px] text-white/35 tabular-nums">
              {reflection?.length ?? 0}/500
            </span>
          </div>
        </section>

        {errorMsg && (
          <p className="text-center text-sm text-rose-300">{errorMsg}</p>
        )}

        <Button type="submit" size="lg" fullWidth loading={submitting}>
          <Sparkles className="h-4 w-4" strokeWidth={2.25} />
          Registrar check-in
        </Button>
      </form>

      {successToast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-28 z-50 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/90 px-5 py-2.5 text-sm font-semibold text-black shadow-[0_10px_30px_-10px_rgba(16,185,129,0.6)] backdrop-blur animate-[fadeInUp_0.3s_ease-out_both]">
            <Check className="h-4 w-4" strokeWidth={2.75} />
            Check-in registrado!
          </div>
        </div>
      )}
    </div>
  );
}
