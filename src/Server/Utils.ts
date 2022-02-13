import { parse, UrlWithParsedQuery, UrlWithStringQuery } from 'url'

export class Utils {

    public static getUrlBasePath(url: string | undefined): string {
        if (url !== undefined) {
            const parsedUrl = parse(url);
            const a = 5
            return parsedUrl.pathname!.split('/')[1]
        }
        return ''
    }

    public static getUrlParameters(url: string | undefined): UrlWithParsedQuery | undefined {
        if (url !== undefined) {
            return parse(url, true);
        } else {
            return undefined
        }
    }
}