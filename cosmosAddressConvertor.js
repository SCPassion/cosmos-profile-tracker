import { fromBech32, toBech32 } from "https://cdn.jsdelivr.net/npm/@cosmjs/encoding/+esm";

export function convertAddress(address, prefix) {
    const { prefix: oldPrefix, data } = fromBech32(address);
    return toBech32(prefix, data);
}