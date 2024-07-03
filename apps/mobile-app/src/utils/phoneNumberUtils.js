import { parsePhoneNumber } from "awesome-phonenumber";

function normalizePhoneNumber(phoneNumber, regionCode) {
  const pn = parsePhoneNumber(phoneNumber, {
    regionCode,
  });
  return pn.number.e164;
}

export { normalizePhoneNumber };
