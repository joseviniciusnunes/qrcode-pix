"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodePix = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const polycrc_1 = require("polycrc");
const yup_1 = require("yup");
function QrCodePix({ version, key, city, name, value, message, cep, transactionId = '***', currency = 986, countryCode = 'BR', }) {
    yup_1.string().equals(['01'], 'Version not supported').validateSync(version);
    yup_1.string()
        .min(2, 'countryCode: 2 characters')
        .max(2, 'countryCode: 2 characters')
        .nullable()
        .validateSync(countryCode);
    yup_1.string().min(8, 'cep: 8 characters').max(8, 'cep: 8 characters').nullable().validateSync(cep);
    if (String(value) === '0') {
        value = undefined;
    }
    yup_1.number().nullable().positive('Value must be a positive number').validateSync(value);
    yup_1.string().max(25, 'transactionId: max 25 characters').nullable().validateSync(transactionId);
    const payloadKeyString = generateKey(key, message);
    const payload = [
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
    const buffer = Buffer.from(stringPayload, 'utf8');
    const crc16CCiTT = polycrc_1.crc(16, 0x1021, 0xffff, 0x0000, false);
    const crcResult = crc16CCiTT(buffer).toString(16).toUpperCase().padStart(4, '0');
    const payloadPIX = `${stringPayload}${crcResult}`;
    return {
        payload: () => payloadPIX,
        base64: (options) => qrcode_1.default.toDataURL(payloadPIX, options),
    };
}
exports.QrCodePix = QrCodePix;
function generateKey(key, message) {
    const payload = [genEMV('00', 'BR.GOV.BCB.PIX'), genEMV('01', key)];
    if (message) {
        payload.push(genEMV('02', message));
    }
    return payload.join('');
}
function genEMV(id, parameter) {
    const len = parameter.length.toString().padStart(2, '0');
    return `${id}${len}${parameter}`;
}
