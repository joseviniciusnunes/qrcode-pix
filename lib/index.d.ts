interface IParameter {
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
declare function QrCodePix(parameter: IParameter): {
    payload: () => string;
    base64: () => Promise<string>;
};
export { QrCodePix };
