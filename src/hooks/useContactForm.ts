"use client";

import type { FormEvent } from "react";

import { useState } from "react";
import { submitContactForm } from "@/app/actions/contact";

type FormValues = {
  email: string;
  message: string;
  name: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;
type SubmitStatus = "idle" | "success" | "error";
type ValidationMessages = {
  nameRequired?: string;
  emailRequired?: string;
  emailInvalid?: string;
  messageRequired?: string;
};

const initialValues: FormValues = {
  email: "",
  message: "",
  name: "",
};

const defaultValidationMessages = {
  nameRequired: "Name is required",
  emailRequired: "Email is required",
  emailInvalid: "Invalid email address",
  messageRequired: "Message is required",
};

export function useContactForm(validationMessages: ValidationMessages = {}) {
  const messages = { ...defaultValidationMessages, ...validationMessages };
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function validate(formValues: FormValues): FormErrors {
    const nextErrors: FormErrors = {};
    if (!formValues.name.trim()) nextErrors.name = messages.nameRequired;
    if (!formValues.email.trim()) {
      nextErrors.email = messages.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      nextErrors.email = messages.emailInvalid;
    }
    if (!formValues.message.trim()) nextErrors.message = messages.messageRequired;
    return nextErrors;
  }

  function handleChange(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field];
        return next;
      });
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage(null);

    try {
      const result = await submitContactForm(values);
      if (result.success) {
        setSubmitStatus("success");
        setValues(initialValues);
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || "Submission failed");
      }
    } catch {
      setSubmitStatus("error");
      setErrorMessage("A network error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    submitStatus,
    errorMessage,
    values,
  };
}

