"use client";

import { FaArrowRight } from "react-icons/fa6";
import { subscribeToNewsletter } from "@/app/actions/newsletter";
import { footer } from "@/data/site";
import { useValidatedForm } from "@/hooks/useValidatedForm";
import { EMAIL_MAX_LENGTH, HONEYPOT_FIELD } from "@/lib/formState";
import { FormStatusMessage } from "@/components/ui/FormStatusMessage";

const { newsletter } = footer;
const EMAIL_INPUT_ID = "newsletter-email";

export function NewsletterForm() {
  const { formRef, handleSubmit, isSending, status } = useValidatedForm(subscribeToNewsletter);

  return (
    <form ref={formRef} noValidate onSubmit={handleSubmit} className="w-full">
      <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <label htmlFor={EMAIL_INPUT_ID} className="text-label text-muted">
        {newsletter.emailField.label}
      </label>
      <div className="mt-3 flex items-center gap-3 border-b border-line transition-colors focus-within:border-fg">
        <input
          id={EMAIL_INPUT_ID}
          type="email"
          name="email"
          required
          autoComplete="email"
          maxLength={EMAIL_MAX_LENGTH}
          placeholder={newsletter.emailField.placeholder}
          className="min-w-0 flex-1 bg-transparent py-4 text-lg text-fg outline-none placeholder:text-muted/60"
        />
        <button
          type="submit"
          disabled={isSending}
          className="group inline-flex shrink-0 cursor-pointer items-center gap-3 rounded-full bg-accent px-5 py-3 text-label text-on-accent transition duration-500 ease-out-expo hover:bg-fg hover:text-bg disabled:cursor-wait disabled:opacity-70"
        >
          {isSending ? newsletter.sendingLabel : newsletter.submitLabel}
          <FaArrowRight aria-hidden className="size-3 transition-transform duration-500 group-hover:translate-x-1" />
        </button>
      </div>
      <FormStatusMessage status={status} isSending={isSending} messages={newsletter} className="mt-4" />
    </form>
  );
}
