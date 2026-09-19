import { MaterialTheme } from '../types';

export interface ThemeConfig {
  id: MaterialTheme;
  name: string;
  colorSwatch: string;
  light: {
    primary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    surface: string;
    surfaceCard: string;
    surfaceVariant: string;
    onSurface: string;
    outline: string;
    cellBase: string;
    cellSelected: string;
    cellRelated: string;
    cellSameNumber: string;
    cellError: string;
    cellInitialText: string;
    cellUserText: string;
  };
  dark: {
    primary: string;
    primaryContainer: string;
    onPrimaryContainer: string;
    surface: string;
    surfaceCard: string;
    surfaceVariant: string;
    onSurface: string;
    outline: string;
    cellBase: string;
    cellSelected: string;
    cellRelated: string;
    cellSameNumber: string;
    cellError: string;
    cellInitialText: string;
    cellUserText: string;
  };
}

export const MATERIAL_THEMES: Record<MaterialTheme, ThemeConfig> = {
  blue: {
    id: 'blue',
    name: 'Google Blue',
    colorSwatch: '#1A73E8',
    light: {
      primary: 'bg-[#1A73E8] text-white hover:bg-[#1557B0]',
      primaryContainer: 'bg-[#E8F0FE] text-[#174EA6]',
      onPrimaryContainer: 'text-[#174EA6]',
      surface: 'bg-[#F8F9FA]',
      surfaceCard: 'bg-white border-[#E0E2E6]',
      surfaceVariant: 'bg-[#F1F3F4]',
      onSurface: 'text-[#202124]',
      outline: 'border-[#DADCE0]',
      cellBase: 'bg-[#F1F3F4] text-[#202124] hover:bg-[#E8EAED]',
      cellSelected: 'bg-[#1A73E8] text-white font-bold',
      cellRelated: 'bg-[#E8F0FE] text-[#174EA6]',
      cellSameNumber: 'bg-[#D2E3FC] text-[#174EA6] font-semibold',
      cellError: 'bg-[#FCE8E6] text-[#C5221F] border-[#EA4335]',
      cellInitialText: 'text-[#202124]',
      cellUserText: 'text-[#1A73E8]',
    },
    dark: {
      primary: 'bg-[#8AB4F8] text-[#202124] hover:bg-[#AECBFA]',
      primaryContainer: 'bg-[#174EA6] text-[#D2E3FC]',
      onPrimaryContainer: 'text-[#D2E3FC]',
      surface: 'bg-[#121316]',
      surfaceCard: 'bg-[#1E2024] border-[#30333A]',
      surfaceVariant: 'bg-[#282B30]',
      onSurface: 'text-[#E8EAED]',
      outline: 'border-[#3C4043]',
      cellBase: 'bg-[#282B30] text-[#E8EAED] hover:bg-[#30333A]',
      cellSelected: 'bg-[#8AB4F8] text-[#202124] font-bold',
      cellRelated: 'bg-[#17304D] text-[#D2E3FC]',
      cellSameNumber: 'bg-[#1C3E69] text-[#D2E3FC] font-semibold',
      cellError: 'bg-[#5C1A17] text-[#F28B82] border-[#EA4335]',
      cellInitialText: 'text-[#E8EAED]',
      cellUserText: 'text-[#8AB4F8]',
    },
  },
  teal: {
    id: 'teal',
    name: 'Pixel Teal',
    colorSwatch: '#00796B',
    light: {
      primary: 'bg-[#00796B] text-white hover:bg-[#004D40]',
      primaryContainer: 'bg-[#E0F2F1] text-[#004D40]',
      onPrimaryContainer: 'text-[#004D40]',
      surface: 'bg-[#F7FAF9]',
      surfaceCard: 'bg-white border-[#E0EAE8]',
      surfaceVariant: 'bg-[#EDF4F3]',
      onSurface: 'text-[#1F2927]',
      outline: 'border-[#D0DCD9]',
      cellBase: 'bg-[#EDF4F3] text-[#1F2927] hover:bg-[#E2ECE9]',
      cellSelected: 'bg-[#00796B] text-white font-bold',
      cellRelated: 'bg-[#E0F2F1] text-[#004D40]',
      cellSameNumber: 'bg-[#B2DFDB] text-[#004D40] font-semibold',
      cellError: 'bg-[#FCE8E6] text-[#C5221F] border-[#EA4335]',
      cellInitialText: 'text-[#1F2927]',
      cellUserText: 'text-[#00796B]',
    },
    dark: {
      primary: 'bg-[#80CBC4] text-[#00332C] hover:bg-[#A7FFEB]',
      primaryContainer: 'bg-[#004D40] text-[#B2DFDB]',
      onPrimaryContainer: 'text-[#B2DFDB]',
      surface: 'bg-[#101514]',
      surfaceCard: 'bg-[#1A2220] border-[#2A3633]',
      surfaceVariant: 'bg-[#222E2B]',
      onSurface: 'text-[#E0ECE9]',
      outline: 'border-[#354642]',
      cellBase: 'bg-[#222E2B] text-[#E0ECE9] hover:bg-[#2A3935]',
      cellSelected: 'bg-[#80CBC4] text-[#00332C] font-bold',
      cellRelated: 'bg-[#0E3530] text-[#B2DFDB]',
      cellSameNumber: 'bg-[#134D46] text-[#B2DFDB] font-semibold',
      cellError: 'bg-[#5C1A17] text-[#F28B82] border-[#EA4335]',
      cellInitialText: 'text-[#E0ECE9]',
      cellUserText: 'text-[#80CBC4]',
    },
  },
  sage: {
    id: 'sage',
    name: 'Forest Sage',
    colorSwatch: '#2E7D32',
    light: {
      primary: 'bg-[#2E7D32] text-white hover:bg-[#1B5E20]',
      primaryContainer: 'bg-[#E8F5E9] text-[#1B5E20]',
      onPrimaryContainer: 'text-[#1B5E20]',
      surface: 'bg-[#F8FAF7]',
      surfaceCard: 'bg-white border-[#E0E8E1]',
      surfaceVariant: 'bg-[#EDF3ED]',
      onSurface: 'text-[#202720]',
      outline: 'border-[#D0DDD1]',
      cellBase: 'bg-[#EDF3ED] text-[#202720] hover:bg-[#E1ECE2]',
      cellSelected: 'bg-[#2E7D32] text-white font-bold',
      cellRelated: 'bg-[#E8F5E9] text-[#1B5E20]',
      cellSameNumber: 'bg-[#C8E6C9] text-[#1B5E20] font-semibold',
      cellError: 'bg-[#FCE8E6] text-[#C5221F] border-[#EA4335]',
      cellInitialText: 'text-[#202720]',
      cellUserText: 'text-[#2E7D32]',
    },
    dark: {
      primary: 'bg-[#A5D6A7] text-[#1B381D] hover:bg-[#C8E6C9]',
      primaryContainer: 'bg-[#1B5E20] text-[#C8E6C9]',
      onPrimaryContainer: 'text-[#C8E6C9]',
      surface: 'bg-[#111512]',
      surfaceCard: 'bg-[#1B221D] border-[#2C382E]',
      surfaceVariant: 'bg-[#242F26]',
      onSurface: 'text-[#E2EBE3]',
      outline: 'border-[#38483B]',
      cellBase: 'bg-[#242F26] text-[#E2EBE3] hover:bg-[#2C3A2F]',
      cellSelected: 'bg-[#A5D6A7] text-[#1B381D] font-bold',
      cellRelated: 'bg-[#16361C] text-[#C8E6C9]',
      cellSameNumber: 'bg-[#1E4E27] text-[#C8E6C9] font-semibold',
      cellError: 'bg-[#5C1A17] text-[#F28B82] border-[#EA4335]',
      cellInitialText: 'text-[#E2EBE3]',
      cellUserText: 'text-[#A5D6A7]',
    },
  },
  terracotta: {
    id: 'terracotta',
    name: 'Terracotta',
    colorSwatch: '#D9531E',
    light: {
      primary: 'bg-[#D9531E] text-white hover:bg-[#B33E10]',
      primaryContainer: 'bg-[#FBE9E2] text-[#8C2C07]',
      onPrimaryContainer: 'text-[#8C2C07]',
      surface: 'bg-[#FAF8F6]',
      surfaceCard: 'bg-white border-[#EBE3DE]',
      surfaceVariant: 'bg-[#F5EFEA]',
      onSurface: 'text-[#26201D]',
      outline: 'border-[#E0D5CE]',
      cellBase: 'bg-[#F5EFEA] text-[#26201D] hover:bg-[#EAE1D9]',
      cellSelected: 'bg-[#D9531E] text-white font-bold',
      cellRelated: 'bg-[#FBE9E2] text-[#8C2C07]',
      cellSameNumber: 'bg-[#F7D2C4] text-[#8C2C07] font-semibold',
      cellError: 'bg-[#FCE8E6] text-[#C5221F] border-[#EA4335]',
      cellInitialText: 'text-[#26201D]',
      cellUserText: 'text-[#D9531E]',
    },
    dark: {
      primary: 'bg-[#FFAB91] text-[#4E1805] hover:bg-[#FFCCBC]',
      primaryContainer: 'bg-[#8C2C07] text-[#FFCCBC]',
      onPrimaryContainer: 'text-[#FFCCBC]',
      surface: 'bg-[#171311]',
      surfaceCard: 'bg-[#241E1A] border-[#3B302B]',
      surfaceVariant: 'bg-[#302722]',
      onSurface: 'text-[#EBE2DC]',
      outline: 'border-[#4A3C35]',
      cellBase: 'bg-[#302722] text-[#EBE2DC] hover:bg-[#3C312B]',
      cellSelected: 'bg-[#FFAB91] text-[#4E1805] font-bold',
      cellRelated: 'bg-[#431F14] text-[#FFCCBC]',
      cellSameNumber: 'bg-[#622817] text-[#FFCCBC] font-semibold',
      cellError: 'bg-[#5C1A17] text-[#F28B82] border-[#EA4335]',
      cellInitialText: 'text-[#EBE2DC]',
      cellUserText: 'text-[#FFAB91]',
    },
  },
  slate: {
    id: 'slate',
    name: 'Neutral Slate',
    colorSwatch: '#546E7A',
    light: {
      primary: 'bg-[#546E7A] text-white hover:bg-[#37474F]',
      primaryContainer: 'bg-[#ECEFF1] text-[#263238]',
      onPrimaryContainer: 'text-[#263238]',
      surface: 'bg-[#F8F9FA]',
      surfaceCard: 'bg-white border-[#CFD8DC]',
      surfaceVariant: 'bg-[#ECEFF1]',
      onSurface: 'text-[#263238]',
      outline: 'border-[#B0BEC5]',
      cellBase: 'bg-[#ECEFF1] text-[#263238] hover:bg-[#E0E4E7]',
      cellSelected: 'bg-[#546E7A] text-white font-bold',
      cellRelated: 'bg-[#E3E7EA] text-[#263238]',
      cellSameNumber: 'bg-[#CFD8DC] text-[#263238] font-semibold',
      cellError: 'bg-[#FCE8E6] text-[#C5221F] border-[#EA4335]',
      cellInitialText: 'text-[#263238]',
      cellUserText: 'text-[#455A64]',
    },
    dark: {
      primary: 'bg-[#B0BEC5] text-[#1C2529] hover:bg-[#CFD8DC]',
      primaryContainer: 'bg-[#37474F] text-[#ECEFF1]',
      onPrimaryContainer: 'text-[#ECEFF1]',
      surface: 'bg-[#121415]',
      surfaceCard: 'bg-[#1D2123] border-[#31373A]',
      surfaceVariant: 'bg-[#272C2F]',
      onSurface: 'text-[#ECEFF1]',
      outline: 'border-[#3D4448]',
      cellBase: 'bg-[#272C2F] text-[#ECEFF1] hover:bg-[#32383C]',
      cellSelected: 'bg-[#B0BEC5] text-[#1C2529] font-bold',
      cellRelated: 'bg-[#222B30] text-[#ECEFF1]',
      cellSameNumber: 'bg-[#323F46] text-[#ECEFF1] font-semibold',
      cellError: 'bg-[#5C1A17] text-[#F28B82] border-[#EA4335]',
      cellInitialText: 'text-[#ECEFF1]',
      cellUserText: 'text-[#B0BEC5]',
    },
  },
};
