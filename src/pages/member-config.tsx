"use client";
import * as React from "react";
import { apiFetch, apiWrite } from "@neton/application-front-runtime/client";
import { useMutation, usePermission, useQuery, useQueryClient } from "@neton/application-front-runtime/client-context";
import { Button, Field, Input, PageHeader, Select } from "@neton/application-front-kit";
import { useT } from "@neton/application-front-runtime/i18n";

interface Config { pointTradeDeductEnable: number; pointTradeDeductUnitPrice: number; pointTradeDeductMaxPrice: number; pointTradeGivePoint: number }

export default function MemberConfigPage() {
  const t = useT("member");
  const client = useQueryClient();
  const canUpdate = usePermission("member:config:update");
  const query = useQuery({ queryKey: ["member-config"], queryFn: () => apiFetch<Config>("/admin/member/config/get") });
  const [form, setForm] = React.useState<Config | null>(null);
  React.useEffect(() => { if (query.data) setForm(query.data); }, [query.data]);
  const mutation = useMutation({ mutationFn: (value: Config) => apiWrite<void>("/admin/member/config/update", "PUT", value), onSuccess: async () => client.invalidateQueries({ queryKey: ["member-config"] }) });
  return <div className="space-y-4">
    <PageHeader eyebrow={t("config.eyebrow")} title={t("config.title")} description={t("config.description")} actions={<Button variant="outline" onClick={() => query.refetch()}>{t("common.refresh")}</Button>} />
    <section className="max-w-3xl rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      {query.isPending || !form ? <div className="text-sm text-[var(--muted-foreground)]">{t("config.loading")}</div> : <form className="grid gap-4 md:grid-cols-2" onSubmit={(event) => { event.preventDefault(); mutation.mutate(form); }}>
        <Field label={t("config.field.deductEnable")}><Select value={form.pointTradeDeductEnable} onChange={(event) => setForm({ ...form, pointTradeDeductEnable: Number(event.target.value) })}><option value="1">{t("common.enabled")}</option><option value="0">{t("common.disabled")}</option></Select></Field>
        <Field label={t("config.field.deductUnitPrice")}><Input type="number" min={0} value={form.pointTradeDeductUnitPrice} onChange={(event) => setForm({ ...form, pointTradeDeductUnitPrice: Number(event.target.value) })} /></Field>
        <Field label={t("config.field.deductMaxPrice")}><Input type="number" min={0} value={form.pointTradeDeductMaxPrice} onChange={(event) => setForm({ ...form, pointTradeDeductMaxPrice: Number(event.target.value) })} /></Field>
        <Field label={t("config.field.givePoint")}><Input type="number" min={0} value={form.pointTradeGivePoint} onChange={(event) => setForm({ ...form, pointTradeGivePoint: Number(event.target.value) })} /></Field>
        <div className="md:col-span-2 flex justify-end"><Button type="submit" disabled={!canUpdate || mutation.isPending}>{mutation.isPending ? t("common.saving") : t("config.action.save")}</Button></div>
      </form>}
    </section>
  </div>;
}
