"use client";
import { ResourcePage } from "@neton/application-front-resource";
import { useT } from "@neton/application-front-runtime/i18n";
export default function Page() { const t = useT("member"); return <ResourcePage config={{ errorNamespace: "member", resourceKey: "member-tag", eyebrow: t("tag.eyebrow"), title: t("tag.title"), description: t("tag.description"), endpoint: "/member/tag", permissions: { page: "member:tag:query", create: "member:tag:create", update: "member:tag:update", delete: "member:tag:delete" }, fields: [{ key: "name", label: t("tag.field.name"), required: true }, { key: "createdAt", label: t("common.createdAt"), format: "date" }, { key: "name", label: t("tag.field.name"), filter: true, table: false }] }} />; }
