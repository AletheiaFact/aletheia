# Writing the Review Log

Source: *Manual de Checagem*, Checagem → A) O que é Review Log?, and
Pós-Checagem.

The review form on Aletheia maps to the manual's Review Log like this:

| Form field (web) | Tool field | Manual |
| --- | --- | --- |
| Resumo da conclusão | `summary` | Descrição do conteúdo + resumo da conclusão |
| Quais perguntas a verificação deverá responder? | `questions` (list) | Perguntas norteadoras |
| Relatório da verificação | `report` | Relatório de verificação |
| Como verificamos? | `verification` | Metodologia de checagem |
| Links inside the text | `sources` | Apresentação das fontes |
| Classificação | `classification` | Etiqueta |

Checker name, dates and cross-checker are recorded by the platform.

## Field by field

**`questions`** — 2–5 questions, each one sentence ending in "?", each
answerable with evidence. Mix objective, qualitative and quantitative as the
claim needs. No question the report does not answer.

**`report`** — answer the questions in order, one short paragraph each (use
line breaks between paragraphs). State what each source shows, with the
numbers, dates and names. Show calculations (e.g. the 10% test for
`exaggerated`). Separate what was said from what the evidence shows. No
opinion, no adjectives about the speaker, no speculation about intent beyond
what `misleading` requires and the evidence shows.

**`verification`** — the method in 2–4 sentences: which databases/documents,
which filters (period, place, indicator), which searches, what could not be
accessed. Someone else must be able to repeat it.

**`summary`** — 2–3 sentences, written last: what was said, what the
evidence shows, and the conclusion in words that match the label. Do not
start with the label name; let the text carry it.

**`sources`** — every source you rely on, each attached to the field it
supports:

```json
{ "href": "https://…", "field": "report", "quotedText": "exact words from the report this source backs" }
```

`quotedText` must be copied exactly from that field's text (it becomes the
link). Keep it short — the key phrase or number. At least one source in
`report`; put the decisive one in `summary` too when possible.

**`classification`** — one value from `labels.md`.

## Worked example

Claim: Gshow article about Diana, May 6 2023. Sentence:

> Princesa de Gales ou somente Lady Di, são algumas das alcunhas pelas quais
> ficou conhecida Diana Spencer, que morreu há 25 anos em um acidente
> automobilístico em Paris.

`save_review_log` arguments:

```json
{
  "dataHash": "92a02146a2e1fc0557b63a6f1dedd4e7",
  "questions": [
    "Diana Spencer era conhecida como Princesa de Gales e Lady Di?",
    "Diana morreu em um acidente de carro em Paris?",
    "Em maio de 2023, fazia 25 anos da morte de Diana?"
  ],
  "report": "Diana Spencer recebeu o título de Princesa de Gales ao se casar com o então príncipe Charles, em 1981, e era chamada pela imprensa de Lady Di.\nDiana morreu em 31 de agosto de 1997, após um acidente de carro no túnel da Ponte de l'Alma, em Paris.\nA frase foi publicada em 6 de maio de 2023. Entre agosto de 1997 e maio de 2023 passaram-se 25 anos e oito meses, portanto \"há 25 anos\" está correto na data da publicação.",
  "verification": "Consultamos a data de publicação da matéria original do Gshow e registros biográficos sobre a vida e a morte de Diana. Comparamos a data da morte com a data da publicação para conferir o intervalo citado.",
  "summary": "A matéria afirma que Diana Spencer, conhecida como Princesa de Gales e Lady Di, morreu há 25 anos em um acidente de carro em Paris. Os registros confirmam os títulos, o acidente em Paris em 31 de agosto de 1997 e o intervalo de 25 anos até a data da publicação, em maio de 2023.",
  "classification": "trustworthy",
  "sources": [
    { "href": "https://en.wikipedia.org/wiki/Death_of_Diana,_Princess_of_Wales", "field": "report", "quotedText": "31 de agosto de 1997" },
    { "href": "https://en.wikipedia.org/wiki/Diana,_Princess_of_Wales", "field": "report", "quotedText": "Princesa de Gales" },
    { "href": "https://gshow.globo.com/cultura-pop/famosos/noticia/princesa-diana-que-morreu-ha-25-anos-e-lembrada-por-fas-durante-coroacao-do-rei-charles-iii.ghtml", "field": "report", "quotedText": "6 de maio de 2023" }
  ]
}
```

(For a real check, prefer primary sources over an encyclopedia when they
exist; for a biographical fact like this one, reference works are adequate.)

## Comment template (fallback when the form tools are missing)

Post with `add_review_comment`:

```
[Review Log — <data_hash>]

PRÉ-CHECAGEM
Sentença: "<sentence>"
Perguntas norteadoras:
1. …
2. …

CHECAGEM
Relatório da verificação:
…
Como verificamos:
…
Fontes:
- <url> — <o que mostra> (apoia: "<trecho>")

PÓS-CHECAGEM
Resumo da conclusão: …
Etiqueta: <Etiqueta> (<value>)
Cross-check: pendente
```

## Self-check (run before every submit)

- [ ] Every guiding question is answered in `report`, in order.
- [ ] Every number, date and name in `report` and `summary` has a source.
- [ ] Every source URL was actually opened and read; none is invented.
- [ ] Every `quotedText` appears exactly in its field.
- [ ] Relative expressions were judged against the claim's date.
- [ ] The label matches `labels.md`'s decision order; for `exaggerated`, the
      percentage is computed in the report.
- [ ] `summary` alone gives the right conclusion.
- [ ] No opinion, no adjective about the speaker, no party framing; the same
      text would be written about any other person.
- [ ] Written in Portuguese (pt-BR).
- [ ] `verification` lets someone repeat the check, and names what could not
      be accessed.
