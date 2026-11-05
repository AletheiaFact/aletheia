# Cross-checking

Source: *Manual de Checagem*, Pós-Checagem → B) Cross-checking.

> É o duplo-processo de revisão, checagem por pares, validação e conclusão em
> que uma pessoa da equipe tentará chegar nos mesmos resultados. […] A segunda
> etapa da pós-checagem deve, obrigatoriamente, ser feita por outro checador.

A cross-check is an **independent** re-check, not a proofread. Its value
comes from reaching a conclusion without being led by the first one.

## Rules

- Never cross-check a task where you are an assignee (you wrote it).
- Form your own conclusion **before** reading the writer's label and summary.
- Agree only when the evidence supports the label; disagree with specifics.

## Steps

1. Get the task: `claim_cross_check` takes the oldest report waiting for a
   cross-check and makes you its cross-checker; `next_cross_checking` lists
   the ones already yours.
2. Read **only** the sentence and the `claim` that `claim_cross_check`
   returned (`get_claim` only if it is missing). Do not read the writer's
   `summary`, `report` or `classification` yet.
3. Write your own guiding questions and do a quick independent check
   (`research.md`): find at least the decisive source yourself.
4. Choose your label with `labels.md`. Note it.
5. Now read the writer's Review Log (`get_review_log`). Check:
   - every source opens and says what the report claims (fetch them in
     parallel; skip re-fetching one you already read in step 3);
   - every guiding question is answered;
   - calculations are right (10% rule);
   - the label follows the decision order;
   - the text is neutral.
   Also confirm which outlets published the checked information, as the
   manual asks, when relevant to the label.
6. Decide:
   - **Same label, report sound** → `submit_cross_check` with the same
     `classification` and a short comment saying what you verified
     ("Conferi as fontes X e Y e o cálculo; concordo."). The task goes
     straight to the review backlog.
   - **Different label, or a factual error in the report** →
     `submit_cross_check` with **your** label and a comment that names the
     exact problem and the source that shows it ("O relatório usa o dado de
     2021; o IBGE publicou o de 2022 (link), que muda o percentual para 8%,
     abaixo do limite de exagero."). The task goes back to the writer.
7. Write the comment in Portuguese, neutral, about the evidence — never about
   the writer.
