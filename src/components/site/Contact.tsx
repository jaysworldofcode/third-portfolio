"use client";

import type { ReactNode } from "react";
import { sendContactMessage } from "@/app/actions/contact";
import { contact, socialLinks } from "@/data/site";
import { useValidatedForm } from "@/hooks/useValidatedForm";
import { CONTACT_FIELD_LIMITS } from "@/lib/contactForm";
import { EMAIL_MAX_LENGTH, HONEYPOT_FIELD } from "@/lib/formState";
import { BUTTON_STYLES } from "@/components/ui/buttonStyles";
import { FormStatusMessage } from "@/components/ui/FormStatusMessage";
import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";

const { form } = contact;
const BAND_DURATION_S = 25;

const fieldClass =
  "w-full border-0 border-b border-line bg-transparent px-0 py-3 text-lg text-fg outline-none transition-colors placeholder:text-muted/60 focus:border-fg";

export function Contact() {
  const { formRef, handleSubmit, isSending, status } = useValidatedForm(sendContactMessage);

  return (
    <section id="contact" className="relative overflow-hidden border-t border-line bg-bg pb-28 text-muted md:pb-40">
      {contact.band.length > 0 && <ContactBand />}

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 pt-20 md:px-10 md:pt-28 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-5">
          <SectionHeading
            eyebrow={contact.eyebrow}
            title={contact.title}
            titleHighlight={contact.titleHighlight}
            description={contact.description}
            className="mb-12"
          />

          <Reveal className="space-y-8">
            {contact.methods.map(({ label, value, href, icon: Icon }) => (
              <div key={label} className="flex items-start gap-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-line text-accent-text">
                  <Icon aria-hidden className="size-4" />
                </span>
                <div>
                  <span className="block text-label">{label}</span>
                  {href ? (
                    <a
                      href={href}
                      className="mt-1 inline-block font-heading text-xl font-bold text-fg transition-colors hover:text-accent-text md:text-2xl"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="mt-1 block font-heading text-xl font-bold text-fg md:text-2xl">{value}</span>
                  )}
                </div>
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-12">
            <SocialLinks links={socialLinks} />
          </Reveal>
        </div>

        <Reveal delayMs={150} className="lg:col-span-7">
          <form
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
            className="space-y-8 rounded-3xl border border-line bg-surface p-8 md:p-12"
          >
            <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
            <div className="grid gap-8 sm:grid-cols-2">
              <Field label={form.nameField.label}>
                <input
                  type="text"
                  name="name"
                  placeholder={form.nameField.placeholder}
                  required
                  autoComplete="name"
                  maxLength={CONTACT_FIELD_LIMITS.name}
                  className={fieldClass}
                />
              </Field>
              <Field label={form.emailField.label}>
                <input
                  type="email"
                  name="email"
                  placeholder={form.emailField.placeholder}
                  required
                  autoComplete="email"
                  maxLength={EMAIL_MAX_LENGTH}
                  className={fieldClass}
                />
              </Field>
            </div>
            <Field label={form.subjectField.label}>
              <input
                type="text"
                name="subject"
                placeholder={form.subjectField.placeholder}
                maxLength={CONTACT_FIELD_LIMITS.subject}
                className={fieldClass}
              />
            </Field>
            <Field label={form.messageField.label}>
              <textarea
                name="message"
                rows={5}
                placeholder={form.messageField.placeholder}
                required
                maxLength={CONTACT_FIELD_LIMITS.message}
                className={`${fieldClass} resize-none`}
              />
            </Field>

            <button type="submit" disabled={isSending} className={`${BUTTON_STYLES.solid} w-full cursor-pointer`}>
              {isSending ? form.sendingLabel : form.submitLabel}
            </button>

            <FormStatusMessage status={status} isSending={isSending} messages={form} />
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/** The large scrolling "Let's talk" band that opens the section. */
function ContactBand() {
  return (
    <Marquee durationSeconds={BAND_DURATION_S} className="border-b border-line bg-accent py-8 text-on-accent md:py-12">
      {contact.band.map((phrase, index) => (
        <span key={`${phrase}-${index}`} className="flex items-center">
          <span className="px-8 font-heading text-6xl font-bold whitespace-nowrap md:px-12 md:text-9xl">{phrase}</span>
          <span aria-hidden className="size-4 rotate-45 bg-on-accent md:size-6" />
        </span>
      ))}
    </Marquee>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-label">{label}</span>
      {children}
    </label>
  );
}
