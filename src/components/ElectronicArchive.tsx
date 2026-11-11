import { useState, type Key } from 'react';
import { ChevronLeft, ChevronRight, Download, Layers, ArrowLeft, ArrowRight } from 'lucide-react';
import { Case } from '../types';
import BottomSheet from './BottomSheet';

/** 电子卷宗：卷宗目录 / 分类文件夹 / 附件预览 */

type ArchiveTabKey = 'zhengjuan' | 'qingqiu' | 'zhengju' | 'qita';
type FileKind = 'pdf' | 'word' | 'image';

interface ArchiveFile {
  id: string;
  name: string;
  kind: FileKind;
  badge: string; // 页数或格式标签
}

interface ArchiveFolder {
  id: string;
  name: string;
  files: ArchiveFile[];
  /** 子目录：存在时先展示子目录列表，再进入具体附件 */
  children?: ArchiveFolder[];
}

// 文件图标与配色：PDF 红 / Word 蓝 / 图片绿
const fileIcon: Record<FileKind, string> = {
  pdf: 'fa-solid fa-file-pdf text-red-500',
  word: 'fa-solid fa-file-word text-blue-500',
  image: 'fa-solid fa-file-image text-emerald-500',
};

// ── 数据：当事人主体材料（四个子目录）──
const PARTY_FOLDERS: ArchiveFolder[] = [
  {
    id: 'm1',
    name: '申请人',
    files: [
      { id: 'm1-1', name: '申请人营业执照.pdf', kind: 'pdf', badge: '2页' },
      { id: 'm1-2', name: '申请方法定代表人身份证明.pdf', kind: 'pdf', badge: '1页' },
      { id: 'm1-3', name: '申请人企业信用信息公示报告.pdf', kind: 'pdf', badge: '6页' },
    ],
  },
  {
    id: 'm2',
    name: '申请人代理人',
    files: [
      { id: 'm2-1', name: '申请人授权委托书.pdf', kind: 'pdf', badge: '2页' },
      { id: 'm2-2', name: '代理人身份证正反面.jpg', kind: 'image', badge: 'JPG' },
      { id: 'm2-3', name: '代理人律师执业证.pdf', kind: 'pdf', badge: '3页' },
    ],
  },
  {
    id: 'm3',
    name: '被申请人',
    files: [
      { id: 'm3-1', name: '被申请人营业执照.pdf', kind: 'pdf', badge: '2页' },
      { id: 'm3-2', name: '被申请方法定代表人身份证明.pdf', kind: 'pdf', badge: '1页' },
    ],
  },
  {
    id: 'm4',
    name: '被申请人代理人',
    files: [
      { id: 'm4-1', name: '被申请人授权委托书.pdf', kind: 'pdf', badge: '2页' },
      { id: 'm4-2', name: '代理人身份证明及工作证明.pdf', kind: 'pdf', badge: '2页' },
    ],
  },
];

// ── 数据：送达回证、公告、邮单 ──
const SONGDA_FILES: ArchiveFile[] = [
  { id: 'sd1', name: '送达回证（申请人）.pdf', kind: 'pdf', badge: '2页' },
  { id: 'sd2', name: '送达回证（被申请人）.pdf', kind: 'pdf', badge: '2页' },
  { id: 'sd3', name: '仲裁公告.pdf', kind: 'pdf', badge: '1页' },
  { id: 'sd4', name: 'EMS邮单及投递查询记录.pdf', kind: 'pdf', badge: '4页' },
];

