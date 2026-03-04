import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../store/store";
import { currentNameSpace } from "../../../atoms/namespace";
import { useAtom } from "jotai";
import { NameSpaceEnum } from "../../../types/Namespace";

export const useFooterData = () => {
    const { t } = useTranslation();
    const { vw } = useAppSelector((state) => state);
    const mediumDevice = vw?.lg;
    const isMobile = !!vw?.sm;
    const [nameSpace] = useAtom(currentNameSpace);
    const isNameSpaceColor = nameSpace === NameSpaceEnum.Main
    const namespacePrefix = !isNameSpaceColor
        ? `/${nameSpace}`
        : "";

    const statuteUrl = "https://docs.google.com/viewer?url=https://raw.githubusercontent.com/AletheiaFact/miscellaneous/290b19847f0da521963f74e7947d7863bf5d5624/documents/org_legal_register.pdf";

    return {
        mediumDevice,
        isMobile,
        isNameSpaceColor,
        namespacePrefix,
        statuteUrl,
        t
    };
};
