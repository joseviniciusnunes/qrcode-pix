import qrcode from 'qrcode';
interface QrCodePixParams {
    version: string;
    key: string;
    city: string;
    name: string;
    value?: number;
    guid?: string;
    message?: string;
    cep?: string;
    notRepeatPayment?: boolean;
    currency?: number;
    countryCode?: string;
}
declare function QrCodePix({ version, key, city, name, value, guid, message, cep, notRepeatPayment, currency, countryCode, }: QrCodePixParams): {
    payload: () => string;
    base64: (options?: qrcode.QRCodeToDataURLOptions | undefined) => Promise<string>;
};
export { QrCodePixParams, QrCodePix };
