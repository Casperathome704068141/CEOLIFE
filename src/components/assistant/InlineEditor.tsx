"use client";

import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { EditorSpec } from "@/lib/assistant/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function InlineEditor({
  form,
  onSubmit,
}: {
  form: EditorSpec;
  onSubmit?: (values: Record<string, string | number>) => void;
}) {
  const schema = z.object(
    form.fields.reduce<Record<string, z.ZodTypeAny>>((acc, field) => {
      let validator: z.ZodTypeAny = z.string();
      if (field.type === "number" || field.type === "currency") {
        validator = z
          .string()
          .min(1, "Required")
          .transform((value) => value.replace(/[^0-9.]/g, ""));
      }
      if (field.type === "date") {
        validator = z.string().min(1, "Required");
      }
      acc[field.id] = validator;
      return acc;
    }, {}),
  );

  const formHook = useForm<Record<string, string>>({
    resolver: zodResolver(schema),
    defaultValues: form.fields.reduce<Record<string, string>>((acc, field) => {
      const value = field.defaultValue ?? "";
      acc[field.id] = typeof value === "number" ? String(value) : (value as string);
      return acc;
    }, {}),
  });

  return (
    <Card className="border-slate-800 bg-slate-900/60">
      <CardHeader>
        <CardTitle className="text-sm text-slate-200">{form.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-4"
          onSubmit={formHook.handleSubmit((values) => {
            onSubmit?.(values);
          })}
        >
          {form.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label className="text-xs uppercase tracking-wide text-slate-400">
                {field.label}
              </Label>
              {renderField(field, formHook)}
            </div>
          ))}
          <div className="flex justify-end">
            <Button type="submit" size="sm">
              {form.submitLabel ?? "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function renderField(
  field: EditorSpec["fields"][number],
  formHook: UseFormReturn<Record<string, string>>,
) {
  const { register, setValue } = formHook;
  switch (field.type) {
    case "text":
      return (
        <Textarea
          {...register(field.id)}
          placeholder={field.placeholder}
          className="min-h-[80px] bg-slate-950/60 text-sm text-slate-100"
        />
      );
    case "number":
    case "currency":
      return (
        <Input
          {...register(field.id)}
          placeholder={field.placeholder}
          className="bg-slate-950/60 text-sm text-slate-100"
        />
      );
    case "date":
      return (
        <Input
          type="date"
          {...register(field.id)}
          className="bg-slate-950/60 text-sm text-slate-100"
        />
      );
    case "select":
      return (
        <Select
          onValueChange={(value) => {
            setValue(field.id, value);
          }}
          defaultValue={formHook.getValues(field.id)}
        >
          <SelectTrigger className="bg-slate-950/60 text-sm text-slate-100">
            <SelectValue placeholder={field.placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-slate-900/90 text-sm text-slate-100">
            {field.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    default:
      return (
        <Input
          {...register(field.id)}
          placeholder={field.placeholder}
          className="bg-slate-950/60 text-sm text-slate-100"
        />
      );
  }
}
