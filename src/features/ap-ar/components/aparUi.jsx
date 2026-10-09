/* AP/AR pages er shared Tailwind class string + page shell.
   px value arbitrary ([..px]) karon app er --spacing custom (0.27rem). */

export const ROOT = 'min-h-full bg-apar-bg font-apar text-[14.5px] leading-[1.5] text-apar-ink';
export const WRAP = 'mx-auto max-w-[1360px] px-[16px] pb-[48px] pt-[24px]';

export function Page({ children }) {
  return (
    <div className={ROOT}>
      <div className={WRAP}>{children}</div>
    </div>
  );
}

export const MONO = 'font-apar-mono';

/* layout */
export const TOP = 'mb-[18px] flex flex-wrap items-end justify-between gap-[14px]';
export const TOP_SM = 'mb-[8px] flex flex-wrap items-end justify-between gap-[14px]';
export const H1 = 'text-[24px] font-bold tracking-[-.01em]';
export const PANEL = 'min-w-0 rounded-xl border border-apar-line bg-apar-panel p-[20px]';
export const CARD = 'mb-[14px] rounded-xl border border-apar-line bg-apar-panel p-[16px]';
export const GRID = 'grid grid-cols-1 items-start gap-[18px] min-[861px]:grid-cols-[1fr_360px]';
export const SEG = 'mb-[18px] grid grid-cols-2 gap-[10px]';
export const SEG_BTN =
  'cursor-pointer rounded-[10px] border-[1.5px] border-apar-line bg-apar-field px-[14px] py-[12px] text-left text-apar-ink aria-pressed:border-apar-acc aria-pressed:bg-apar-soft';
export const ROW = 'mb-[12px] grid grid-cols-1 gap-[12px]';
export const ROW2 = `${ROW} min-[561px]:grid-cols-2`;
export const ROW3 = `${ROW} min-[561px]:grid-cols-3`;
export const ADDBAR = 'mb-[12px] flex items-center justify-between gap-[10px]';
export const ADDBOX = 'mb-[16px] rounded-[10px] border border-dashed border-apar-acc bg-apar-soft p-[16px]';
export const FILTERS = 'mb-[16px] flex flex-wrap items-end gap-[10px] [&>div]:min-w-[140px]';

/* table */
export const TBLW = 'mx-[-4px] overflow-x-auto';
export const TABLE = 'w-full min-w-[560px] border-collapse';
export const TABLE_SM = 'w-full min-w-[520px] border-collapse';
const THB = 'border-b border-apar-line px-[6px] py-[8px] text-[12.5px] font-medium text-apar-mute';
export const TH = `${THB} text-left`;
export const THN = `${THB} text-right`;
const TDB = 'border-b border-apar-line px-[6px] py-[10px] align-middle';
export const TD = TDB;
export const TDN = `${TDB} text-right`;
export const TD_CR = 'border-b border-apar-line py-[10px] pl-[26px] pr-[6px] align-middle';
export const TD_EMPTY = 'border-b border-apar-line px-0 py-[14px] align-middle text-apar-mute';
export const TF = 'px-[6px] py-[10px] align-middle font-bold';
export const TFN = `${TF} text-right`;

/* small pieces */
export const NT = 'block text-[12.5px]';
export const TAG = 'inline-block rounded-full bg-apar-soft px-[8px] py-[2px] text-[12px] font-medium';
export const TAG_COLOR = { over: 'text-apar-err', part: 'text-apar-warn', paid: 'text-apar-ok', '': '' };
export const BADGE = 'ml-[6px] inline-block rounded-full bg-apar-soft px-[8px] py-[2px] text-[11px] font-bold';
export const LINE = 'flex justify-between py-[5px]';
export const LINE_BIG = 'mt-[8px] flex justify-between border-t border-apar-line pb-[5px] pt-[12px] text-[17px] font-bold';
export const CHK = 'my-[12px] flex items-center gap-[9px] rounded-[9px] bg-apar-soft px-[12px] py-[11px]';
export const STAT = 'mb-[14px] grid grid-cols-2 gap-[10px]';
export const STAT_BOX = 'rounded-[9px] border border-apar-line bg-apar-field px-[12px] py-[10px]';
export const STAT_LABEL = 'block text-[12.5px] text-apar-mute';
export const LI = 'flex justify-between gap-[10px] border-b border-apar-line py-[9px] text-[13.5px]';
export const LI_EMPTY = 'flex justify-between gap-[10px] border-b border-apar-line py-[14px] text-[13.5px] text-apar-mute';
export const LED_SMALL = 'block text-apar-mute';
export const LNX = 'cursor-pointer bg-transparent px-[8px] py-[4px] text-[20px] leading-none text-apar-err';
export const XLINK = 'cursor-pointer bg-transparent p-0 text-[12px] text-apar-err underline';
export const ERR = 'min-h-[20px] text-[13px] text-apar-err';