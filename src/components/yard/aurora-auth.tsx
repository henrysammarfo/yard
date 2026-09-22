import { useAuthActions } from "@convex-dev/auth/react";
import { useMutation } from "convex/react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Chrome,
  Circle,
  Eye,
  EyeOff,
  Github,
  type LucideIcon,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import { roleProfiles, useSession, type Role } from "@/lib/yard-session";

const HERO_VIDEO =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4";

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/**
 * Aurora-style two-column auth for YARD (password Convex Auth).
 * Branding is YARD; layout/motion/video match the Aurora Sign Up pattern.
 */
export function AuroraAuthPage() {
  const { signIn } = useAuthActions();
  const bootstrap = useMutation(api.organizations.bootstrap);
  const session = useSession();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };

  const [mode, setMode] = useState<"signIn" | "signUp">("signUp");
  const [role, setRole] = useState<Role>("owner");
  const [orgName, setOrgName] = useState("YARD Buyers Co");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [socialNote, setSocialNote] = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;
    const dest =
      search.redirect && search.redirect.startsWith("/")
        ? search.redirect
        : roleProfiles[session.role].home;
    void navigate({ to: dest });
  }, [session, navigate, search.redirect]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSocialNote(null);
    try {
      const fullName =
        [firstName, lastName].map((s) => s.trim()).filter(Boolean).join(" ") ||
        email.split("@")[0] ||
        "Member";
      const form = new FormData();
      form.set("email", email.trim().toLowerCase());
      form.set("password", password);
      form.set("flow", mode);
      if (mode === "signUp") form.set("name", fullName);
      await signIn("password", form);
      if (mode === "signUp") {
        await bootstrap({ orgName: orgName.trim() || "YARD Org", role });
      } else {
        try {
          await bootstrap({ orgName: orgName.trim() || "YARD Org", role });
        } catch {
          /* already has membership */
        }
      }
      const dest =
        search.redirect && search.redirect.startsWith("/")
          ? search.redirect
          : roleProfiles[role].home;
      void navigate({ to: dest });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="aurora-auth flex min-h-screen w-full bg-black p-2 text-white antialiased selection:bg-white/30 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4">
      {/* Left — hero video */}
      <section className="relative hidden h-full w-[52%] flex-col items-center justify-end overflow-hidden rounded-3xl px-12 pb-32 shadow-2xl lg:flex">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/og.png"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <motion.div
          className="relative z-10 w-full max-w-xs space-y-8"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div className="flex items-center gap-2" variants={fadeUp}>
            <Circle className="size-5 fill-white text-white" aria-hidden />
            <span className="text-xl font-semibold tracking-tight">YARD</span>
          </motion.div>
          <motion.div className="space-y-3 text-center" variants={fadeUp}>
            <h1 className="whitespace-nowrap text-4xl font-medium tracking-tight">
              Join YARD
            </h1>
            <p className="px-4 text-sm leading-relaxed text-white/60">
              Follow these 3 quick phases to activate your buying workspace.
            </p>
          </motion.div>
          <motion.div className="space-y-3" variants={fadeUp}>
            <StepItem number={1} text="Register your identity" active />
            <StepItem number={2} text="Configure your workspace" />
            <StepItem number={3} text="Finalize your profile" />
          </motion.div>
        </motion.div>
      </section>

      {/* Right — form */}
      <section className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-4 py-12 sm:px-12 lg:overflow-hidden lg:px-16 lg:py-6 xl:px-24">
        <motion.div
          className="w-full max-w-xl space-y-8 sm:space-y-10 lg:space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <header className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-widest text-white/40 lg:hidden">
              YARD
            </p>
            <h2 className="text-3xl font-medium tracking-tight">
              {mode === "signUp" ? "Create New Profile" : "Welcome back"}
            </h2>
            <p className="text-sm text-white/40">
              {mode === "signUp"
                ? "Input your basic details to begin the journey."
                : "Sign in with your work email to open the live board."}
            </p>
          </header>

          <div className="grid grid-cols-2 gap-4">
            <SocialButton
              icon={Chrome}
              label="Google"
              onClick={() =>
                setSocialNote("Email and password signup is live for this build. Google arrives next.")
              }
            />
            <SocialButton
              icon={Github}
              label="Github"
              onClick={() =>
                setSocialNote("Email and password signup is live for this build. GitHub arrives next.")
              }
            />
          </div>

          <div className="relative flex items-center">
            <div className="h-px w-full border-t border-white/10" />
            <span className="absolute left-1/2 -translate-x-1/2 bg-black px-4 text-xs font-medium uppercase tracking-widest text-white/40">
              Or
            </span>
          </div>

          <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
            {mode === "signUp" && (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InputGroup
                    label="First Name"
                    placeholder="Ama"
                    type="text"
                    value={firstName}
                    onChange={setFirstName}
                    autoComplete="given-name"
                  />
                  <InputGroup
                    label="Last Name"
                    placeholder="Buyer"
                    type="text"
                    value={lastName}
                    onChange={setLastName}
                    autoComplete="family-name"
                  />
                </div>
                <InputGroup
                  label="Organization"
                  placeholder="YARD Buyers Co"
                  type="text"
                  value={orgName}
                  onChange={setOrgName}
                  required
                />
                <fieldset className="space-y-2">
                  <legend className="text-sm font-medium text-white">Role</legend>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {(Object.keys(roleProfiles) as Role[]).map((r) => (
                      <label
                        key={r}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 transition ${
                          role === r
                            ? "border-white bg-white text-black"
                            : "border-white/10 bg-brand-gray text-white hover:bg-white/5"
                        }`}
                      >
                        <input
                          type="radio"
                          className="mt-1"
                          name="role"
                          checked={role === r}
                          onChange={() => setRole(r)}
                        />
                        <span>
                          <strong className="block text-sm">{roleProfiles[r].label}</strong>
                          <small
                            className={`text-xs ${role === r ? "text-black/60" : "text-white/40"}`}
                          >
                            {roleProfiles[r].copy}
                          </small>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              </>
            )}

            <InputGroup
              label="Email"
              placeholder="you@company.com"
              type="email"
              value={email}
              onChange={setEmail}
              required
              autoComplete="email"
            />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-white">Password</label>
              <div className="relative">
                <input
                  className="h-11 w-full rounded-xl border-none bg-brand-gray px-4 pr-11 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  autoComplete={mode === "signUp" ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-white/40 hover:text-white"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <p className="text-[11px] text-white/35">Requires at least 8 symbols.</p>
            </div>

            {(error || socialNote) && (
              <p className="text-sm text-red-300" role="alert">
                {error ?? socialNote}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-4 h-14 w-full rounded-xl bg-white text-base font-semibold text-black transition hover:bg-white/90 active:scale-[0.98] disabled:opacity-60"
            >
              {busy
                ? "Working…"
                : mode === "signUp"
                  ? "Create Account"
                  : "Sign in"}
            </button>
          </form>

          <p className="text-center text-sm text-white/45">
            {mode === "signUp" ? (
              <>
                Member of the team?{" "}
                <button
                  type="button"
                  className="font-medium text-white underline-offset-4 hover:underline"
                  onClick={() => {
                    setMode("signIn");
                    setError(null);
                    setSocialNote(null);
                  }}
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                New here?{" "}
                <button
                  type="button"
                  className="font-medium text-white underline-offset-4 hover:underline"
                  onClick={() => {
                    setMode("signUp");
                    setError(null);
                    setSocialNote(null);
                  }}
                >
                  Create New Profile
                </button>
              </>
            )}
          </p>

          <p className="text-center text-xs text-white/25">
            <Link to="/" className="hover:text-white/50">
              ← Back to YARD
            </Link>
          </p>
        </motion.div>
      </section>
    </main>
  );
}

function StepItem({
  number,
  text,
  active = false,
}: {
  number: number;
  text: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 ${
        active
          ? "border border-white bg-white text-black"
          : "border-none bg-brand-gray text-white"
      }`}
    >
      <span
        className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold ${
          active ? "bg-black text-white" : "bg-white/10 text-white/40"
        }`}
      >
        {number}
      </span>
      <span className="text-sm font-medium tracking-tight">{text}</span>
    </div>
  );
}

function SocialButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-black text-sm font-medium text-white transition hover:bg-white/5"
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

function InputGroup({
  label,
  placeholder,
  type,
  value,
  onChange,
  required,
  autoComplete,
}: {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-white">{label}</label>
      <input
        className="h-11 w-full rounded-xl border-none bg-brand-gray px-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-white/20 focus:outline-none"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        autoComplete={autoComplete}
      />
    </div>
  );
}
