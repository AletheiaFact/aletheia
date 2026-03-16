import { EventObject, assign } from "xstate";
import { ChatBotContext } from "./chat-bot.machine";
import * as crypto from "crypto";

interface VerificationRequestEvent extends EventObject {
    verificationRequest: string;
}

interface AdditionalInfoEvent extends EventObject {
    additionalInfo: string;
}

interface EmailEvent extends EventObject {
    email: string;
}

const MESSAGES = {
    greeting:
        "Olá! Sou o assistente virtual da AletheiaFact.org, estou aqui para ajudá-lo(a) a combater desinformações 🙂 Você gostaria de fazer uma denúncia agora?\n\nResponda SIM para continuar ou NÃO se deseja falar com uma pessoa real.",
    noTextMessageAskIfForVerificationRequest:
        "Desculpe, só podemos processar mensagens de texto. Por favor, envie sua mensagem em formato de texto.\n\nVocê gostaria de fazer uma denúncia agora? Responda SIM para continuar ou NÃO se deseja falar com uma pessoa real.",
    noTextMessageGreeting:
        "Desculpe, só podemos processar mensagens de texto. Por favor, envie sua mensagem em formato de texto.\n\nOlá! Sou o assistente virtual da AletheiaFact.org, estou aqui para ajudá-lo(a) a combater desinformações 🙂 Você gostaria de fazer uma denúncia agora?\n\nResponda SIM para continuar ou NÃO se deseja falar com uma pessoa real.",
    pausedMachineMessage:
        "Entendi. No momento, o bot não irá responder mais. Se mudar de ideia e desejar fazer uma denúncia com a assistência do chatbot, basta digitar DENÚNCIA a qualquer momento.",
    notUnderstood:
        "Desculpe, não entendi sua resposta. Para continuar, preciso que você digite SIM se deseja fazer uma denúncia, ou NÃO se prefere falar com uma pessoa real.\n\nVocê gostaria de fazer uma denúncia agora?",
    askForVerificationRequest:
        "A Aletheia está aqui para receber sua denúncia de desinformação.\n\nEnvie o conteúdo que deseja reportar. Pode ser um link ou texto 👀.",
    noTextMessageAskForVerificationRequest:
        "Desculpe, só podemos processar mensagens de texto. Por favor, envie sua mensagem em formato de texto para que possamos entender e verificar sua denúncia de forma eficiente.\n\nA Aletheia está aqui para receber sua denúncia de desinformação.\n\nEnvie o conteúdo que deseja reportar. Pode ser um link ou texto 👀.",
    askForAdditionalInfo:
        "Você gostaria de acrescentar alguma informação que possa nos ajudar na investigação? Por exemplo, onde o conteúdo circulou, quem o compartilhou, ou o motivo pelo qual você o considera duvidoso. \n\nSe você não tiver mais informações, responda 'Não'.",
    noTextMessageAskForAdditionalInfo:
        "Desculpe, só podemos processar mensagens de texto. Por favor, envie sua mensagem em formato de texto para que possamos entender e verificar sua denúncia de forma eficiente.\n\nVocê gostaria de acrescentar alguma informação que possa nos ajudar na investigação? Por exemplo, onde o conteúdo circulou, quem o compartilhou, ou o motivo pelo qual você o considera duvidoso. \n\nSe você não tiver mais informações, responda 'Não'.",
    askForEmail:
        "Para que possamos enviar a verificação, por favor, forneça seu e-mail abaixo. Se você prefere não deixar seu e-mail ou não deseja receber a verificação, responda 'Não'.",
    noTextMessageAskForEmail:
        "Desculpe, só podemos processar mensagens de texto. Por favor, envie sua mensagem em formato de texto para que possamos entender e verificar sua denúncia de forma eficiente.\n\nPara que possamos enviar a verificação, por favor, forneça seu e-mail abaixo. Se você prefere não deixar seu e-mail ou não deseja receber a verificação, responda 'Não'.",
    thanks: (trackingLink: string) =>
        `Obrigado por colaborar com o combate à desinformação!\n\nVamos verificar sua denúncia e, caso ela seja selecionada pela nossa equipe de triagem, o resultado será enviado para o e-mail fornecido ou você pode acompanhar status da sua denúncia a qualquer momento por meio do link de acompanhamento abaixo:\n${trackingLink}\n\nAcompanhe também as publicações da Aletheia nas redes sociais e na nossa plataforma, lá divulgamos relatórios e investigações verificadas 😉.\n\nSe deseja relatar outra denúncia, responda SIM para continuar. Se preferir falar com uma pessoa real, responda CONVERSA.`,
};

export const sendGreeting = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.greeting,
});

export const sendNoTextMessageAskIfForVerificationRequest =
    assign<ChatBotContext>({
        responseMessage: () =>
            MESSAGES.noTextMessageAskIfForVerificationRequest,
    });

export const sendNoTextMessageGreeting = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.noTextMessageGreeting,
});

export const sendPausedMachineMessage = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.pausedMachineMessage,
});

export const sendNotUnderstoodMessage = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.notUnderstood,
});

export const askForVerificationRequest = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.askForVerificationRequest,
});

export const sendNoTextMessageAskForVerificationRequest =
    assign<ChatBotContext>({
        responseMessage: () => MESSAGES.noTextMessageAskForVerificationRequest,
    });

export const askForAdditionalInfo = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.askForAdditionalInfo,
});

export const sendNoTextMessageAskForAdditionalInfo = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.noTextMessageAskForAdditionalInfo,
});

export const askForEmail = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.askForEmail,
});

export const sendNoTextMessageAskForEmail = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.noTextMessageAskForEmail,
});

export const saveVerificationRequest = assign<
    ChatBotContext,
    VerificationRequestEvent
>({
    verificationRequest: (context, event) => event.verificationRequest,
});

export const saveAdditionalInfo = assign<ChatBotContext, AdditionalInfoEvent>({
    additionalInfo: (context, event) => event.additionalInfo,
});

export const saveEmptyAdditionalInfo = assign<ChatBotContext>({
    additionalInfo: () => "",
});

export const saveEmail = assign<ChatBotContext, EmailEvent>({
    email: (context, event) => event.email,
});

export const saveEmptyEmail = assign<ChatBotContext>({
    email: () => "",
});

export const setDataHash = assign<ChatBotContext>({
    dataHash: (context) =>
        crypto
            .createHash("md5")
            .update(
                `${context.verificationRequest}-${context.additionalInfo || ""}`
            )
            .digest("hex"),
});

export const setResponseMessage = assign<ChatBotContext>({
    responseMessage: (context) => context.responseMessage,
});

export const sendThanks = assign<ChatBotContext>({
    responseMessage: (context) => {
        const trackingLink = `https://aletheiafact.org/verification-request/${context.dataHash}/tracking`;

        return MESSAGES.thanks(trackingLink);
    },
});
