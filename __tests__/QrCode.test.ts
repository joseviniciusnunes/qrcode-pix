import {QrCodePix} from '../lib/index';

async function start() {
    const response = await QrCodePix({
        version: 1,
        key: 'test@mail.com.br',
        value: 1,
        name: 'Fulano de Tal',
        city: 'SAO PAULO',
        message: 'Thank you :)',
        guid: 'YOUR_GUID',
    });
    console.log(response);
}

start();