// ── 数据：正卷目录 ──
const ZHENGJUAN_FOLDERS: ArchiveFolder[] = [
  {
    id: 'z1',
    name: '仲裁申请书',
    files: [
      { id: 'z1-1', name: '01_仲裁申请书_盖章本.pdf', kind: 'pdf', badge: '5页' },
      { id: 'z1-2', name: '02_法定代表人身份证明.pdf', kind: 'pdf', badge: '2页' },
    ],
  },
  {
    id: 'z2',
    name: '仲裁协议',
    files: [{ id: 'z2-1', name: '03_买卖合同补充协议.docx', kind: 'word', badge: 'DOCX' }],
  },
  { id: 'z3', name: '管辖权异议及裁决、决定', files: [] },
  {
    id: 'z4',
    name: '答辩状及附件',
    files: [
      { id: 'z4-1', name: '04_答辩状.pdf', kind: 'pdf', badge: '4页' },
      { id: 'z4-2', name: '05_反证材料清单.pdf', kind: 'pdf', badge: '3页' },
      { id: 'z4-3', name: '06_授权委托书.docx', kind: 'word', badge: 'DOCX' },
    ],
  },
  {
    id: 'z4a',
    name: '当事人主体材料',
    files: [],
    children: PARTY_FOLDERS,
  },
  {
    id: 'z5',
    name: '申请人、被申请人举证材料',
    files: [
      { id: 'z5-1', name: '07_申请人证据目录.pdf', kind: 'pdf', badge: '2页' },
      { id: 'z5-2', name: '08_被申请人证据目录.pdf', kind: 'pdf', badge: '2页' },
      { id: 'z5-3', name: '09_送货单与对账明细.pdf', kind: 'pdf', badge: '12页' },
      { id: 'z5-4', name: '10_现场勘验照片汇总.jpg', kind: 'image', badge: 'JPG' },
      { id: 'z5-5', name: '11_银行转账凭证.pdf', kind: 'pdf', badge: '6页' },
    ],
  },
  { id: 'z6', name: '询问、调查资料', files: [] },
  { id: 'z7', name: '质证笔录、庭审笔录、调解笔录', files: [] },
  { id: 'z8', name: '各种质证意见、各种情况说明、代理词', files: [] },
  {
    id: 'z8a',
    name: '送达回证、公告、邮单',
    files: SONGDA_FILES,
  },
  { id: 'z9', name: '其他材料', files: [] },
];

// ── 数据：请求和答辩 ──
const QINGQIU_FOLDERS: ArchiveFolder[] = [
  {
    id: 'q1',
    name: '申请人仲裁请求材料',
    files: [
      { id: 'q1-1', name: '仲裁请求事项清单.pdf', kind: 'pdf', badge: '3页' },
      { id: 'q1-2', name: '请求金额计算说明.docx', kind: 'word', badge: 'DOCX' },
    ],
  },
  {
    id: 'q2',
    name: '被申请人答辩材料',
    files: [
      { id: 'q2-1', name: '答辩意见.pdf', kind: 'pdf', badge: '5页' },
      { id: 'q2-2', name: '答辩证据清单.pdf', kind: 'pdf', badge: '2页' },
      { id: 'q2-3', name: '授权委托书.docx', kind: 'word', badge: 'DOCX' },
    ],
  },
  {
    id: 'q3',
    name: '反请求及答辩材料',
    files: [
      { id: 'q3-1', name: '仲裁反请求申请书.pdf', kind: 'pdf', badge: '4页' },
      { id: 'q3-2', name: '反请求答辩意见.pdf', kind: 'pdf', badge: '3页' },
    ],
  },
];

// ── 数据：证据和质证 ──
const ZHENGJU_FOLDERS: ArchiveFolder[] = [
  {
    id: 'e1',
    name: '申请人举证材料',
    files: [
      { id: 'e1-1', name: '申请人证据目录.pdf', kind: 'pdf', badge: '2页' },
      { id: 'e1-2', name: '买卖合同及补充协议.pdf', kind: 'pdf', badge: '18页' },
      { id: 'e1-3', name: '送货单与对账明细.pdf', kind: 'pdf', badge: '12页' },
    ],
  },
  {
    id: 'e2',
    name: '被申请人举证材料',
    files: [
      { id: 'e2-1', name: '被申请人证据目录.pdf', kind: 'pdf', badge: '2页' },
      { id: 'e2-2', name: '付款凭证汇总.pdf', kind: 'pdf', badge: '7页' },
    ],
  },
  {
    id: 'e3',
    name: '仲裁庭依职权调取证据',
    files: [{ id: 'e3-1', name: '现场勘验笔录.pdf', kind: 'pdf', badge: '6页' }],
  },
];

// ── 数据：其他材料（附件直接列表）──
const QITA_FILES: ArchiveFile[] = [
  { id: 'o1', name: '送达回证.pdf', kind: 'pdf', badge: '2页' },
  { id: 'o2', name: '现场勘验照片.jpg', kind: 'image', badge: 'JPG' },
  { id: 'o3', name: '案件受理通知书.pdf', kind: 'pdf', badge: '1页' },
  { id: 'o4', name: '缴费凭证.pdf', kind: 'pdf', badge: '1页' },
];

