import qrcode, { QRCodeToDataURLOptions } from 'qrcode';
import { crc16ccitt } from 'crc';
import { string, number } from 'yup';

interface QrCodePixParams {
    version: string;
    key: string;
    city: string;
    name: string;
    value?: number;
    transactionId?: string;
    message?: string;
    cep?: string;
    currency?: number;
    countryCode?: string;
}

function QrCodePix({
    version,
    key,
    city,
    name,
    value,
    message,
    cep,
    transactionId = '***',
    currency = 986,
    countryCode = 'BR',
}: QrCodePixParams) {
    string().equals(['01'], 'Version not supported').validateSync(version);

    string()
        .min(2, 'countryCode: 2 characters')
        .max(2, 'countryCode: 2 characters')
        .nullable()
        .validateSync(countryCode);

    string().min(8, 'cep: 8 characters').max(8, 'cep: 8 characters').nullable().validateSync(cep);

    if (String(value) === '0') {
        value = undefined;
    }

    number().nullable().positive('Value must be a positive number').validateSync(value);

    string().max(25, 'transactionId: max 25 characters').nullable().validateSync(transactionId);

    const payloadKeyString = generateKey(key, message);

    const payload: string[] = [
        genEMV('00', version),
        genEMV('26', payloadKeyString),
        genEMV('52', '0000'),
        genEMV('53', String(currency)),
    ];

    if (value) {
        payload.push(genEMV('54', value.toFixed(2)));
    }

    name = String(name)
        .substring(0, 25)
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    city = String(city)
        .substring(0, 15)
        .toUpperCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    payload.push(genEMV('58', countryCode.toUpperCase()));
    payload.push(genEMV('59', name));
    payload.push(genEMV('60', city));

    if (cep) {
        payload.push(genEMV('61', cep));
    }

    payload.push(genEMV('62', genEMV('05', transactionId)));

    payload.push('6304');

    const stringPayload = payload.join('');
    const crcResult = crc16ccitt(stringPayload).toString(16).toUpperCase().padStart(4, '0');

    const payloadPIX = `${stringPayload}${crcResult}`;

    return {
        payload: () => payloadPIX,
        base64: (options?: QRCodeToDataURLOptions) => qrcode.toDataURL(payloadPIX, options),
    };
}

function generateKey(key: string, message?: string): string {
    const payload: string[] = [genEMV('00', 'BR.GOV.BCB.PIX'), genEMV('01', key)];
    if (message) {
        payload.push(genEMV('02', message));
    }
    return payload.join('');
}

function genEMV(id: string, parameter: string): string {
    const len = parameter.length.toString().padStart(2, '0');
    return `${id}${len}${parameter}`;
}

export { QrCodePixParams, QrCodePix };
