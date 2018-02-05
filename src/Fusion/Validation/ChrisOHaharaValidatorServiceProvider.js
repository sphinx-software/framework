import ValidatorManager from "./ValidatorManager";
import validator from "validator";
import lodash from "lodash";
import {provider} from "../Fusion";
import ChrisOHaraValidatorValidator from "./Validators/ChrisOHaraValidatorValidator";

@provider()
export default class ChrisOHaharaValidatorServiceProvider {

    supportedMethods = {
        equals: validator["equals"],
        contains: validator["contains"],
        matches: validator["matches"],
        email: validator["isEmail"],
        url: validator["isURL"],
        MACAddress: validator["isMACAddress"],
        IP: validator["isIP"],
        FQDN: validator["isFQDN"],
        boolean: validator["isBoolean"],
        alpha: validator["isAlpha"],
        alphanumeric: validator["isAlphanumeric"],
        numeric: validator["isNumeric"],
        port: validator["isPort"],
        lowercase: validator["isLowercase"],
        uppercase: validator["isUppercase"],
        ascii: validator["isAscii"],
        fullWidth: validator["isFullWidth"],
        halfWidth: validator["isHalfWidth"],
        variableWidth: validator["isVariableWidth"],
        multibyte: validator["isMultibyte"],
        surrogatePair: validator["isSurrogatePair"],
        int: validator["isInt"],
        float: validator["isFloat"],
        decimal: validator["isDecimal"],
        hexadecimal: validator["isHexadecimal"],
        divisibleBy: validator["isDivisibleBy"],
        hexColor: validator["isHexColor"],
        ISRC: validator["isISRC"],
        MD5: validator["isMD5"],
        hash: validator["isHash"],
        json: validator["isJSON"],
        empty: validator["isEmpty"],
        length: validator["isLength"],
        byteLength: validator["isByteLength"],
        uuid: validator["isUUID"],
        mongoId: validator["isMongoId"],
        after: validator["isAfter"],
        before: validator["isBefore"],
        in: validator["isIn"],
        creditcard: validator["isCreditCard"],
        ISIN: validator["isISIN"],
        ISBN: validator["isISBN"],
        ISSN: validator["isISSN"],
        phoneNumber: validator["isMobilePhone"],
        postalCode: validator["isPostalCode"],
        currency: validator["isCurrency"],
        ISO8601: validator["isISO8601"],
        ISO31661Alpha2: validator["isISO31661Alpha2"],
        base64: validator["isBase64"],
        dataURI: validator["isDataURI"],
        mime: validator["isMimeType"],
        latlong: validator["isLatLong"]
    };

    constructor(container) {
        this.container = container;
    }

    register() { }

    async boot() {
        let manager = await this.container.make(ValidatorManager);

        lodash.forIn(this.supportedMethods, (method, name) => {
            manager.add(name, new ChrisOHaraValidatorValidator(method))
        });
    }
}
