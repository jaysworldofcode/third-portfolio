import type { FormMessages } from "@/data/site";
import type { FormStatus } from "@/lib/formState";

type FormStatusMessageProps = {
  status: FormStatus;
  isSending: boolean;
  messages: Pick<FormMessages, "successMessage" | "errorMessage" | "failureMessage" | "rateLimitMessage">;
  className?: string;
};

const ERROR_MESSAGE_KEYS = {
  invalid: "errorMessage",
  "rate-limited": "rateLimitMessage",
  failed: "failureMessage",
} as const satisfies Partial<Record<FormStatus, keyof FormMessages>>;

const isErrorStatus = (status: FormStatus): status is keyof typeof ERROR_MESSAGE_KEYS => status in ERROR_MESSAGE_KEYS;

/** The result line under a form; hidden while a send is in progress so an old result doesn't linger. */
export function FormStatusMessage({ status, isSending, messages, className = "" }: FormStatusMessageProps) {
  if (isSending) return null;

  if (status === "success") {
    return (
      <p role="status" className={`animate-fade-in border border-accent-text/40 px-4 py-3 text-sm text-accent-text ${className}`}>
        {messages.successMessage}
      </p>
    );
  }

  if (isErrorStatus(status)) {
    return (
      <p role="alert" className={`animate-fade-in border border-danger/40 px-4 py-3 text-sm text-danger ${className}`}>
        {messages[ERROR_MESSAGE_KEYS[status]]}
      </p>
    );
  }

  return null;
}
