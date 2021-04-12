import { QrCodePix, QrCodePixParams } from '../src/index';

describe('QRCode PIX Generate', () => {
    it('Test validate version schema', async () => {
        const param: QrCodePixParams = {
            version: '02', //02 is not valid
            key: 'test@mail.com.br',
            name: 'Fulano de Tal',
            city: 'SAO PAULO',
        };
        expect(() => QrCodePix(param)).toThrow('Version not supported');
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
            '00020101021126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913Fulano de Tal6009SAO PAULO62070503***6304BCD7'
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
            '00020101021126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913Fulano de Tal6009SAO PAULO62070503***6304BCD7'
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
            '00020101021126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865406100.995802BR5913Fulano de Tal6009SAO PAULO62070503***6304B432'
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
            '00020101021126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913Fulano de Tal6009SAO PAULO62070503***6304BCD7'
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
            '00020101021126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913Fulano de Tal6009SAO PAULO61088500010062070503***6304558C'
        );
    });
    it('06 - Basic - Transaction ID', async () => {
        const response = QrCodePix({
            version: '01',
            key: 'test@mail.com.br',
            name: 'Fulano de Tal',
            city: 'SAO PAULO',
            transactionId: 'my_transaction_id',
        });
        expect(response.payload()).toBe(
            '00020101021126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913Fulano de Tal6009SAO PAULO62210517my_transaction_id63046247'
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
            '00020101021126580014BR.GOV.BCB.PIX0116test@mail.com.br0216is my message :)5204000053039865802BR5913Fulano de Tal6009SAO PAULO62070503***6304A39D'
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
            '00020101021226380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913Fulano de Tal6009SAO PAULO62070503***63042CF0'
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
