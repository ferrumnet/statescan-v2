import { StyledPanelTableWrapper } from "../components/styled/panel";
import BreadCrumb from "../components/breadCrumb";
import React, { useEffect, useState } from "react";
import { eventsHead } from "../utils/constants";
import { ColoredLink } from "../components/styled/link";
import Layout from "../components/layout";
import Table from "../components/table";
import Api from "../services/api";
import Pagination from "../components/pagination";
import { useLocation } from "react-router-dom";
import { getPageFromQuery } from "../utils/viewFuncs";

function Events() {
  const location = useLocation();
  const [events, setEvents] = useState(null);
  const [total, setTotal] = useState(0);
  const page = getPageFromQuery(location);

  useEffect(() => {
    setEvents(null);
    Api.fetch(`/events`, {
      page: getPageFromQuery(location) - 1,
    }).then(({ result }) => {
      setEvents(result?.items ?? []);
      setTotal(result?.total ?? 0);
    });
  }, [location]);

  const data =
    events?.map((event, index) => {
      return [
        <ColoredLink
          key={`${index}-1`}
          to={`/event/${event?.indexer?.blockHeight}-${event?.indexer?.eventIndex}`}
        >
          {event?.indexer?.blockHeight.toLocaleString()}-
          {event?.indexer?.eventIndex}
        </ColoredLink>,
        <ColoredLink
          key={`${index}-2`}
          to={`/block/${event?.indexer?.blockHeight}`}
        >
          {event?.indexer?.blockHeight.toLocaleString()}
        </ColoredLink>,
        event?.indexer?.blockTime,
        <ColoredLink
          key={`${index}-3`}
          to={`/extrinsic/${event?.indexer?.blockHeight}-${event?.indexer?.extrinsicIndex}`}
        >
          {event?.indexer?.blockHeight.toLocaleString()}-
          {event?.indexer?.extrinsicIndex}
        </ColoredLink>,
        `${event?.section}(${event?.method})`,
        event?.args,
      ];
    }) ?? null;

  return (
    <Layout>
      <BreadCrumb data={[{ name: "Events" }]} />
      <StyledPanelTableWrapper>
        <Table heads={eventsHead} data={data} />
        <Pagination page={parseInt(page)} pageSize={10} total={total} />
      </StyledPanelTableWrapper>
    </Layout>
  );
}

export default Events;