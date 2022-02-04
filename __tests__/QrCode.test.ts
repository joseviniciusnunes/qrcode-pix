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
            '00020126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913FULANO DE TAL6009SAO PAULO62070503***6304102F'
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
            '00020126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913FULANO DE TAL6009SAO PAULO62070503***6304102F'
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
            '00020126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865406100.995802BR5913FULANO DE TAL6009SAO PAULO62070503***63049359'
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
            '00020126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913FULANO DE TAL6009SAO PAULO62070503***6304102F'
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
            '00020126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913FULANO DE TAL6009SAO PAULO61088500010062070503***63041747'
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
            '00020126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913FULANO DE TAL6009SAO PAULO62210517my_transaction_id630461CE'
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
            '00020126580014BR.GOV.BCB.PIX0116test@mail.com.br0216is my message :)5204000053039865802BR5913FULANO DE TAL6009SAO PAULO62070503***63045A4E'
        );
    });
    it('ignore value zero', () => {
        const response = QrCodePix({
            version: '01',
            key: 'test@mail.com.br',
            name: 'Fulano de Tal',
            city: 'SAO PAULO',
            value: 0,
        });
        expect(response.payload()).toBe(
            '00020126380014BR.GOV.BCB.PIX0116test@mail.com.br5204000053039865802BR5913FULANO DE TAL6009SAO PAULO62070503***6304102F'
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
