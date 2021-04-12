import { QrCodePix } from '../src';

const qrCodePix = QrCodePix({
    version: '01',
    key: 'test@mail.com.br', //or any PIX key
    name: 'Fulano de Tal',
    city: 'SAO PAULO',
    transactionId: 'YOUR_TRANSACTION_ID',
    message: 'Pay me :)',
    cep: '99999999',
    value: 150.99,
});

console.log(qrCodePix.payload());

qrCodePix.base64().then((res) => {
    console.log(res);
});
