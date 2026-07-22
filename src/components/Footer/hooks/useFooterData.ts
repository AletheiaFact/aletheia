import { useAppSelector } from "../../../store/store";
import { currentNameSpace } from "../../../atoms/namespace";
import { useAtom } from "jotai";
import { NameSpaceEnum } from "../../../types/Namespace";
import { useTranslations } from "next-intl";

export const useFooterData = () => {
    const tFooter = useTranslations("footer");
    const { vw } = useAppSelector((state) => state);
    const isMobile = !!vw?.sm;
    const [nameSpace] = useAtom(currentNameSpace);
    const isMainNamespace = nameSpace === NameSpaceEnum.Main;
    const namespacePrefix = !isMainNamespace ? `/${nameSpace}` : "/";

    const statuteUrl = tFooter("sections.institutional.links.statuteUrl");

    return {
        isMobile,
        isMainNamespace,
        namespacePrefix,
        statuteUrl,
        tFooter,
    };
};
