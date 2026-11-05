"use client";

import { startTransition, useActionState, useEffect, useRef, useState, type FormEvent } from "react";
import { INITIAL_FORM_STATE, type FormState, type FormStatus } from "@/lib/formState";

type FormAction = (previous: FormState, formData: FormData) => Promise<FormState>;

/**
 * Runs the browser's built-in validation before calling a server action, and clears the form
 * only after a successful send.
 */
export function useValidatedForm(action: FormAction) {
  const [serverState, formAction, isSending] = useActionState(action, INITIAL_FORM_STATE);
  const [hasInvalidInput, setHasInvalidInput] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const status: FormStatus = hasInvalidInput ? "invalid" : serverState.status;

  useEffect(() => {
    if (serverState.status === "success") formRef.current?.reset();
  }, [serverState]);

  // Submitted manually instead of via the form `action` prop, which would clear the fields even when sending fails.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const isValid = formElement.checkValidity();
    setHasInvalidInput(!isValid);
    if (isValid) startTransition(() => formAction(new FormData(formElement)));
  };

  return { formRef, handleSubmit, isSending, status };
}
