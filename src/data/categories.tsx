//El día de mañana las categorías se pueden obtener de una API, del mismo modo que las plataformas

export const getCategoryArray = (t: (key: string) => string) => {
  return [
    { value: "juegos", label: t("categoryGames") },
    { value: "consolas", label: t("categoryConsoles") },
    { value: "accessorios", label: t("categoryAccessories") },
    { value: "merchandising", label: t("categoryMerchandise") },
    { value: "otros", label: t("categoryOther") },
  ];
};
