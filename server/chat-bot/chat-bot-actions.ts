import { EventObject, assign } from "xstate";
import { ChatBotContext } from "./chat-bot.machine";

interface VerificationRequestEvent extends EventObject {
    verificationRequest: string;
}

export const sendGreeting = assign<ChatBotContext>({
    responseMessage: () =>
        "Olá! Bem-vindo ao chatbot da Aletheia. Nossa missão é coletar e verificar informações sobre denúncias. Gostaria de fazer uma denúncia? Por favor, responda com 'Sim' ou 'Não'.",
});

export const sendNoMessage = assign<ChatBotContext>({
    responseMessage: () =>
        "Entendi. Nosso foco é coletar denúncias para verificação. Se tiver interesse em conhecer mais de nosso trabalho, visite nosso site: https://aletheiafact.org. Se mudar de ideia e quiser fazer uma denúncia, digite 'denúncia'.",
});

export const sendNotUnderstoodMessage = assign<ChatBotContext>({
    responseMessage: () =>
        "Desculpe, não entendi sua resposta. Como sou um chatbot, só consigo entender respostas como 'Sim' ou 'Não'. Gostaria de fazer uma denúncia? Por favor, responda com 'Sim' ou 'Não'.",
});

export const askForForVerificationRequest = assign<ChatBotContext>({
    responseMessage: () =>
        "Por favor, descreva a denúncia que você gostaria de compartilhar.",
});

export const saveVerificationRequest = assign<ChatBotContext>({
    verificationRequest: (context, event) =>
        (event as VerificationRequestEvent).verificationRequest,
});

export const sendThanks = assign<ChatBotContext>({
    responseMessage: () =>
        "Obrigado pela sua denúncia! Sua informação será armazenada em nosso site para verificação. Para mais detalhes, visite: https://aletheiafact.org\n\nGostaria de relatar mais alguma denúncia? Por favor, responda com 'Sim' ou 'Não'.",
});

export const setResponseMessage = assign<ChatBotContext>({
    responseMessage: (context) => context.responseMessage,
});
