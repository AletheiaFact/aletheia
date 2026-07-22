import { NextPage } from "next";
import { GetLocale } from "../utils/GetLocale";
import { NameSpaceEnum } from "../types/Namespace";
import { useSetAtom } from "jotai";
import { currentNameSpace } from "../atoms/namespace";
import TrackingView from "../components/Tracking/TrackingView";
import { getMessages } from "../lib/getMessages";

const TrackingPage: NextPage<{
  verificationRequestId: string;
  nameSpace: NameSpaceEnum;
}> = ({ verificationRequestId, nameSpace }) => {
  const setCurrentNameSpace = useSetAtom(currentNameSpace);
  setCurrentNameSpace(nameSpace);

  return <TrackingView verificationRequestId={verificationRequestId} />;
};

export async function getServerSideProps({ query, locale, locales, req }) {
  locale = GetLocale(req, locale, locales);
  query = JSON.parse(query.props);
  return {
    props: {
      locale,
      messages: await getMessages(locale),
      verificationRequestId: query.verificationRequestId,
      href: req.protocol + "://" + req.get("host") + req.originalUrl,
      nameSpace: query.nameSpace ? query.nameSpace : NameSpaceEnum.Main,
    },
  };
}
export default TrackingPage;
