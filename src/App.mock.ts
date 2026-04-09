// ─── 초기값 (create 모드) ─────────────────────────────
export const sampleInitialData = {
  name: '',
  role: '',
  email: '',
}

// ─── 서버 데이터 (edit/view 모드) ─────────────────────
export const sampleServerData = {
  'Scene Number': {
    title: 'Chase sequence through the grand bazaar',
    'Shoot Date': '2026-01-08',
    'Scene ID': 'EA0D-EQF-C28',
    'Scene Type': 'EXT', // [INT|EXT]
    'Script Ref.': '1234-ABCD',
    'Shot No.': 'SH0420001|MASTER',
    'Location Name': 'Grand Bazaar District',
  },
  'Location Information': { 
    'Set Type': 'ON-LOCATION', // [ON-LOCATION|STUDIO]
    'Zone': 'Old Town Quarter', 
    'Director\'s Note': '',
    'Production Credits': { 'Director': '', 'D.O.P.': '' },
    'Shoot Conditions': { 'Shoot Priority': 'medium', 'Lighting Condition': ['featureA'] },
  },
}