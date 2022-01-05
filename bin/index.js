const { Command } = require("commander");
const { exec } = require("child_process");
const { ChainId } = require("@sushiswap/core-sdk");

const program = new Command();

const NETWORK = {
  [ChainId.ARBITRUM]: "arbitrum",
  [ChainId.AVALANCHE]: "avalanche",
  [ChainId.AVALANCHE_TESTNET]: "fuji",
  [ChainId.BSC]: "binance",
  [ChainId.CELO]: "celo",
  [ChainId.ETHEREUM]: "ethereum",
  [ChainId.FANTOM]: "fantom",
  [ChainId.FUSE]: "fuse",
  [ChainId.HARMONY]: "harmony",
  [ChainId.HECO]: "heco",
  [ChainId.MATIC]: "matic",
  [ChainId.MOONRIVER]: "moonriver",
  [ChainId.OKEX]: "okex",
  [ChainId.PALM]: "palm",
  [ChainId.TELOS]: "telos",
  [ChainId.XDAI]: "xdai",
};

program.command("clear:all").action(() => {
  console.log("clear command called");

  const fs = require("fs");

  const { resolve } = require("path");

  (async () => {
    try {
      for (const key of Object.keys(ChainId)) {
        if (!NETWORK[key]) {
          console.warn("No network configured for chainId " + key);
          continue;
        }

        console.log(`Clearing cache for network ${NETWORK[key]}`);

        const path = resolve(__dirname, `../network/${NETWORK[key]}`);

        console.log({ path });

        if (!fs.existsSync(path)) {
          continue;
        }

        fs.readdir(path, (error, files) => {
          if (error) console.error(error);
          for (const token of files) {
            console.log(
              `Clearing https://raw.githubusercontent.com/sushiswap/logos/main/${NETWORK[key]}/${token}`
            );
            exec(
              `/usr/local/bin/cld uploader explicit "https://raw.githubusercontent.com/sushiswap/logos/main/${NETWORK[key]}/${token}" type="fetch" invalidate="true" eager='[{ "width": 24 }, { "width": 32 }, { "width": 48 }, { "width": 64 }, { "width": 96 }, { "width": 128 }]'`,
              () =>
                console.log(
                  `CLEARED https://raw.githubusercontent.com/sushiswap/logos/main/${NETWORK[key]}/${token}`
                )
            );
          }
        });
      }
    } catch (error) {
      console.error(error);
    }
  })();
});

program
  .command("clear:network")
  .arguments("<network>")
  .action((network) => {
    console.log("clear:network command called", { network });

    const fs = require("fs");

    const { resolve } = require("path");

    (async () => {
      try {
        if (!network) {
          throw Error(`No network configured for ${network}`);
        }

        console.log(`Clearing cache for network ${NETWORK[network]}`);

        const path = resolve(__dirname, `../network/${NETWORK[network]}`);

        if (!fs.existsSync(path)) {
          throw Error(`Path does not exist for ${path}`);
        }

        fs.readdir(path, (error, files) => {
          if (error) console.error(error);
          for (const token of files) {
            console.log(
              `Clearing https://raw.githubusercontent.com/sushiswap/logos/main/network/${NETWORK[network]}/${token}`
            );
            exec(
              `/usr/local/bin/cld uploader explicit "https://raw.githubusercontent.com/sushiswap/logos/main/network/${NETWORK[network]}/${token}" type="fetch" invalidate="true" eager='[{ "width": 24 }, { "width": 32 }, { "width": 48 }, { "width": 54 }, { "width": 64 }, { "width": 96 }, { "width": 128 }]'`,
              () =>
                console.log(
                  `CLEARED https://raw.githubusercontent.com/sushiswap/logos/main/network/${NETWORK[network]}/${token}`
                )
            );
          }
        });
      } catch (error) {
        console.error(error);
      }
    })();
  });

program.parse(process.argv);
