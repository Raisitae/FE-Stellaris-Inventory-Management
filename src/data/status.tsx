export const getStatusArray = (t: (key: string) => string) => {
  return [
    { value: "nuevo", label: t("statusNew") },
    { value: "usado", label: t("statusUsed") },
    { value: "reacondicionado", label: t("statusRefurbished") },
    { value: "loose", label: t("statusLoose") },
    { value: "CIB", label: t("statusCIB") },
    { value: "gameManual", label: t("statusGameManual") },
    { value: "gameBox", label: t("statusGameBox") },
    { value: "manual", label: t("statusManual") },
    { value: "box", label: t("statusBox") },
  ];
};
