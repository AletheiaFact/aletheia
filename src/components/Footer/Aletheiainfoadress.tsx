import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../store/store";

const Aletheiainfoadress = () => {
  const { t } = useTranslation();
  const { vw } = useAppSelector((state) => state);

  return (
    <>
      <span
        style={{
          fontSize: "14px",
          marginTop: "0px",
          textAlign: "center",
        }}
      >
        Av Maria Ranieri, Nº 7-50
      </span>
      <span
        style={{
          fontSize: "14px",
          marginTop: "0px",
          textAlign: "center",
        }}
      >
        17.055-175 - Parque Viaduto - Bauru/SP
      </span>
      <span
        style={{
          fontSize: "14px",
          marginTop: "0px",
          textAlign: "center",
        }}
      >
        46.428.905/0001-68
      </span>
    </>
  );
};

export default Aletheiainfoadress;