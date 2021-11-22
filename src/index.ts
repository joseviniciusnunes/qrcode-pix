import qrcode, { QRCodeToDataURLOptions } from 'qrcode';
import { crc } from 'polycrc';
import { string, number, boolean } from 'yup';

import ValidateName from './ValidateName';

interface QrCodePixParams {
    version: string;
    key: string;
    city: string;
    name: string;
    value?: number;
    transactionId?: string;
    message?: string;
    cep?: string;
    notRepeatPayment?: boolean;
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
    notRepeatPayment,
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

    number().nullable().positive('Value must be a positive number').validateSync(value);

    boolean().nullable().validateSync(notRepeatPayment);

    ValidateName.validate(name);

    const payloadKeyString = generateKey(key, message);

    const payload: string[] = [
        genEMV('00', version),
        genEMV('01', !notRepeatPayment ? '11' : '12'),
        genEMV('26', payloadKeyString),
        genEMV('52', '0000'),
        genEMV('53', String(currency)),
    ];

    if (value) {
        payload.push(genEMV('54', value.toFixed(2)));
    }

    payload.push(genEMV('58', countryCode.toUpperCase()));
    payload.push(genEMV('59', name));
    payload.push(genEMV('60', city.toUpperCase()));

    if (cep) {
        payload.push(genEMV('61', cep));
    }

    payload.push(genEMV('62', genEMV('05', transactionId)));

    payload.push('6304');

    const stringPayload = payload.join('');
    const buffer = Buffer.from(stringPayload, 'utf8');

    const crc16CCiTT = crc(16, 0x1021, 0xffff, 0x0000, false);
    const crcResult = crc16CCiTT(buffer).toString(16).toUpperCase().padStart(4, '0');

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
