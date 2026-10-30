# Labels (etiquetas)

Source: *Manual de Checagem*, Pós-Checagem → A) Etiquetagem (pp. 21–22).
The `value` column is what goes in `classification`.

## Check the task's methodology first

Every task view has a `classificationMethodology`. The table below is the
**`aletheia`** scale, the default. A task on another methodology accepts only
that methodology's options: `save_review_log`, `submit_report`,
`submit_cross_check` and `publish_review_task` refuse any other `value`.
`list_classification_methodologies` gives the current list; today:

| Methodology | Options (`value` → label) |
| --- | --- |
| `aletheia` | the 9 below |
| `rncd-debate` | `false` → Falso, `misleading` → Enganosa, `trustworthy` → Verdadeiro |

On a narrower scale, still walk the decision order below, then pick among
the methodology's options only. When none of them fits (for example the
sentence is an opinion and the scale has no `not-fact`), do not force one:
give the task back with `release_review_task`, reason `needs-human`. When
you report the result, use the label in the task's methodology
(`classificationLabel`), e.g. "Verdadeiro (RNCD Debate)", not the `aletheia`
word for the same `value`.

| Etiqueta | `value` | Manual definition |
| --- | --- | --- |
| Confiável | `trustworthy` | As informações e os dados mencionados estão corretos e são incontestáveis. |
| Confiável, mas | `trustworthy-but` | As informações e os dados estão corretos, **mas** falta contexto ou um melhor detalhamento; informação correta "jogada", sem cuidado de citar as fontes. |
| Falso | `false` | As informações e os dados não condizem com a realidade, ou seja, estão errados. |
| Enganoso | `misleading` | Há manipulação das informações e dados com a intenção de gerar um efeito de verdade. A informação pode até estar correta, mas é manipulada intencionalmente. Usa meias-verdades. |
| Exagerado | `exaggerated` | Há uma distorção — a partir de **10%** das informações ou dados mencionados — potencializando um argumento de forma favorável ao contexto ou ao ator. Ex.: morreram 100 pessoas e foi dito 110. |
| Discutível | `arguable` | Os checadores chegaram a opiniões divergentes e não houve consenso ao final do processo. |
| Insustentável | `unsustainable` | Não há fontes ou banco de dados que comprovem as informações: mesmo com acesso ao banco de dados, não é possível achar a informação. |
| Inverificável | `unverifiable` | Não é possível traçar um rastro investigativo: não há registros, banco de dados ou informações passíveis de checagem. |
| Não é fato | `not-fact` | Informações subjetivas, opiniões ou juízo de valor — não é uma informação com embasamento teórico. |

Never use `in-progress` or any other value.

## Decision order

Walk the questions in order; stop at the first "yes".

1. **Is it an opinion, value judgment, promise or prediction?** → `not-fact`.
   (A sentence that mixes opinion and a checkable fact is not `not-fact`:
   check the fact.)
2. **Is there no possible investigative trail at all** (a private
   conversation, an event with no records, data that is not collected by
   anyone)? → `unverifiable`.
3. **Is there a trail** (the data should exist, the database is accessible)
   **but nothing confirms the statement?** → `unsustainable`.
4. **Are the facts or numbers wrong?**
   - Numbers inflated by **10% or more** in the speaker's favor (or of their
     argument) → `exaggerated`. Compute it: `(said − real) / real`. Show the
     calculation in the report.
   - Wrong in substance (not just inflated), or understated/distorted in a
     way the 10% rule does not describe → `false`. Explain the gap.
5. **Are the facts correct but arranged to create a false impression**
   (cherry-picked period, half-truth, missing the part that changes the
   meaning, correct number about a different thing)? → `misleading`. Say in
   the report exactly what was left out or twisted.
6. **Correct, but missing context or detail a reader needs, or stated
   loosely** (rounded, no source, slightly imprecise below 10%)? →
   `trustworthy-but`. Name the missing context.
7. **Correct and indisputable** → `trustworthy`.

`arguable` is not in the order. Use it only when re-working a task after a
cross-check disagreement, when the cross-checker's label and yours are both
supported by sound evidence and the disagreement is about interpretation, not
about facts one of you missed. Say in the report which two readings exist.

## Edge cases

- **Relative time.** "Há 25 anos", "no ano passado", "recorde": judge against
  the claim's date. Diana died in Aug 1997; in May 2023 "há 25 anos" is
  correct.
- **Rounding.** "Quase 30%" for 28.7% is fine (`trustworthy`). "30%" for
  26.5% is a 13% distortion → `exaggerated` if it favors the speaker.
- **Below 10%, favorable.** Inflation under 10% is not `exaggerated`; it is
  usually `trustworthy-but` (imprecise), unless the small change flips the
  meaning (`misleading`).
- **Different measure.** A correct number for a different indicator, place or
  period than the one implied → `misleading`.
- **Attribution.** If the sentence quotes someone else, check whether that
  person really said it, then (if relevant) whether it is true. Say which one
  the label covers.
- **Outdated.** True when said, false now: label for when it was said; note
  the change in the report.
- **Multiple facts in one sentence.** The label reflects the whole sentence.
  If one part is false and it is the central claim → `false`; if a secondary
  detail is wrong → usually `trustworthy-but` or `misleading`. Explain.
