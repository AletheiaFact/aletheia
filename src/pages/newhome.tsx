import { NextPage } from "next";
import Home from "../components/Home/Home";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Newhome: NextPage<{ data: any }> = (props) => {
    return (
        <Home />
    )
}

export async function getStaticProps({ locale }) {
    const i18n = await serverSideTranslations(locale || "en", ['common'])
    console.log(i18n._nextI18Next.initialI18nStore);
    return {
        props: {
            ...(await serverSideTranslations(locale || "en", ['home', 'footer', 'menu'])),
            // Will be passed to the page component as props
        },
    };
}
export default Newhome;
