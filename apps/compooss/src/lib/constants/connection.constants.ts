import type { AuthType } from "@compooss/types";

export const AUTH_METHODS: {
  value: AuthType;
  label: string;
  description: string;
}[] = [
  {
    value: "default",
    label: "Default",
    description: "No authentication or credentials in URI",
  },
  {
    value: "password",
    label: "Username / Password",
    description: "SCRAM-SHA-1 or SCRAM-SHA-256",
  },
  {
    value: "ldap",
    label: "LDAP",
    description: "Lightweight Directory Access Protocol",
  },
  {
    value: "kerberos",
    label: "Kerberos",
    description: "GSSAPI / Kerberos authentication",
  },
] as const;
