"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { submitInquiry } from "./actions";

const formSchema = z.object({
  name: z.string().min(2, "Informe seu nome completo."),
  email: z.string().email("E-mail inválido."),
  phone: z.string().min(8, "Telefone inválido."),
  company: z.string().optional(),
  message: z.string().min(5, "Descreva o que você precisa."),
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", company: "", message: "" },
  });

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const result = await submitInquiry({
        name: values.name,
        email: values.email,
        phone: values.phone,
        company: values.company ?? "",
        message: values.message,
      });

      if (result.success) {
        toast.success("Mensagem enviada! Retornaremos em até 4h úteis.");
        reset();
      } else {
        toast.error(result.error ?? "Não foi possível enviar sua mensagem.");
      }
    });
  };

  const fieldClass =
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-ink placeholder:text-ink-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15";
  const labelClass = "block text-sm font-medium text-ink mb-1.5";
  const errorClass = "mt-1 text-xs text-red-600";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="tt-card p-8 md:p-10 grid gap-5"
      noValidate
    >
      <div>
        <h2 className="text-2xl mb-1">Solicite sua cotação</h2>
        <p className="text-sm text-ink-3">
          Responda em poucos campos — retornamos em até 4h úteis.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            Nome *
          </label>
          <input
            id="name"
            type="text"
            placeholder="Seu nome completo"
            className={fieldClass}
            {...register("name")}
          />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="company" className={labelClass}>
            Empresa
          </label>
          <input
            id="company"
            type="text"
            placeholder="Razão social ou nome fantasia"
            className={fieldClass}
            {...register("company")}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="email" className={labelClass}>
            E-mail *
          </label>
          <input
            id="email"
            type="email"
            placeholder="voce@empresa.com.br"
            className={fieldClass}
            {...register("email")}
          />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className={labelClass}>
            WhatsApp / Telefone *
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="(11) 99999-0000"
            className={fieldClass}
            {...register("phone")}
          />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          Descreva o que precisa *
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="Lista de itens, foto, código do fabricante, ou só me conta a aplicação."
          className={`${fieldClass} resize-y min-h-[120px]`}
          {...register("message")}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary btn-lg w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Enviando..." : <>Enviar cotação <span className="arrow">→</span></>}
      </button>
    </form>
  );
}
