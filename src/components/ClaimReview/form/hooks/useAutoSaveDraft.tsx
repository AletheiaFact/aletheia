import { useEffect } from "react";
import { useAppSelector } from "../../../../store/store";
import reviewTaskApi from "../../../../api/reviewTaskApi";
import { useTranslations } from "next-intl";

const useAutoSaveDraft = (data_hash, personality, target, watch) => {
    const autoSave = useAppSelector((state) => state.autoSave);
    const t = useTranslations() as any;

    useEffect(() => {
        if (autoSave) {
            let timeout: NodeJS.Timeout;

            const callback = (value) => {
                if (timeout) clearTimeout(timeout);

                timeout = setTimeout(() => {
                    return reviewTaskApi.autoSaveDraft(
                        {
                            data_hash,
                            machine: {
                                context: {
                                    reviewData: value,
                                    review: {
                                        personality,
                                        target,
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
