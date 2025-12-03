import { VaultDoc, VaultUsage } from '@/components/vault/vault-interface';

export async function getDocuments(): Promise<VaultDoc[]> {
  return [
    {
      id: 'vault-001',
      name: 'Driver License.pdf',
      date: 'Oct 18, 2024',
      tags: ['Identity', 'Priority'],
      size: '420 KB',
    },
    {
      id: 'vault-002',
      name: 'Home Insurance Renewal.pdf',
      date: 'Sep 02, 2024',
      tags: ['Insurance', 'Home', 'Renewal'],
      size: '1.2 MB',
    },
    {
      id: 'vault-003',
      name: 'Q4_2024_Tax_Prep.xlsx',
      date: 'Oct 01, 2024',
      tags: ['Tax 2024', 'Finance'],
      size: '860 KB',
    },
    {
      id: 'vault-004',
      name: 'MRI_Report_Results.pdf',
      date: 'Aug 22, 2024',
      tags: ['Medical', 'Lab'],
      size: '2.4 MB',
    },
    {
      id: 'vault-005',
      name: 'Vendor_NDA_v3.docx',
      date: 'Jul 15, 2024',
      tags: ['Legal', 'Contract'],
      size: '310 KB',
    },
  ];
}

export async function getVaultUsage(): Promise<VaultUsage> {
  return {
    percent: 64,
  };
}
