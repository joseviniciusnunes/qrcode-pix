interface IParameter {
    version: number;
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
interface IResponse {
    payload: string;
    qrCode: string;
}
declare function QrCodePix(parameter: IParameter): Promise<IResponse>;
export { QrCodePix };
