import ResetPasswordForm from "./reset-password-form";

type ResetPasswordSearchParams = Promise<{
  token?: string | string[];
  resetToken?: string | string[];
}>;

function getFirstValue(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: ResetPasswordSearchParams;
}) {
  const params = await searchParams;
  const token = getFirstValue(params.token) || getFirstValue(params.resetToken);

  return <ResetPasswordForm initialToken={token} />;
}
