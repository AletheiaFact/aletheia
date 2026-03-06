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
    const isMainNamespace = nameSpace === NameSpaceEnum.Main
    const namespacePrefix = !isMainNamespace
        ? `/${nameSpace}`
        : "/";

    const statuteUrl = t("footer:sections.institutional.links.statuteUrl");

    return {
        mediumDevice,
        isMobile,
        isMainNamespace,
        namespacePrefix,
        statuteUrl,
        t
    };
};
