"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodePix = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const polycrc_1 = require("polycrc");
const yup_1 = require("yup");
function QrCodePix(parameter) {
    return __awaiter(this, void 0, void 0, function* () {
        const { version, key, city, name, value, guid, message, cep, notRepeatPayment, currency, countryCode } = parameter;
        if (version !== '01') {
            throw new Error("version is fixed '01'");
        }
        yup_1.string().min(1, 'name: 1-25 characters').max(25, 'name: 1-25 characters').validateSync(name);
        yup_1.string().min(2, 'countryCode: 2 characters').max(2, 'countryCode: 2 characters').nullable().validateSync(countryCode);
        yup_1.string().min(8, 'cep: 8 characters').max(8, 'cep: 8 characters').nullable().validateSync(cep);
        const payloadKeyString = generateKey(key, message);
        const payload = [];
        payload.push(genEMV('00', String(version).padStart(2, '0')));
        payload.push(genEMV('01', !notRepeatPayment ? '11' : '12'));
        payload.push(genEMV('26', payloadKeyString));
        payload.push(genEMV('52', '0000'));
        if (currency) {
            payload.push(genEMV('53', String(currency)));
        }
        else {
            payload.push(genEMV('53', '986'));
        }
        if (value) {
            payload.push(genEMV('54', value.toFixed(2)));
        }
        if (countryCode) {
            payload.push(genEMV('58', countryCode.toUpperCase()));
        }
        else {
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
        const crc16CCiTT = polycrc_1.crc(16, 0x1021, 0xffff, 0x0000, false);
        const crcResult = crc16CCiTT(payloadBuffer).toString(16).toUpperCase();
        const payloadPIX = `${payloadString}${crcResult}`;
        const qrCodeBase64 = yield qrcode_1.default.toDataURL(payloadPIX);
        return {
            payload: payloadPIX,
            qrCode: qrCodeBase64,
        };
    });
}
exports.QrCodePix = QrCodePix;
function generateKey(key, message) {
    const payloadKey = [];
    payloadKey.push(genEMV('00', 'BR.GOV.BCB.PIX'));
    payloadKey.push(genEMV('01', key));
    if (message) {
        payloadKey.push(genEMV('02', message));
    }
    return payloadKey.join('');
}
function generateGUID(guid) {
    const payloadGUID = [];
    payloadGUID.push(genEMV('05', guid));
    return payloadGUID.join('');
}
function genEMV(id, parameter) {
    const len = parameter.length.toString().padStart(2, '0');
    return `${id}${len}${parameter}`;
}
