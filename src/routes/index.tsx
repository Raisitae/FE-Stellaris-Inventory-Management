import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { RootLayout } from "@/components/layouts/RootLayout";
import { Link } from "react-router-dom";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { t } = useTranslation("home");

  return (
    <RootLayout>
      <div className="container mx-auto py-12 bg-gradient-to-b min-h-[80vh]">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 ">
            {t("welcome")}
          </h1>
          <p className="text-xl text-gray-600 mb-6">{t("description")}</p>
          <Link
            aria-disabled="false"
            to="/products"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-700 transition opacity-80"
            tabIndex={-1}>
            {t("getStarted", "Get Started")}
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg  p-6 text-center border border-blue-200">
            <h2 className="text-2xl font-semibold mb-2 text-blue-700">
              {t("feature1Title", "Seguimiento de Inventario")}
            </h2>
            <p className="text-gray-700">
              {t(
                "feature1Desc",
                "Administra tu inventario de manera eficiente y sencilla."
              )}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-lg p-6 text-center border border-purple-200">
            <h2 className="text-2xl font-semibold mb-2 text-purple-700">
              {t("feature2Title", "Seguimiento de Ventas")}
            </h2>
            <p className="text-gray-700">
              {t(
                "feature2Desc",
                "Analiza tus ventas y toma decisiones informadas."
              )}
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-lg p-6 text-center border border-pink-200">
            <h2 className="text-2xl font-semibold mb-2 text-pink-700">
              {t("feature3Title", "Exportación de Datos")}
            </h2>
            <p className="text-gray-700">
              {t(
                "feature3Desc",
                "Exporta tus datos en formatos comunes como CSV y PDF para un análisis más profundo o informes profesionales."
              )}
            </p>
          </div>
        </div>
      </div>
    </RootLayout>
  );
}
