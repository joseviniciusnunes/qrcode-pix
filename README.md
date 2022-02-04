<p align="center">
  <img src="https://user-images.githubusercontent.com/22475804/114474255-346b1a00-9bcc-11eb-877f-0095c6fd5dba.jpg" height="200px" />
  <h1 align="center">QR Code PIX - NodeJS</h1>
</p>
<br />

QR Code generator for the Brazilian payment system PIX

[![badge-tests](https://github.com/joseviniciusnunes/qrcode-pix/workflows/Tests/badge.svg)](https://github.com/joseviniciusnunes/qrcode-pix/actions)
[![npm-version](https://img.shields.io/npm/v/qrcode-pix?color=brightgreen&label=npm%20package)](https://www.npmjs.com/package/qrcode-pix)

---

## Installation

```bash
yarn add qrcode-pix --exact
```

or

```bash
npm i qrcode-pix --save-exact
```

---

## Quick Start

```js
import { QrCodePix } from 'qrcode-pix';

const qrCodePix = QrCodePix({
    version: '01',
    key: 'test@mail.com.br', //or any PIX key
    name: 'Fulano de Tal',
    city: 'SAO PAULO',
    transactionId: 'YOUR_TRANSACTION_ID', //max 25 characters
    message: 'Pay me :)',
    cep: '99999999',
    value: 150.99,
});

console.log(qrCodePix.payload()); // '00020101021126510014BR.GOV.BCB.PIX...'
console.log(await qrCodePix.base64()); // 'data:image/png;base64,iVBORw0...'
```

---

## Interface

```js
interface IParameter {
    version: string;
    key: string;
    city: string;
    name: string;
    value?: number;
    transactionId?: string;
    message?: string;
    cep?: string;
    currency?: number; //default: 986 ('R$')
    countryCode?: string; //default: 'BR'
}

interface IResponse {
    payload: () => string; //payload for QrCode
    base64: (options?) => Promise<string>; //QrCode image base64
}
```

---

## Specification

### Latest revision version: 3.0.2 (2022-02-04)

### Specification by Bacen [(DOC)](https://www.bcb.gov.br/content/estabilidadefinanceira/forumpireunioes/AnexoI-PadroesParaIniciacaodoPix.pdf)

---

## Donate

### Contribute to keeping revisions up to date.

<img src="https://user-images.githubusercontent.com/22475804/152584043-f4e28661-66e5-4fef-a0c0-25ddea08a41d.png" height="100px" />
