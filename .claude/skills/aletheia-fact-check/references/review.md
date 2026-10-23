# Reviewing and publishing

The reviewer is the last check before a fact-check becomes public. You did
not write this report and did not cross-check it (the server guarantees it).
Your job is to confirm the report holds up, then publish it or send it back
with what must change.

## Steps

1. Take a review: `claim_review_task` (oldest report waiting for a reviewer),
   or continue one of yours from `list_my_review_tasks`.
2. Read the claim (`get_claim`) and the full Review Log (`get_review_log`).
3. Check, in order:
   - **Sources.** Open every source. Each one exists and says what the text
     linked to it claims. Primary sources are used where they exist.
   - **Questions.** Every guiding question is answered in the report.
   - **Facts.** Every number, date and name in the report and the summary is
     backed by a source; calculations are right (the 10% rule for
     `exaggerated`).
   - **Label.** It follows the decision order in `labels.md`, and the
     cross-check agreed with it (`crossCheck.classification`).
   - **Summary.** Read alone, it gives the right conclusion.
   - **Neutrality.** No opinion, no adjectives about the speaker, no party
     framing; the same text would be written about anyone.
   - **Language.** Clear Portuguese (pt-BR) a general reader understands.
4. Decide:
   - **Everything holds** → `publish_review_task`.
   - **Something must change** → `reject_review_task` with a
     `rejectionComment` that names each problem and what would fix it
     ("O segundo parágrafo cita 150 sem fonte; incluir o link do IBGE ou
     retirar o número."). The task goes back to its writer.
   Never rewrite the report yourself, and never publish with a known
   problem "to fix later".
5. Tell the user in one line: sentence, label, published or sent back (and
   why).

If the claim concerns a specific person and the manual's request for an
official statement (pedido de posicionamento) has not been noted in the
comments, add a review comment before publishing so a person can follow up.
