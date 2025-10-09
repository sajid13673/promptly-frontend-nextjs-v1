"use client";

import LoginPage from "@/components/loginPage";
import redirectIfAuthenticated from "@/lib/redirectIfAuthenticated";
import { withClientWrapper } from "@/lib/withClientWrapper";

export default function Page() {
  const LoginWrapper = withClientWrapper(LoginPage, redirectIfAuthenticated);
  return <LoginWrapper />;
}