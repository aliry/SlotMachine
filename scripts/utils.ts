import * as fs from "fs";
// eslint-disable-next-line node/no-missing-import
import { LAST_DEPLOYED_ADDRESS } from "./constants";

export const GetLastDeployedContractAddress = () => {
  return fs.readFileSync(LAST_DEPLOYED_ADDRESS).toString();
};

export const SetLastDeployedContractAddress = (address: string) => {
  fs.writeFileSync(LAST_DEPLOYED_ADDRESS, address);
};
