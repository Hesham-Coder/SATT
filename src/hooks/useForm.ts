"use client";

import type { FormEvent } from "react";

import { useMemo, useState } from "react";

type FormValues = {
  email: string;
  message: string;
  name: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;
type SubmitStatus = "idle" | "success";

const initialValues: FormValues = {
  email: "",
  message: "",
  name: "",
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "الاسم مطلوب.";
  }

  if (!values.message.trim()) {
    errors.message = "الرسالة مطلوبة.";
  }

  return errors;
}

export function useForm() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle");

  const isValid = useMemo(
    () => Object.keys(validate(values)).length === 0,
    [values],
  );

  function handleChange(field: keyof FormValues, value: string) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    setErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });

    if (submitStatus === "success") {
      setSubmitStatus("idle");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmitStatus("idle");
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    setIsSubmitting(false);
    setSubmitStatus("success");
    setValues(initialValues);
    setErrors({});
  }

  return {
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    isValid,
    submitStatus,
    values,
  };
}
