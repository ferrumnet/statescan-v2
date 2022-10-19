import { DetailedTime } from "../../components/styled/time";
import FinalizedState from "../../components/states/finalizedState";
import Address from "../../components/address";
import React from "react";
import { withCopy } from "../../HOC/withCopy";
import { TextSecondary } from "../../components/styled/text";
import {
  ColoredInterLink,
  ColoredMonoLink,
} from "../../components/styled/link";
import Tooltip from "../../components/tooltip";
import { toPrecision } from "@osn/common";
import ValueDisplay from "../../components/displayValue";
import DetailedCallId from "../../components/detail/callId";
import DetailedExtrinsicId from "../../components/detail/extrinsicId";
import DetailedBlock from "../../components/detail/block";
import styled from "styled-components";
import { Tag as TagOrigin, TagHighContrast } from "../../components/tag";
import { Inter_14_500 } from "../../styles/text";
import { ReactComponent as CheckIcon } from "../../components/icons/check.svg";
import { ReactComponent as TimerIcon } from "../../components/icons/timer.svg";

const TextSecondaryWithCopy = withCopy(TextSecondary);
const ColoredMonoLinkWithCopy = withCopy(ColoredMonoLink);

const Tag = styled(TagOrigin)`
  color: ${(p) => p.theme.fontSecondary};
  background-color: ${(p) => p.theme.fillBase};
`;

const CallText = styled.span`
  color: ${(p) => p.theme.fontSecondary};
  ${Inter_14_500};
`;

export const toBlockDetailItem = (block) => {
  return {
    "Block Time": <DetailedTime ts={block?.time} />,
    Status: <FinalizedState finalized={block?.isFinalized} />,
    Hash: <TextSecondaryWithCopy>{block?.hash}</TextSecondaryWithCopy>,
    "Parent Hash": (
      <ColoredMonoLinkWithCopy
        to={`/block/${(Number.parseInt(block?.height) - 1).toString()}`}
      >
        {block?.parentHash}
      </ColoredMonoLinkWithCopy>
    ),
    "State Root": (
      <TextSecondaryWithCopy>{block?.stateRoot}</TextSecondaryWithCopy>
    ),
    "Extrinsics Root": (
      <TextSecondaryWithCopy>{block?.extrinsicsRoot}</TextSecondaryWithCopy>
    ),
    Validator: <Address address={block?.validator} ellipsis={false} />,
  };
};

export const toAccountDetailItem = (id, account, chainSetting) => {
  return {
    Address: <Address address={id} ellipsis={false} />,
    "Total Balance": (
      <Tooltip
        tip={`${toPrecision(account?.data?.total, chainSetting.decimals)} ${
          chainSetting.symbol
        }`}
      >
        <TextSecondary>
          <ValueDisplay
            value={toPrecision(account?.data?.total, chainSetting.decimals)}
            symbol={chainSetting.symbol}
            abbreviate={false}
          />
        </TextSecondary>
      </Tooltip>
    ),
    Free: (
      <Tooltip
        tip={`${toPrecision(account?.data?.free, chainSetting.decimals)} ${
          chainSetting.symbol
        }`}
      >
        <TextSecondary>
          <ValueDisplay
            value={toPrecision(account?.data?.free, chainSetting.decimals)}
            symbol={chainSetting.symbol}
            abbreviate={false}
          />
        </TextSecondary>
      </Tooltip>
    ),
    Reversed: (
      <Tooltip
        tip={`${toPrecision(account?.data?.reversed, chainSetting.decimals)} ${
          chainSetting.symbol
        }`}
      >
        <TextSecondary>
          <ValueDisplay
            value={toPrecision(account?.data?.reserved, chainSetting.decimals)}
            symbol={chainSetting.symbol}
            abbreviate={false}
          />
        </TextSecondary>
      </Tooltip>
    ),
    Nonce: <TextSecondary>{account?.nonce}</TextSecondary>,
  };
};

export const toCallDetailItem = (indexer, section, method) => {
  return {
    "Call ID": (
      <DetailedCallId
        blockHeight={indexer?.blockHeight}
        id={indexer?.callIndex}
      />
    ),
    "Extrinsics ID": (
      <DetailedExtrinsicId
        blockHeight={indexer?.blockHeight}
        id={indexer?.extrinsicIndex}
      />
    ),
    Block: <DetailedBlock blockHeight={indexer?.blockHeight} />,
    Timestamp: <DetailedTime ts={indexer?.blockTime} />,
    Method: <Tag>{method}</Tag>,
    Call: (
      <CallText>
        {section}({method})
      </CallText>
    ),
  };
};

export const toEventDetailItem = (event) => {
  return {
    "Event Time": <DetailedTime ts={event?.indexer?.blockTime} />,
    Block: <DetailedBlock blockHeight={event?.indexer?.blockHeight} />,
    "Extrinsic ID": (
      <DetailedExtrinsicId
        id={event?.indexer?.extrinsicIndex}
        blockHeight={event?.indexer?.blockHeight}
      />
    ),
    "Event Index": <TextSecondary>{event?.indexer?.eventIndex}</TextSecondary>,
    Module: <TagHighContrast>{event?.section}</TagHighContrast>,
    "Event Name": <Tag>{event?.method}</Tag>,
    // Description: (
    //   <TextSecondaryWithCopy>
    //     {event?.args?.[0].docs?.join("") || ""}
    //   </TextSecondaryWithCopy>
    // ),
    // TODO: Value field for transfer event
  };
};

export const toExtrinsicDetailItem = (extrinsic) => {
  return {
    "Extrinsic Time": <DetailedTime ts={extrinsic?.indexer?.blockTime} />,
    Block: <DetailedBlock blockHeight={extrinsic?.indexer?.blockHeight} />,
    ...(extrinsic?.lifetime
      ? {
          "Life Time": (
            <>
              <ColoredInterLink to={`/block/${extrinsic?.lifetime?.[0]}`}>
                {extrinsic?.lifetime?.[0].toLocaleString()}
              </ColoredInterLink>
              {" ~ "}
              <ColoredInterLink to={`/block/${extrinsic?.lifetime?.[1]}`}>
                {extrinsic?.lifetime?.[1].toLocaleString()}
              </ColoredInterLink>
            </>
          ),
        }
      : {}),
    "Extrinsic Hash": (
      <TextSecondaryWithCopy>{extrinsic?.hash}</TextSecondaryWithCopy>
    ),
    Module: <TagHighContrast>{extrinsic?.call?.section}</TagHighContrast>,
    Call: <Tag>{extrinsic?.call?.method}</Tag>,
    ...(extrinsic.isSigned
      ? {
          Singer: <Address address={extrinsic?.signer} ellipsis={false} />,
        }
      : {}),
    ...(extrinsic?.nonce
      ? {
          Nonce: <TextSecondary>{extrinsic?.nonce}</TextSecondary>,
        }
      : {}),
    ...(extrinsic?.tip > 0
      ? {
          Tip: extrinsic?.tip,
        }
      : {}),
    Result: extrinsic?.isFinalized ? <CheckIcon /> : <TimerIcon />,
  };
};