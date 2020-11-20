import qrcode from 'qrcode';
import { crc } from 'polycrc';
import { string } from 'yup';

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

async function QrCodePix(parameter: IParameter): Promise<IResponse> {
    const { version, key, city, name, value, guid, message, cep, notRepeatPayment, currency, countryCode } = parameter;

    string().min(1, 'name: 1-25 characters').max(25, 'name: 1-25 characters').validateSync(name);

    string().min(2, 'countryCode: 2 characters').max(2, 'countryCode: 2 characters').nullable().validateSync(countryCode);

    const payloadKeyString = generateKey(key, message);

    const payload = [];
    payload.push(genEMV('00', String(version).padStart(2, '0')));
    payload.push(genEMV('01', !notRepeatPayment ? '11' : '12'));
    payload.push(genEMV('26', payloadKeyString));
    payload.push(genEMV('52', '0000'));

    if (currency) {
        payload.push(genEMV('53', String(currency)));
    } else {
        payload.push(genEMV('53', '986'));
    }

    if (value) {
        payload.push(genEMV('54', value.toFixed(2)));
    }

    if (countryCode) {
        payload.push(genEMV('58', countryCode.toUpperCase()));
    } else {
        payload.push(genEMV('58', 'BR'));
    }

    payload.push(genEMV('59', name));
    payload.push(genEMV('60', city.toUpperCase()));

    if (cep) {
        payload.push(genEMV('61', cep));
    }

    if (guid) {
        payload.push(genEMV('62', generateGUID(guid)));
    }

    payload.push('6304');

    const payloadString = payload.join('');
    const payloadBuffer = Buffer.from(payloadString, 'utf8');

    const crc16CCiTT = crc(16, 0x1021, 0xffff, 0x0000, false);
    const crcResult = crc16CCiTT(payloadBuffer).toString(16).toUpperCase();

    const payloadPIX = `${payloadString}${crcResult}`;

    const qrCodeBase64 = await qrcode.toDataURL(payloadPIX);

    return {
        payload: payloadPIX,
        qrCode: qrCodeBase64,
    };
}

function generateKey(key: string, message?: string): string {
    const payloadKey = [];
    payloadKey.push(genEMV('00', 'BR.GOV.BCB.PIX'));
    payloadKey.push(genEMV('01', key));
    if (message) {
        payloadKey.push(genEMV('02', message));
    }
    return payloadKey.join('');
}

function generateGUID(guid: string): string {
    const payloadGUID = [];
    payloadGUID.push(genEMV('05', guid));
    return payloadGUID.join('');
}

function genEMV(id: string, parameter: string): string {
    const len = parameter.length.toString().padStart(2, '0');
    return `${id}${len}${parameter}`;
}

export {QrCodePix};

