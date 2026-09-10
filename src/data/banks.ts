import { Bank } from '../types';

export const POPULAR_BANKS: Bank[] = [
  {
    id: 'vietcombank',
    name: 'Ngân hàng TMCP Ngoại Thương Việt Nam',
    code: 'VCB',
    bin: '970436',
    shortName: 'Vietcombank',
    logo: 'https://api.vietqr.io/img/VCB.png',
    color: '#005f33'
  },
  {
    id: 'techcombank',
    name: 'Ngân hàng TMCP Kỹ thương Việt Nam',
    code: 'TCB',
    bin: '970407',
    shortName: 'Techcombank',
    logo: 'https://api.vietqr.io/img/TCB.png',
    color: '#e31b23'
  },
  {
    id: 'mbbank',
    name: 'Ngân hàng TMCP Quân đội',
    code: 'MB',
    bin: '970422',
    shortName: 'MB Bank',
    logo: 'https://api.vietqr.io/img/MB.png',
    color: '#163884'
  },
  {
    id: 'bidv',
    name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
    code: 'BIDV',
    bin: '970418',
    shortName: 'BIDV',
    logo: 'https://api.vietqr.io/img/BIDV.png',
    color: '#0a4282'
  },
  {
    id: 'vietinbank',
    name: 'Ngân hàng TMCP Công thương Việt Nam',
    code: 'CTG',
    bin: '970415',
    shortName: 'VietinBank',
    logo: 'https://api.vietqr.io/img/CTG.png',
    color: '#0065a9'
  },
  {
    id: 'acb',
    name: 'Ngân hàng TMCP Á Châu',
    code: 'ACB',
    bin: '970416',
    shortName: 'ACB',
    logo: 'https://api.vietqr.io/img/ACB.png',
    color: '#006cb7'
  },
  {
    id: 'tpbank',
    name: 'Ngân hàng TMCP Tiên Phong',
    code: 'TPB',
    bin: '970423',
    shortName: 'TPBank',
    logo: 'https://api.vietqr.io/img/TPB.png',
    color: '#5c2d91'
  },
  {
    id: 'vpbank',
    name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng',
    code: 'VPB',
    bin: '970432',
    shortName: 'VPBank',
    logo: 'https://api.vietqr.io/img/VPB.png',
    color: '#008751'
  }
];

