import { QrCodePix, QrCodePixParams } from '../src/index';

describe('QRCode PIX Generate', () => {
    it('Test validate version schema', async () => {
        const param: QrCodePixParams = {
            version: '02', //02 is not valid
            key: 'test@mail.com.br',
            name: 'Fulano de Tal',
            city: 'SAO PAULO',
        };
        expect(() => QrCodePix(param)).toThrow(`Version not supported`);
    });
    it('Test QrCode', async () => {
        const response = QrCodePix({
            version: '01',
            key: 'test@mail.com.br',
            name: 'Fulano de Tal',
            city: 'SAO PAULO',
        });
        await expect(response.base64()).resolves.toBe(qrCodeTest);
    });
    it('01 - Basic Payload', async () => {
        const response = QrCodePix({
            version: '01',
            key: 'test@mail.com.br',
            name: 'Fulano de Tal',
            city: 'SAO PAULO',
        });
        expect(response.payload()).toBe(
            '00020101021126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913Fulano de Tal6009SAO PAULO630434FE'
        );
    });
    it('02 - Basic - Currency', async () => {
        const response = QrCodePix({
            version: '01',
            key: 'test@mail.com.br',
            name: 'Fulano de Tal',
            city: 'SAO PAULO',
            currency: 986,
        });
        expect(response.payload()).toBe(
            '00020101021126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913Fulano de Tal6009SAO PAULO630434FE'
        );
    });
    it('03 - Basic - Value', async () => {
        const response = QrCodePix({
            version: '01',
            key: 'test@mail.com.br',
            name: 'Fulano de Tal',
            city: 'SAO PAULO',
            value: 100.99,
        });
        expect(response.payload()).toBe(
            '00020101021126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865406100.995802BR5913Fulano de Tal6009SAO PAULO6304442D'
        );
    });
    it('04 - Basic - countryCode', async () => {
        const response = QrCodePix({
            version: '01',
            key: 'test@mail.com.br',
            name: 'Fulano de Tal',
            city: 'SAO PAULO',
            countryCode: 'BR',
        });
        expect(response.payload()).toBe(
            '00020101021126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913Fulano de Tal6009SAO PAULO630434FE'
        );
    });
    it('05 - Basic - cep', async () => {
        const response = QrCodePix({
            version: '01',
            key: 'test@mail.com.br',
            name: 'Fulano de Tal',
            city: 'SAO PAULO',
            cep: '85000100',
        });
        expect(response.payload()).toBe(
            '00020101021126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913Fulano de Tal6009SAO PAULO61088500010063047B55'
        );
    });
    it('06 - Basic - guid', async () => {
        const response = QrCodePix({
            version: '01',
            key: 'test@mail.com.br',
            name: 'Fulano de Tal',
            city: 'SAO PAULO',
            guid: 'my_guid',
        });
        expect(response.payload()).toBe(
            '00020101021126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913Fulano de Tal6009SAO PAULO62110507my_guid63045CAB'
        );
    });
    it('07 - Basic - message', async () => {
        const response = QrCodePix({
            version: '01',
            key: 'test@mail.com.br',
            name: 'Fulano de Tal',
            city: 'SAO PAULO',
            message: 'is my message :)',
        });
        expect(response.payload()).toBe(
            '00020101021126580014BR.GOV.BCB.PIX0116test@mail.com.br0216is my message :)5204000053039865802BR5913Fulano de Tal6009SAO PAULO6304A2D'
        );
    });
    it('08 - Basic - notRepeatPayment', async () => {
        const response = QrCodePix({
            version: '01',
            key: 'test@mail.com.br',
            name: 'Fulano de Tal',
            city: 'SAO PAULO',
            notRepeatPayment: true,
        });
        expect(response.payload()).toBe(
            '00020101021226380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913Fulano de Tal6009SAO PAULO6304DC67'
        );
    });
    it('should not accept negative values', () => {
        const param: QrCodePixParams = {
            version: '01',
            key: 'test@mail.com.br',
            name: 'Fulano de Tal',
            city: 'SAO PAULO',
            value: -10,
        };
        expect(() => QrCodePix(param)).toThrow('Value must be a positive number');
    });
});

const qrCodeTest =
    'data:image/png;base64,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';
