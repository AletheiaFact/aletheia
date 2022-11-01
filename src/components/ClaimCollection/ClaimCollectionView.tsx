import React, { useCallback } from "react";
import { useTranslation } from "next-i18next";
import claimCollectionApi from "../../api/claimCollectionApi";
import { CallbackTimerProvider } from "../Editor/CallbackTimerProvider";
import ClaimCollectionTimelineWrapper from "./ClaimCollectionTimelineWrapper";
import ClaimCollectionHeader from "./ClaimCollectionHeader";
import { Col, Row } from "antd";
import CTARegistration from "../Home/CTARegistration";
import { useAppSelector } from "../../store/store";
import VideoCTACard from "../VideoCTACard";
import DonationCard from "../DonationCard";

const ClaimCollectionView = ({ claimCollection }) => {
    const { t } = useTranslation();
    const collections = claimCollection?.collections;
    const lastCollectionItem = collections
        ? collections[collections.length - 1]
        : [];
    const updateTimeline = useCallback(
        (context: any) => {
            // TODO: send the last collection item id to load only the necessary data
            return claimCollectionApi
                .getById(claimCollection?._id, t, {
                    reverse: true,
                    lastCollectionItem:
                        context.lastCollectionItemId ||
                        lastCollectionItem?.attrs?.cardId,
                })
                .then((claimCollection) => {
                    const collections = claimCollection?.collections;
                    const lastCollectionItem = collections
                        ? collections[collections.length - 1]
                        : [];
                    context.lastCollectionItemId =
                        lastCollectionItem?.attrs?.cardId;
                    return claimCollection;
                });
        },
        [claimCollection?._id, lastCollectionItem]
    );

    const { isLoggedIn } = useAppSelector((state) => ({
        isLoggedIn: state?.login,
    }));

    return (
        <>
            <CallbackTimerProvider callback={updateTimeline}>
                <Row
                    style={{
                        width: "100%",
                        justifyContent: "center",
                    }}
                >
                    <ClaimCollectionHeader
                        title={claimCollection?.title}
                        personalities={claimCollection?.personalities}
                    />
                    <Row
                        style={{
                            padding: "30px 10%",
                            width: "100%",
                        }}
                    >
                        <ClaimCollectionTimelineWrapper
                            collections={collections}
                            isLive={claimCollection.isLive}
                        />
                    </Row>
                    <Row
                        style={{
                            padding: "30px 10%",
                            width: "100%",
                            justifyContent: "space-evenly",
                        }}
                    >
                        <Col>
                            <VideoCTACard />
                        </Col>
                        <Col>
                            <DonationCard />
                        </Col>
                    </Row>
                    {!isLoggedIn && (
                        <Row
                            style={{
                                padding: "30px 10%",
                                width: "100%",
                            }}
                        >
                            <Col xs={24} lg={18} order={3}>
                                <CTARegistration />
                            </Col>
                        </Row>
                    )}
                </Row>
            </CallbackTimerProvider>
        </>
    );
};

export default ClaimCollectionView;
