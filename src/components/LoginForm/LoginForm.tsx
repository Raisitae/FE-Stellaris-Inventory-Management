import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export function LoginForm({
  className,
  "data-testid": dataTestId = "login-form-component",
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { "data-testid"?: string }) {
  const { t } = useTranslation("login");

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{t("title")}</CardTitle>
          <CardDescription>{t("enterEmail")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form data-testid={`${dataTestId}.form`}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("placeholderEmail")}
                  required
                  data-testid={`${dataTestId}.email.input`}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">{t("password")}</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    {t("forgotPassword")}
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  data-testid={`${dataTestId}.password.input`}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                data-testid={`${dataTestId}.submit.button`}>
                {t("signIn")}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {t("noAccount")}{" "}
              <Link to="/register" className="underline underline-offset-4">
                {t("createAccount")}
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
