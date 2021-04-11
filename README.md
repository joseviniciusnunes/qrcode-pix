# QrCode for PIX

### Qrcode generator for the Brazilian payment system PIX

---

[![badge-tests](https://github.com/joseviniciusnunes/qrcode-pix/workflows/Tests/badge.svg)](https://github.com/joseviniciusnunes/qrcode-pix/actions)

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
    guid: 'YOUR_GUID',
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
    guid?: string;
    message?: string;
    cep?: string;
    notRepeatPayment?: boolean; //default: false
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

### Latest revision version: 3.0.2 (2021-04-11)

### Specification by Bacen [(DOC)](https://www.bcb.gov.br/content/estabilidadefinanceira/forumpireunioes/AnexoI-PadroesParaIniciacaodoPix.pdf)
