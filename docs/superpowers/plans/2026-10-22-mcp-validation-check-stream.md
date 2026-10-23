# Validação do MCP e stream de checagens

## Objetivo

Validar o MCP com os clientes de IA documentados e os modelos Fact-checking e
Informative News. Entregar checagens publicadas em tempo real no Debate View,
em uma extensão instalável para Chrome e Firefox e por push web para inscritos
no debate. A meta é 23/10/2026; cada canal só será ativado após passar em seus
testes.

## Implementação

- **MCP:** aproveitar a fila de tarefas Mongo e as ferramentas já presentes no
  branch `feat/mcp-task-queue`. Ampliar criação e avanço de relatórios para
  Informative News. Fact-checking mantém a revisão humana antes da publicação;
  o MCP deve exigir um revisor humano autorizado também para publicar
  Informative News. Request permanece no fluxo de solicitação e não produz
  ClaimReview. Fazer a publicação aguardar a gravação da ClaimReview antes de
  confirmar sucesso.
- **Eventos:** registrar publicação, ocultação e remoção em uma outbox durável
  no MongoDB; entregar eventos de forma idempotente a Redis Streams. Usar
  Pub/Sub para distribuir eventos às réplicas do gateway WebSocket. Após falha
  ou reconexão, recuperar eventos pelo cursor; se o histórico expirou,
  recarregar o estado pela API.
- **Web:** expor o estado atual das checagens por debate e um WebSocket com
  assinatura por debate. Enviar também eventos de novas falas e mudança de
  estado para substituir a consulta integral que o Debate View faz a cada 10
  segundos. Transmitir somente checagens publicadas e visíveis.
- **Extensão e push:** permitir vínculo explícito de vídeos do YouTube ao
  debate. Sem vínculo, sugerir debates pelo título e data; exigir que o usuário
  confirme a escolha antes de mostrar checagens. Entregar pacotes instaláveis
  para Chrome e Firefox. Usuários autenticados podem assinar ou cancelar push
  por debate; guardar a inscrição por dispositivo e enviar notificações via
  Web Push e service worker.

## Validação e liberação

Testar OAuth e chamadas reais em Claude Code, claude.ai, Codex, Antigravity,
OpenCode e Cursor. Testar papéis, namespaces, concorrência, publicação humana,
eventos duplicados, ocultação, queda de Redis e reconexão. Simular 10 mil
espectadores simultâneos; a meta inicial é entregar 95% dos eventos a clientes
conectados em até 3 segundos sem que as consultas HTTP cresçam na mesma
proporção. Liberar web, extensão e push separadamente conforme os resultados.
A aprovação pelas lojas de extensões não faz parte da meta de 23/10.

## Tasks

### MCP e persistência

- [ ] Executar testes da fila MCP existente e registrar falhas antes das mudanças.
- [ ] Corrigir o caminho de publicação para só confirmar sucesso após persistir Report e ClaimReview.
- [ ] Ampliar ferramentas e validações MCP para preparar e avançar Informative News.
- [ ] Exigir revisor humano autorizado na publicação dos dois modelos; manter Request fora do stream.
- [ ] Validar OAuth, descoberta, leitura, escrita e publicação com cada cliente MCP documentado.

### Stream e Debate View

- [ ] Provisionar Redis gerenciado com persistência, TLS e credenciais no Kubernetes.
- [ ] Criar outbox, entrega idempotente a Redis Streams e reconciliação de eventos pendentes.
- [ ] Implementar API de estado atual e gateway WebSocket com assinatura, cursor, heartbeat e limite para clientes lentos.
- [ ] Emitir eventos de checagens, novas falas e estado do debate; remover a consulta periódica integral do Debate View.
- [ ] Exibir checagens publicadas na página, com recuperação após reconexão e remoção quando forem ocultadas.

### Extensão e push

- [ ] Adicionar vínculo editorial entre debate e IDs de vídeos do YouTube.
- [ ] Implementar sugestões por título e data, com confirmação do usuário antes da exibição.
- [ ] Criar e testar pacotes instaláveis da extensão para Chrome e Firefox.
- [ ] Implementar assinatura e cancelamento de push por usuário, dispositivo e debate.
- [ ] Implementar service worker, consentimento e entrega de push com deduplicação.

### Aceitação

- [ ] Testar autorização, concorrência, duplicatas, falhas de Redis, reconexão e ressincronização.
- [ ] Medir 10 mil conexões e o atraso de entrega; registrar métricas de conexões, eventos pendentes e falhas de push.
- [ ] Fazer smoke test em produção e ativar somente os canais que passaram em seus testes.

## Premissas

A extensão cobre páginas de vídeo do YouTube. A leitura de checagens públicas
não exige login; push em segundo plano exige conta. A fila Mongo de tarefas de
revisão e o Redis do stream têm responsabilidades distintas.
