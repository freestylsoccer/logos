const { Command } = require("commander");
const { exec } = require("child_process");
const { ChainId } = require("@sushiswap/core-sdk");
const fs = require("fs");
const { resolve } = require("path");

const program = new Command();

const NAME_TO_CHAIN_ID = {
  arbitrum: ChainId.ARBITRUM,
  avalanche: ChainId.AVALANCHE,
  fuji: ChainId.AVALANCHE_TESTNET,
  binance: ChainId.BSC,
  celo: ChainId.CELO,
  ethereum: ChainId.ETHEREUM,
  fantom: ChainId.FANTOM,
  fuse: ChainId.FUSE,
  harmony: ChainId.HARMONY,
  heco: ChainId.HECO,
  matic: ChainId.MATIC,
  moonriver: ChainId.MOONRIVER,
  okex: ChainId.OKEX,
  palm: ChainId.PALM,
  telos: ChainId.TELOS,
  xdai: ChainId.XDAI,
};

const CHAIN_ID_TO_NAME = {
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

// TODO: #8 Add network and agnostic clone command to bin/index.js which
// will for example clone
// from token/eth.jpg
// to network/arbitrum/0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f.jpg

program
  .command("clone")
  .arguments("<name> <network> <address>")
  .action((name, network, address) => {
    if (!network in NAME_TO_CHAIN_ID) {
      console.warn("No network");
      return;
    }

    const from = resolve(__dirname, `../token/${name}.jpg`);

    if (!fs.existsSync(from)) {
      console.warn(`No token found with name ${name} at path ${path}`);
      return;
    }

    const to = resolve(__dirname, `../network/${network}/${address}.jpg`);

    exec(`cp ${from} ${to}`, () => console.log(`Copied ${from} -> ${to}`));
  });

program.command("clear:all").action(() => {
  console.log("clear command called");

  (async () => {
    try {
      for (const chainId of Object.keys(ChainId)) {
        if (!CHAIN_ID_TO_NAME[chainId]) {
          console.warn("No network configured for chainId " + chainId);
          continue;
        }

        console.log(`Clearing cache for network ${CHAIN_ID_TO_NAME[chainId]}`);

        const path = resolve(
          __dirname,
          `../network/${CHAIN_ID_TO_NAME[chainId]}`
        );

        console.log({ path });

        if (!fs.existsSync(path)) {
          continue;
        }

        fs.readdir(path, (error, files) => {
          if (error) console.error(error);
          for (const token of files) {
            console.log(
              `Clearing https://raw.githubusercontent.com/sushiswap/logos/main/${CHAIN_ID_TO_NAME[chainId]}/${token}`
            );
            exec(
              `/usr/local/bin/cld uploader explicit "https://raw.githubusercontent.com/sushiswap/logos/main/${CHAIN_ID_TO_NAME[chainId]}/${token}" type="fetch" invalidate="true" eager='[{ "width": 24 }, { "width": 32 }, { "width": 48 }, { "width": 64 }, { "width": 96 }, { "width": 128 }]'`,
              () =>
                console.log(
                  `CLEARED https://raw.githubusercontent.com/sushiswap/logos/main/${CHAIN_ID_TO_NAME[chainId]}/${token}`
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

    (async () => {
      try {
        if (!network) {
          throw Error(`No network configured for ${network}`);
        }

        const NETWORK =
          Number(network) in CHAIN_ID_TO_NAME
            ? CHAIN_ID_TO_NAME[network]
            : network;

        console.log(`Clearing cache for network ${NETWORK}`);

        const path = resolve(__dirname, `../network/${NETWORK}`);

        if (!fs.existsSync(path)) {
          throw Error(`Path does not exist for ${path}`);
        }

        fs.readdir(path, (error, files) => {
          if (error) console.error(error);
          for (const token of files) {
            console.log(
              `Clearing https://raw.githubusercontent.com/sushiswap/logos/main/network/${NETWORK}/${token}`
            );
            exec(
              `/usr/local/bin/cld uploader explicit "https://raw.githubusercontent.com/sushiswap/logos/main/network/${NETWORK}/${token}" type="fetch" invalidate="true" eager='[{ "width": 24 }, { "width": 32 }, { "width": 48 }, { "width": 54 }, { "width": 64 }, { "width": 96 }, { "width": 128 }]'`,
              () =>
                console.log(
                  `CLEARED https://raw.githubusercontent.com/sushiswap/logos/main/network/${NETWORK}/${token}`
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
