import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router";
import { apiFetch } from "../../lib/api";
import { useAppStore } from "../../store/useAppStore";
import { Button } from "@dopamind/ui";
import { getPhaseColor } from "../../lib/phaseColors";
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
          ? "Você já fez check-in hoje! 👍"
          : "Erro ao salvar. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-white/60 text-xl"
          type="button"
        >
          ←
        </button>
        <h1 className="text-xl font-bold text-white">Check-in de hoje</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="px-4 space-y-6">
        {/* Mood */}
        <section>
          <h2 className="text-white/60 text-xs uppercase tracking-wider mb-3">
            Como você está?
          </h2>
          <Controller
            name="moodScore"
            control={control}
            render={({ field }) => (
              <MoodSelector
                value={field.value}
                onChange={field.onChange}
                phase={user.currentPhase}
              />
            )}
          />
        </section>

        {/* Urge level */}
        <section>
          <Controller
            name="urgeLevel"
            control={control}
            render={({ field }) => (
              <UrgeSlider
                value={field.value}
                onChange={field.onChange}
                phase={user.currentPhase}
              />
            )}
          />
        </section>

        {/* Triggers */}
        <section>
          <h2 className="text-white/60 text-xs uppercase tracking-wider mb-3">
            O que gerou urgência?
          </h2>
          <Controller
            name="urgeTriggers"
            control={control}
            render={({ field }) => (
              <TriggerGrid
                value={field.value}
                onChange={field.onChange}
                phase={user.currentPhase}
              />
            )}
          />
        </section>

        {/* Activities */}
        <section>
          <h2 className="text-white/60 text-xs uppercase tracking-wider mb-3">
            O que você fez de saudável?
          </h2>
          <Controller
            name="healthyActivities"
            control={control}
            render={({ field }) => (
              <ActivityList
                value={field.value}
                onChange={field.onChange}
                phase={user.currentPhase}
              />
            )}
          />
        </section>

        {/* Relapse */}
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

        {/* Reflection */}
        <section>
          <h2 className="text-white/60 text-xs uppercase tracking-wider mb-3">
            Reflexão (opcional)
          </h2>
          <div className="relative">
            <textarea
              {...register("reflection")}
              maxLength={500}
              rows={4}
              placeholder="Como foi seu dia? O que funcionou? O que foi difícil?"
              className="w-full bg-[#111118] border border-white/10 rounded-2xl p-4 text-white text-sm resize-none placeholder:text-white/30 focus:outline-none focus:border-white/30"
            />
            <span className="absolute bottom-3 right-3 text-white/30 text-xs">
              {watch("reflection")?.length ?? 0}/500
            </span>
          </div>
        </section>

        {/* Error */}
        {errorMsg && <p className="text-red-400 text-sm text-center">{errorMsg}</p>}

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          accentColor={getPhaseColor(user.currentPhase)}
          loading={submitting}
          className="w-full"
        >
          Registrar check-in
        </Button>
      </form>

      {/* Success toast */}
      {successToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#44CC88] text-black font-semibold px-6 py-3 rounded-full text-sm shadow-lg">
          ✓ Check-in registrado!
        </div>
      )}
    </div>
  );
}
