import fs from "fs";
import path from "path";
import { request, gql } from "graphql-request";
import { getAddress } from "@ethersproject/address";

const pathToImages = process.env.CI
  ? path.join(process.env.GITHUB_WORKSPACE, "packages", "token-lists", "lists", "images")
  : path.join(path.resolve(), "lists", "images");
const logoFiles = fs.readdirSync(pathToImages);

// Interface for Bitquery GraphQL response.
interface BitqueryEntity {
  // eslint-disable-next-line camelcase
  Total_USD: number;
  baseCurrency: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Default token list for exchange + manual exclusion of broken BEP-20 token(s)
const blacklist: string[] = [
  "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", // WBNB
  "0xe9e7cea3dedca5984780bafc599bd69add087d56", // BUSD
  "0x2170ed0880ac9a755fd29b2688956bd959f933f8", // ETH
  "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c", // BTCB
  "0x55d398326f99059ff775485246999027b3197955", // USDT
  "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82", // Cake

  "0x4269e4090ff9dfc99d8846eb0d42e67f01c3ac8b", // BROKEN TOKEN
];

/**
 * Return today / 1 month ago ISO-8601 DateTime.
 *
 * @returns string[]
 */
const getDateRange = (): string[] => {
  const today = new Date();
  const todayISO = today.toISOString();
  today.setMonth(today.getMonth() - 1);
  const monthAgoISO = today.toISOString();

  return [todayISO, monthAgoISO];
};

/**
 * Fetch Top100 Tokens traded on PancakeSwap v2, ordered by trading volume,
 * for the past 30 days, filtered to remove default / broken tokens.
 *
 * @returns BitqueryEntity[]]
 */
const getTokens = async (): Promise<BitqueryEntity[]> => {
  try {
    const [today, monthAgo] = getDateRange();

    const { ethereum } = await request(
      "https://graphql.bitquery.io/",
      gql`
        query ($from: ISO8601DateTime, $till: ISO8601DateTime, $blacklist: [String!]) {
          ethereum(network: bsc) {
            dexTrades(
              options: { desc: "Total_USD", limit: 100 }
              exchangeName: { is: "Pancake v2" }
              baseCurrency: { notIn: $blacklist }
              date: { since: $from, till: $till }
            ) {
              Total_USD: tradeAmount(calculate: sum, in: USD)
              baseCurrency {
                address
                name
                symbol
                decimals
              }
            }
          }
        }
      `,
      {
        from: monthAgo,
        till: today,
        blacklist,
      }
    );

    return ethereum.dexTrades;
  } catch (error) {
    return error;
  }
};

/**
 * Returns the URI of a token logo
 * Note: If present in extended list, use main logo, else fallback to TrustWallet
 *
 * @returns string
 */
const getTokenLogo = (address: string): string => {
  // Note: fs.existsSync can't be used here because its not case sensetive
  if (logoFiles.includes(`${address}.png`)) {
    return `https://moonwalker.network/coins/${address}.png`;
  }

  return `https://assets.trustwalletapp.com/blockchains/smartchain/assets/${address}/logo.png`;
};

/**
 * Main function.
 * Fetch tokems, build list, save list.
 */
const main = async (): Promise<void> => {
  try {
    const tokens = await getTokens();

    const sanitizedTokens = tokens.reduce((list, item: BitqueryEntity) => {
      const checksummedAddress = getAddress(item.baseCurrency.address);

      const updatedToken = {
        name: item.baseCurrency.name,
        symbol: item.baseCurrency.symbol.toUpperCase(),
        address: checksummedAddress,
        chainId: 56,
        decimals: item.baseCurrency.decimals,
        logoURI: getTokenLogo(checksummedAddress),
      };
      return [...list, updatedToken];
    }, []);

    const stringifiedList = JSON.stringify(sanitizedTokens, null, 2);
    fs.writeFileSync(tokenListPath, stringifiedList);
  } catch (error) {
    console.error(`Error when fetching Top100 Tokens by volume for the past 30 days, error: ${error.message}`);
  }
};

export default main;
