### Qrcode generator for the Brazilian payment system PIX

## Installation

```bash
yarn add qrcode-pix
```

## Quick Start

```js
import { QrCodePix } from 'qrcode-pix';

QrCodePix({
    version: '01',
    key: 'test@mail.com.br',
    name: 'Fulano de Tal',
    city: 'SAO PAULO',
}).then((res) => {
    console.log(res); //{payload: '000201010...', qrcode: 'data:image/png;base64,...'}
});
```

## Interface

```js
interface IParameter {
    version: string;
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
```
