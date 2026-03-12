import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Grid from "@mui/material/Grid";
import { Topic } from "../../../types/Topic";
import { NameSpaceEnum } from "../../../types/Namespace";
import { ListEventsOptions } from "../../../types/event";
import claimReviewApi from "../../../api/claimReviewApi";
import Loading from "../../Loading";
import ErrorState from "../../ErrorState";
import EventLoadMore from "../EventList/EventLoadMore";
import { Review } from "../../../types/Review";
import ReviewsGrid from "../../ClaimReview/ReviewsGrid";
import EventTitle from "../EventList/EventTitle";

type EventReviewsProps = {
  mainTopic: Topic;
  filterTopics?: Topic[];
  nameSpace: NameSpaceEnum;
};

interface IReviewData {
  items: Review[];
  total: number;
}

const EventReviews = ({
  mainTopic,
  filterTopics,
  nameSpace,
}: EventReviewsProps) => {
  const { t } = useTranslation();
  const [data, setData] = useState<IReviewData>({ items: [], total: 0 });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<ListEventsOptions>({
    page: 1,
    pageSize: 6,
    order: "asc",
  });

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await claimReviewApi.get({
        ...query,
        isHidden: false,
        nameSpace: nameSpace,
        mainTopicWikidataID: mainTopic.wikidataId,
      });

      if (query.page === 1) {
        setData({
          items: response.data,
          total: response.total || 0,
        });
      } else {
        setData((prev) => ({
          items: [...prev.items, ...response.data],
          total: response.total || prev.total,
        }));
      }
    } catch (err: any) {
      setError(err.message || "Erro ao buscar reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mainTopic?.wikidataId) {
      handleFetch();
    }
  }, [query, nameSpace, mainTopic?.wikidataId]);

  if (loading && query.page === 1) {
    return <Loading />;
  }

  if (error) {
    return <ErrorState message={t("events:fetchError") || error} />;
  }

  return (
    <Grid container className="eventContainerBase">
      <Grid item xl={8} md={10} xs={12} className="eventSection">
        <ReviewsGrid
          reviews={data.items}
          title={
            <EventTitle
              total={data.total}
              label={t("events:latestReviews")}
              t={t}
            />
          }
          hasDivider={true}
        />
      </Grid>
      <EventLoadMore
        visible={data.total > data.items.length}
        onLoadMore={() =>
          setQuery((prev) => ({ ...prev, page: prev.page + 1 }))
        }
        label={t("events:loadMoreButton")}
      />
    </Grid>
  );
};

export default EventReviews;
