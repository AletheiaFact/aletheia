import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetLocale } from "../utils/GetLocale";
import { NameSpaceEnum } from "../types/Namespace";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import TrackingView from "../components/Tracking/TrackingView";

const TrackingPage: NextPage<{
  targetId: string;
  nameSpace: NameSpaceEnum;
}> = ({ targetId, nameSpace }) => {
  const setCurrentNameSpace = useSetAtom(currentNameSpace);
  setCurrentNameSpace(nameSpace);

  return <TrackingView targetId={targetId} />;
};

export async function getServerSideProps({ query, locale, locales, req }) {
  locale = GetLocale(req, locale, locales);
  query = JSON.parse(query.props);
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      targetId: JSON.parse(JSON.stringify(query.targetId)),
      href: req.protocol + "://" + req.get("host") + req.originalUrl,
      nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
    },
  };
}
export default TrackingPage;
