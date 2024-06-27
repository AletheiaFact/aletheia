import { useEffect } from "react";
import { useAppSelector } from "../../../../store/store";
import reviewTaskApi from "../../../../api/reviewTaskApi";
import { useTranslation } from "next-i18next";

const useAutoSaveDraft = (data_hash, personality, claim, watch) => {
    const autoSave = useAppSelector((state) => state.autoSave);
    const { t } = useTranslation();

    useEffect(() => {
        if (autoSave) {
            let timeout: NodeJS.Timeout;

            const callback = (value) => {
                if (timeout) clearTimeout(timeout);

                timeout = setTimeout(() => {
                    reviewTaskApi.autoSaveDraft(
                        {
                            data_hash,
                            machine: {
                                context: {
                                    reviewData: value,
                                    claimReview: {
                                        personality,
                                        claim,
                                        isPartialReview: true,
                                    },
                                },
                            },
                        },
                        t
                    );
                }, 10000);
            };

            const unsubscribe = watch(callback);

            return () => {
                clearTimeout(timeout);
                if (unsubscribe) unsubscribe();
            };
        }
    }, [autoSave, watch]);
};

export default useAutoSaveDraft;
