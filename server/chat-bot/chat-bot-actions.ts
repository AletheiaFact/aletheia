import { EventObject, assign } from "xstate";
import { ChatBotContext } from "./chat-bot.machine";

interface VerificationRequestEvent extends EventObject {
    verificationRequest: string;
}

const MESSAGES = {
    greeting:
        "Olá! Sou o assistente virtual da AletheiaFact.org, estou aqui para ajudá-lo(a) a combater desinformações 🙂 Você gostaria de fazer uma denúncia agora?\n\nResponda SIM para continuar ou NÃO se não deseja denunciar.",
    noMessage:
        "Entendi. Nosso trabalho é verificar informações falsas.\n\nSe quiser saber mais sobre o que fazemos, visite: https://aletheiafact.org. Se mudar de ideia e desejar fazer uma denúncia, basta digitar DENÚNCIA a qualquer momento.",
    notUnderstood:
        "Desculpe, não entendi sua resposta. Para continuar, preciso que você digite SIM se deseja fazer uma denúncia, ou NÃO se não deseja.\n\nVocê gostaria de fazer uma denúncia agora?",
    askForVerificationRequest:
        "Por favor, me conte com detalhes o que você gostaria de denunciar.\n\nPor favor, inclua todas as informações que considerar relevantes para que possamos verificar a denúncia de forma eficiente 👀",
    thanks: "Muito obrigada por sua contribuição!\n\nSua informação será analisada pela nossa equipe ✅Para saber mais, visite nosso site: https://aletheiafact.org.\n\nDeseja relatar outra denúncia? Responda SIM para continuar ou NÃO para encerrar.",
};

export const sendGreeting = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.greeting,
});

export const sendNoMessage = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.noMessage,
});

export const sendNotUnderstoodMessage = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.notUnderstood,
});

export const askForVerificationRequest = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.askForVerificationRequest,
});

export const saveVerificationRequest = assign<ChatBotContext>({
    verificationRequest: (context, event) =>
        (event as VerificationRequestEvent).verificationRequest,
});

export const sendThanks = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.thanks,
});

export const setResponseMessage = assign<ChatBotContext>({
    responseMessage: (context) => context.responseMessage,
});