// 递归汇总目录内附件（含子目录），用于件数计数与「查看全部」
const collectFolderFiles = (folder: ArchiveFolder): ArchiveFile[] =>
  folder.children ? folder.children.flatMap(collectFolderFiles) : folder.files;

// 文件夹行：文件夹图标 + 名称 → 附件数量 + 箭头
function FolderRow({
  folder,
  onOpen,
  index,
}: {
  key?: Key;
  folder: ArchiveFolder;
  onOpen: () => void;
  index?: number;
}) {
  return (
    <button
      onClick={onOpen}
      className="w-full p-3 flex items-center justify-between text-left hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3 min-w-0">
        {index !== undefined && (
          <span className="text-sm font-mono text-slate-400 flex-shrink-0">
            {String(index + 1).padStart(2, '0')}
          </span>
        )}
        <i className="fa-solid fa-folder text-amber-500 text-lg flex-shrink-0" aria-hidden="true"></i>
        <span className="text-base font-medium text-slate-800 truncate">{folder.name}</span>
      </div>
      <div className="flex items-center gap-1.5 text-slate-400 flex-shrink-0">
        <span className="text-sm">{collectFolderFiles(folder).length} 份附件</span>
        <ChevronRight size={14} className="text-slate-300" />
      </div>
    </button>
  );
}

// 文件缩略卡：页面缩略图（图标 + 页数/格式角标）+ 文件名
function FileThumbCard({
  file,
  tone = 'muted',
  onOpen,
}: {
  key?: Key;
  file: ArchiveFile;
  tone?: 'muted' | 'surface';
  onOpen: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className={`border rounded-xl  flex flex-col items-center cursor-pointer hover:border-brand-primary active:bg-slate-50 transition-colors ${
        tone === 'surface' ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200/80'
      }`}
    >
      <div
        className={`w-full h-24 rounded-t-xl flex items-center justify-center relative overflow-hidden border-b border-slate-100 ${
          tone === 'surface' ? 'bg-slate-50' : 'bg-white'
        }`}
      >
        <i className={`${fileIcon[file.kind]} text-3xl`} aria-hidden="true"></i>
        <span className="absolute bottom-1 right-1 bg-slate-800/80 text-white text-xs px-1 rounded">
          {file.badge}
        </span>
      </div>
      <p className="mt-2 mb-2 px-2 w-full truncate text-center text-sm font-medium text-slate-700">{file.name}</p>
    </button>
  );
}

// 文件夹附件网格（含空态）
function FileGrid({ files, onOpen }: { files: ArchiveFile[]; onOpen: (index: number) => void }) {
  if (files.length === 0) {
    return <div className="py-10 text-center text-sm text-slate-400">该文件夹暂无附件</div>;
  }
  return (
    <div className="grid grid-cols-2 gap-2.5 pb-1">
      {files.map((file, index) => (
        <FileThumbCard key={file.id} file={file} onOpen={() => onOpen(index)} />
      ))}
    </div>
  );
}

interface ElectronicArchiveProps {
  caseItem: Case;
  onBack: () => void;
}