export const ALL_BANKS: Bank[] = [
  ...POPULAR_BANKS,
  {
    id: 'agribank',
    name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn VN',
    code: 'VBA',
    bin: '970405',
    shortName: 'Agribank',
    logo: 'https://api.vietqr.io/img/VBA.png',
    color: '#9e1c24'
  },
  {
    id: 'sacombank',
    name: 'Ngân hàng TMCP Sài Gòn Thương Tín',
    code: 'STB',
    bin: '970403',
    shortName: 'Sacombank',
    logo: 'https://api.vietqr.io/img/STB.png',
    color: '#005b9f'
  },
  {
    id: 'vib',
    name: 'Ngân hàng TMCP Quốc tế Việt Nam',
    code: 'VIB',
    bin: '970441',
    shortName: 'VIB',
    logo: 'https://api.vietqr.io/img/VIB.png',
    color: '#00539c'
  },
  {
    id: 'hdbank',
    name: 'Ngân hàng TMCP Phát triển Thành phố Hồ Chí Minh',
    code: 'HDB',
    bin: '970437',
    shortName: 'HDBank',
    logo: 'https://api.vietqr.io/img/HDB.png',
    color: '#e41e26'
  },
  {
    id: 'ocb',
    name: 'Ngân hàng TMCP Phương Đông',
    code: 'OCB',
    bin: '970448',
    shortName: 'OCB',
    logo: 'https://api.vietqr.io/img/OCB.png',
    color: '#008542'
  },
  {
    id: 'shb',
    name: 'Ngân hàng TMCP Sài Gòn - Hà Nội',
    code: 'SHB',
    bin: '970443',
    shortName: 'SHB',
    logo: 'https://api.vietqr.io/img/SHB.png',
    color: '#f58220'
  },
  {
    id: 'seabank',
    name: 'Ngân hàng TMCP Đông Nam Á',
    code: 'SEAB',
    bin: '970440',
    shortName: 'SeABank',
    logo: 'https://api.vietqr.io/img/SEAB.png',
    color: '#da251d'
  },
  {
    id: 'msb',
    name: 'Ngân hàng TMCP Hàng Hải Việt Nam',
    code: 'MSB',
    bin: '970426',
    shortName: 'MSB',
    logo: 'https://api.vietqr.io/img/MSB.png',
    color: '#eb1b24'
  },
  {
    id: 'namabank',
    name: 'Ngân hàng TMCP Nam Á',
    code: 'NAB',
    bin: '970428',
    shortName: 'Nam A Bank',
    logo: 'https://api.vietqr.io/img/NAB.png',
    color: '#ffd000'
  },
  {
    id: 'lpbank',
    name: 'Ngân hàng TMCP Lộc Phát Việt Nam',
    code: 'LPB',
    bin: '970449',
    shortName: 'LPBank',
    logo: 'https://api.vietqr.io/img/LPB.png',
    color: '#f26522'
  },
  {
    id: 'cake',
    name: 'Ngân hàng số Cake by VPBank',
    code: 'CAKE',
    bin: '546034',
    shortName: 'Cake by VPBank',
    logo: 'https://api.vietqr.io/img/CAKE.png',
    color: '#f03e8b'
  },
  {
    id: 'timo',
    name: 'Ngân hàng số Timo by BVBank',
    code: 'TIMO',
    bin: '963388',
    shortName: 'Timo',
    logo: 'https://api.vietqr.io/img/TIMO.png',
    color: '#7b35ba'
  },
  {
    id: 'kienlongbank',
    name: 'Ngân hàng TMCP Kiên Long',
    code: 'KLB',
    bin: '970452',
    shortName: 'Kienlongbank',
    logo: 'https://api.vietqr.io/img/KLB.png',
    color: '#005f33'
  },
  {
    id: 'bvbank',
    name: 'Ngân hàng TMCP Bản Việt',
    code: 'BVB',
    bin: '970454',
    shortName: 'BVBank',
    logo: 'https://api.vietqr.io/img/BVB.png',
    color: '#006cb7'
  },
  {
    id: 'pvcombank',
    name: 'Ngân hàng TMCP Đại Chúng Việt Nam',
    code: 'PVB',
    bin: '970455',
    shortName: 'PVcomBank',
    logo: 'https://api.vietqr.io/img/PVB.png',
    color: '#ffc20e'
  },
  {
    id: 'bacabank',
    name: 'Ngân hàng TMCP Bắc Á',
    code: 'BAB',
    bin: '970409',
    shortName: 'Bac A Bank',
    logo: 'https://api.vietqr.io/img/BAB.png',
    color: '#9e1c24'
  },
  {
    id: 'shinhanbank',
    name: 'Ngân hàng TNHH MTV Shinhan Việt Nam',
    code: 'SHBVN',
    bin: '970424',
    shortName: 'Shinhan Bank',
    logo: 'https://api.vietqr.io/img/SHBVN.png',
    color: '#00468c'
  },
  {
    id: 'wooribank',
    name: 'Ngân hàng TNHH MTV Woori Việt Nam',
    code: 'WOO',
    bin: '970457',
    shortName: 'Woori Bank',
    logo: 'https://api.vietqr.io/img/WOO.png',
    color: '#005f9e'
  },
  {
    id: 'eximbank',
    name: 'Ngân hàng TMCP Xuất Nhập khẩu Việt Nam',
    code: 'EIB',
    bin: '970431',
    shortName: 'Eximbank',
    logo: 'https://api.vietqr.io/img/EIB.png',
    color: '#00529b'
  },
  {
    id: 'viettelmoney',
    name: 'Tổng Công ty Dịch vụ Số Viettel',
    code: 'VTLMONEY',
    bin: '971005',
    shortName: 'Viettel Money',
    logo: 'https://api.vietqr.io/img/VIETTELMONEY.png',
    color: '#ee0033'
  },
  {
    id: 'vnptmoney',
    name: 'VNPT Money',
    code: 'VNPTMONEY',
    bin: '971011',
    shortName: 'VNPT Money',
    logo: 'https://api.vietqr.io/img/VNPTMONEY.png',
    color: '#0065a9'
  }
];
