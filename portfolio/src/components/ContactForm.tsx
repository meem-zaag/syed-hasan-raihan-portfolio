"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { submitContactMessage } from "@/lib/api";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-colors focus:border-signal/50 focus:bg-white/[0.07]";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const subject = String(data.get("subject") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    const errors: Record<string, string> = {};
    if (!name) errors.name = "Please enter your name.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address.";
    }
    if (!message) errors.message = "Please enter a message.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setStatus("submitting");
    try {
      await submitContactMessage({ name, email, subject: subject || undefined, message });
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-signal/20 bg-signal/5 px-6 py-16 text-center"
      >
        <CheckCircle2 className="text-signal" size={36} />
        <h3 className="font-display text-lg font-medium text-foreground">
          Message sent
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thanks for reaching out — I&apos;ll get back to you as soon as I can.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 font-mono text-xs uppercase tracking-wide text-signal hover:underline"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-muted-foreground"
          >
            Name
          </label>
          <input id="name" name="name" type="text" className={inputClass} placeholder="Jane Doe" />
          {fieldErrors.name && (
            <p className="mt-1.5 text-xs text-destructive">{fieldErrors.name}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-muted-foreground"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={inputClass}
            placeholder="jane@example.com"
          />
          {fieldErrors.email && (
            <p className="mt-1.5 text-xs text-destructive">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="subject"
          className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-muted-foreground"
        >
          Subject <span className="normal-case text-muted-foreground/60">(optional)</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          className={inputClass}
          placeholder="Let's build something"
        />
      </div>

      <div>
        <label
          htmlFor="message"
          className="mb-1.5 block font-mono text-[11px] uppercase tracking-wide text-muted-foreground"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={inputClass}
          placeholder="Tell me a bit about your project or idea..."
        />
        {fieldErrors.message && (
          <p className="mt-1.5 text-xs text-destructive">{fieldErrors.message}</p>
        )}
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {errorMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-6 py-3.5 text-sm font-medium text-signal-foreground transition-transform hover:scale-[1.01] disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Sending...
          </>
        ) : (
          <>
            <Send size={16} /> Send message
          </>
        )}
      </button>
    </form>
  );
}