export default function ElectronicArchive({ caseItem, onBack }: ElectronicArchiveProps) {
  const [activeTab, setActiveTab] = useState<ArchiveTabKey>('zhengjuan');
  const [openFolder, setOpenFolder] = useState<ArchiveFolder | null>(null);
  const [openSubFolder, setOpenSubFolder] = useState<ArchiveFolder | null>(null);
  const [preview, setPreview] = useState<{ files: ArchiveFile[]; index: number } | null>(null);

  const allZhengjuanFiles = ZHENGJUAN_FOLDERS.flatMap(collectFolderFiles);
  const allQingqiuFiles = QINGQIU_FOLDERS.flatMap(collectFolderFiles);
  const allZhengjuFiles = ZHENGJU_FOLDERS.flatMap((folder) => folder.files);

  const tabs: { key: ArchiveTabKey; label: string; count: number }[] = [
    { key: 'zhengjuan', label: '正卷', count: ZHENGJUAN_FOLDERS.length },
    { key: 'qingqiu', label: '请求和答辩', count: QINGQIU_FOLDERS.length },
    { key: 'zhengju', label: '证据和质证', count: ZHENGJU_FOLDERS.length },
    { key: 'qita', label: '其他材料', count: QITA_FILES.length },
  ];

  // 打开目录时重置下钻层级
  const openArchiveFolder = (folder: ArchiveFolder) => {
    setOpenFolder(folder);
    setOpenSubFolder(null);
  };

  const closeArchiveFolder = () => {
    setOpenFolder(null);
    setOpenSubFolder(null);
  };

  const openPreview = (files: ArchiveFile[], index: number) => {
    if (files.length === 0) return;
    setPreview({ files, index });
  };

  const previewDoc = preview ? preview.files[preview.index] : null;

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden animate-slide-in relative">
      {/* 顶部导航栏 */}
      <div className="h-12 bg-[#ddecff] border-b border-slate-100 flex items-center px-4 relative flex-shrink-0">
        <button
          onClick={onBack}
          aria-label="返回上一页"
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-chevron-left text-xs" aria-hidden="true"></i>
          <span className="text-sm">返回</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-800 whitespace-nowrap">
          电子卷宗
        </div>
        
      </div>

      {/* 卷宗分类切换 */}
      <div className="bg-white border-b border-slate-100 flex-shrink-0">
        <div role="tablist" aria-label="卷宗分类" className="flex gap-5 px-4 overflow-x-auto no-scrollbar">
          {tabs.map((t) => {
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(t.key)}
                className={`shrink-0 flex items-center gap-1 py-3 border-b-2 text-base transition-colors cursor-pointer ${
                  active
                    ? 'border-brand-primary text-indigo-600 '
                    : 'border-transparent text-slate-600 hover:text-slate-800'
                }`}
              >
                <span>{t.label}</span>
                <span
                  className={`text-xs px-1.5 rounded-full font-medium ${
                    active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {t.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 pb-6 bg-slate-50">
        {/* 正卷目录 */}
        {activeTab === 'zhengjuan' && (
          <div className="space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm text-slate-500">卷宗（共 {ZHENGJUAN_FOLDERS.length} 个文件夹）</span>
              <button
                onClick={() =>
                  openArchiveFolder({ id: 'all', name: '正卷附件', files: allZhengjuanFiles })
                }
                className="flex items-center gap-1 text-sm text-indigo-600 font-medium cursor-pointer"
              >
                <Layers size={13} />
                查看全部
              </button>
            </div>
            <div className="bg-white rounded-lg border border-slate-100 ">
              {ZHENGJUAN_FOLDERS.map((folder, idx) => (
                <div key={folder.id}>
                  <FolderRow folder={folder} onOpen={() => openArchiveFolder(folder)} />
                  {idx < ZHENGJUAN_FOLDERS.length - 1 && <div className="mx-3.5 border-b border-slate-100"></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 请求和答辩 */}
        {activeTab === 'qingqiu' && (
          <div className="space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm text-slate-500">请求与答辩（共 {QINGQIU_FOLDERS.length} 个文件夹）</span>
              <button
                onClick={() =>
                  openArchiveFolder({ id: 'all-qingqiu', name: '请求与答辩附件', files: allQingqiuFiles })
                }
                className="flex items-center gap-1 text-sm text-indigo-600 font-medium cursor-pointer"
              >
                <Layers size={13} />
                查看全部
              </button>
            </div>
            <div className="bg-white rounded-lg border border-slate-100 ">
              {QINGQIU_FOLDERS.map((folder, idx) => (
                <div key={folder.id}>
                  <FolderRow folder={folder} onOpen={() => openArchiveFolder(folder)} />
                  {idx < QINGQIU_FOLDERS.length - 1 && <div className="mx-3.5 border-b border-slate-100"></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 证据和质证 */}
        {activeTab === 'zhengju' && (
          <div className="space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm text-slate-500">证据和质证（共 {ZHENGJU_FOLDERS.length} 个文件夹）</span>
              <button
                onClick={() =>
                  openArchiveFolder({ id: 'all-zhengju', name: '证据和质证附件', files: allZhengjuFiles })
                }
                className="flex items-center gap-1 text-sm text-indigo-600 font-medium cursor-pointer"
              >
                <Layers size={13} />
                查看全部
              </button>
            </div>
            <div className="bg-white rounded-lg border border-slate-100 ">
              {ZHENGJU_FOLDERS.map((folder, idx) => (
                <div key={folder.id}>
                  <FolderRow folder={folder} onOpen={() => openArchiveFolder(folder)} />
                  {idx < ZHENGJU_FOLDERS.length - 1 && <div className="mx-3.5 border-b border-slate-100"></div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 其他材料（附件直接列表） */}
        {activeTab === 'qita' && (
          <div className="space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between px-1">
              <span className="text-sm text-slate-500">其他材料（共 {QITA_FILES.length} 份）</span>
              <button className="flex items-center gap-1 text-sm text-indigo-600 font-medium cursor-pointer">
                <Download size={13} />
                一键下载
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {QITA_FILES.map((file, index) => (
                <FileThumbCard
                  key={file.id}
                  file={file}
                  tone="surface"
                  onOpen={() => openPreview(QITA_FILES, index)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 文件夹附件面板 */}
      <BottomSheet
        open={openFolder !== null}
        onClose={closeArchiveFolder}
        title={openSubFolder ? openSubFolder.name : openFolder?.name}
        maxHeight="105vh"
        footer={
          <button className="w-full py-2 bg-indigo-50 text-indigo-600 font-bold text-base rounded-lg border border-indigo-100 flex items-center justify-center gap-1.5 hover:bg-indigo-100 transition-colors cursor-pointer">
            <Download size={15} />
            一键下载
          </button>
        }
      >
        {openSubFolder ? (
          <div className="space-y-2.5">
            <button
              onClick={() => setOpenSubFolder(null)}
              aria-label={`返回${openFolder?.name ?? '目录'}`}
              className="flex items-center gap-1 py-1 text-sm text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
              返回{openFolder?.name}
            </button>
            <FileGrid
              files={openSubFolder.files}
              onOpen={(index) => openPreview(openSubFolder.files, index)}
            />
          </div>
        ) : openFolder?.children ? (
          <div className="bg-white rounded-lg border border-slate-100">
            {openFolder.children.map((child, idx) => (
              <div key={child.id}>
                <FolderRow folder={child} index={idx} onOpen={() => setOpenSubFolder(child)} />
                {idx < (openFolder.children?.length ?? 0) - 1 && (
                  <div className="mx-3.5 border-b border-slate-100"></div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <FileGrid
            files={openFolder?.files ?? []}
            onOpen={(index) => openPreview(openFolder?.files ?? [], index)}
          />
        )}
      </BottomSheet>

      {/* 全屏预览 */}
      {preview && previewDoc && (
        <div className="absolute inset-0 bg-slate-900 z-50 flex flex-col animate-fade-in">
          {/* 顶部：返回 + 文件名 + 计数 */}
          <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between flex-shrink-0 border-b border-slate-700">
            <button
              onClick={() => setPreview(null)}
              className="flex items-center gap-1.5 text-slate-300 hover:text-white text-sm font-medium cursor-pointer"
            >
              <ChevronLeft size={15} />
              返回目录
            </button>
            <span className="text-sm font-bold truncate max-w-[140px] text-center">
              {previewDoc.name}
            </span>
            <span className="text-xs text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full flex-shrink-0">
              {preview.index + 1} / {preview.files.length}
            </span>
          </div>

          {/* 预览主区 */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
            <div className="w-full h-full bg-white rounded-xl shadow-2xl relative flex flex-col items-center justify-center p-6 text-center gap-3 overflow-hidden">
              <i className={`${fileIcon[previewDoc.kind]} text-6xl`} aria-hidden="true"></i>
              <div className="relative z-10">
                <h4 className="text-lg font-bold text-slate-800 break-all">{previewDoc.name}</h4>
                <p className="text-sm text-slate-400 mt-1">
                  司法级电子卷宗高清渲染文档（支持手势缩放与水印校验）
                </p>
              </div>
              {/* 合规水印 */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                aria-hidden="true"
              >
                <span className="text-slate-900/10 font-bold text-xl rotate-[-25deg] whitespace-nowrap">
                  {caseItem.caseNo} · 电子卷宗专用
                </span>
              </div>
            </div>
          </div>

          {/* 底部：上一份 / 下一份 */}
          <div className="bg-slate-800 border-t border-slate-700 px-6 py-3 flex items-center justify-between flex-shrink-0">
            <button
              onClick={() => setPreview({ files: preview.files, index: preview.index - 1 })}
              disabled={preview.index === 0}
              aria-label="上一份"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              上一份
            </button>
            <button
              onClick={() => setPreview({ files: preview.files, index: preview.index + 1 })}
              disabled={preview.index === preview.files.length - 1}
              aria-label="下一份"
              className="px-4 py-2 bg-brand-primary hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              下一份
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}