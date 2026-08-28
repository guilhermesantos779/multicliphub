// Tiny home-grown renderer for the terms `conteudo` field: paragraphs
// separated by a blank line, `## ` prefix promoted to a heading. Content is
// placeholder legal text today, not worth a real markdown dependency for.
function renderBlocks(conteudo: string) {
  return conteudo.split('\n\n').map((block, i) => {
    if (block.startsWith('## ')) {
      return (
        <h3 key={i} className="mb-2 mt-6 text-[14px] font-bold text-white first:mt-0">
          {block.slice(3)}
        </h3>
      )
    }
    return (
      <p key={i} className="mb-3 whitespace-pre-line text-[13px] leading-relaxed text-white/65">
        {block}
      </p>
    )
  })
}

interface TermsContentProps {
  versao: string
  conteudo: string
}

export function TermsContent({ versao, conteudo }: TermsContentProps) {
  return (
    <div>
      <div className="mb-4 rounded-lg border border-[#f59e0b]/25 bg-[#f59e0b]/[0.08] px-3 py-2 text-[11px] font-medium text-[#f59e0b]">
        ⚠️ Texto provisório — aguardando revisão jurídica antes do uso real em produção.
      </div>
      <p className="mb-4 text-[11px] uppercase tracking-wide text-white/30">Versão {versao}</p>
      {renderBlocks(conteudo)}
    </div>
  )
}
