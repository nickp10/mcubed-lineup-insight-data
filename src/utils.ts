import { IIncomingMessage, ContestType, DataType, Sport } from "./interfaces";
import * as https from "https";

export class Utils {
    /**
     * Flattens the specified items such that all items from any sub-arrays recursive
     * will be returned in a one-dimensional linear array. For example:
     * 
     * [
     *   "A",
     *   "B",
     *   [
     *      "C",
     *      "D",
     *      [
     *         "E",
     *         "F"
     *      ]
     *   ]
     * ]
     * 
     * Would become:
     * 
     * [
     *   "A",
     *   "B",
     *   "C",
     *   "D",
     *   "E",
     *   "F"
     * ]
     * 
     * @param arr The array to flatten.
     * @returns The one-dimensional array containing all the items.
     */
    flattenArray<T>(arr: T|T[]|T[][]): T[] {
        const flat: T[] = [];
        if (Array.isArray(arr)) {
            for (let i = 0; i < arr.length; i++) {
                const flatSubArray = this.flattenArray.call(this, arr[i]); 
                flat.push.apply(flat, flatSubArray);
            }
        } else if (arr) {
            flat.push(arr);
        }
        return flat;
    }

    validContestTypes(): string[] {
        const values: string[] = [];
        for (let x in ContestType) {
            if (!Number(x)) {
                values.push(x);
            }
        }
        return values;
    }

    validDataTypes(): string[] {
        const values: string[] = [];
        for (let x in DataType) {
            if (!Number(x)) {
                values.push(x);
            }
        }
        return values;
    }

    validSports(): string[] {
        const values: string[] = [];
        for (let x in Sport) {
            if (!Number(x)) {
                values.push(x);
            }
        }
        return values;
    }

    coerceContestType(contestType: string): ContestType {
        for (let x in ContestType) {
            if (this.equalsIgnoreCase(x, contestType) && !Number(x)) {
                return <any>ContestType[x];
            }
        }
        return undefined;
    }

    coerceDataType(data: string): DataType {
        for (let x in DataType) {
            if (this.equalsIgnoreCase(x, data) && !Number(x)) {
                return <any>DataType[x];
            }
        }
        return undefined;
    }

    coerceSport(sport: string): Sport {
        for (let x in Sport) {
            if (this.equalsIgnoreCase(x, sport) && !Number(x)) {
                return <any>Sport[x];
            }
        }
        return undefined;
    }

    coerceInt(value: string): number {
        const parsed = parseInt(value);
        if (isNaN(parsed) || typeof parsed !== "number") {
            return undefined;
        }
        return parsed;
    }

    coerceFloat(value: string): number {
        const parsed = parseFloat(value);
        if (isNaN(parsed) || typeof parsed !== "number") {
            return undefined;
        }
        return parsed;
    }

    coerceError(error: any): Error {
        if (error) {
            if (error instanceof Error) {
                return error;
            } else if (typeof error.message === "string") {
                return new Error(error.message);
            } else if (typeof error.error === "string") {
                return new Error(error.error);
            } else if (typeof error === "string") {
                return new Error(error);
            }
        }
        return new Error("An unknown error occurred.");
    }

    equalsIgnoreCase(strA: string, strB: string): boolean {
        if (strA) {
            return new RegExp(`^${strA}$`, "i").test(strB);
        }
        return !strB;
    }

    async sendHttpsRequest(request: https.RequestOptions, data?: string): Promise<IIncomingMessage> {
        //console.log(`Sending request to https://${request.hostname}${request.path}`);
        return new Promise<IIncomingMessage>((resolve, reject) => {
            const headers = request.headers || { };
            request.headers = headers;
            if (data) {
                headers["Content-Type"] = "application/x-www-form-urlencoded";
                headers["Content-Length"] = data.length;
            }
            const req = https.request(request, (resp: IIncomingMessage) => {
                let body = "";
                resp.on("data", (data) => {
                    body += data;
                });
                resp.on("end", () => {
                    resp.body = body;
                    resolve(resp);
                });
            }).on("error", (error) => {
                reject(error);
            });
            if (data) {
                req.write(data);
            }
            req.end();
        });
    }
}

export default new Utils();
