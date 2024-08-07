import { EventObject, assign } from "xstate";
import { ChatBotContext } from "./chat-bot.machine";

interface VerificationRequestEvent extends EventObject {
    verificationRequest: string;
}

interface SourceEvent extends EventObject {
    source: string;
}

interface PublicationDateEvent extends EventObject {
    publicationDate: string;
}

interface HeardFromEvent extends EventObject {
    heardFrom: string;
}

interface EmailEvent extends EventObject {
    email: string;
}

const MESSAGES = {
    greeting:
        "Olá! Sou o assistente virtual da AletheiaFact.org, estou aqui para ajudá-lo(a) a combater desinformações 🙂 Você gostaria de fazer uma denúncia agora?\n\nResponda SIM para continuar ou NÃO se deseja falar com uma pessoa real.",
    noTextMessageAskIfForVerificationRequest:
        "Desculpe, só podemos processar mensagens de texto. Por favor, envie sua mensagem em formato de texto.\n\nVocê gostaria de fazer uma denúncia agora? Responda SIM para continuar ou NÃO se não deseja.",
    noTextMessageGreeting:
        "Desculpe, só podemos processar mensagens de texto. Por favor, envie sua mensagem em formato de texto.\n\nOlá! Sou o assistente virtual da AletheiaFact.org, estou aqui para ajudá-lo(a) a combater desinformações 🙂 Você gostaria de fazer uma denúncia agora?\n\nResponda SIM para continuar ou NÃO se não deseja denunciar.",
    pausedMachineMessage:
        "Entendi. No momento, o bot não irá responder mais. Se mudar de ideia e desejar fazer uma denúncia com a assistência do chatbot, basta digitar DENÚNCIA a qualquer momento.",
    noTextMessageNoMessage:
        "Desculpe, só podemos processar mensagens de texto. Por favor, envie sua mensagem em formato de texto.\n\nNosso trabalho é verificar informações falsas.\n\nSe quiser saber mais sobre o que fazemos, visite: https://aletheiafact.org. Se mudar de ideia e desejar fazer uma denúncia, basta digitar DENÚNCIA a qualquer momento.",
    notUnderstood:
        "Desculpe, não entendi sua resposta. Para continuar, preciso que você digite SIM se deseja fazer uma denúncia, ou NÃO se prefere falar com uma pessoa real.\n\nVocê gostaria de fazer uma denúncia agora?",
    askForVerificationRequest:
        "Por favor, me conte com detalhes o que você gostaria de denunciar.\n\nPor favor, inclua todas as informações que considerar relevantes para que possamos verificar a denúncia de forma eficiente 👀",
    noTextMessageAskForVerificationRequest:
        "Desculpe, só podemos processar mensagens de texto. Por favor, envie sua mensagem em formato de texto para que possamos entender e verificar sua denúncia de forma eficiente.\n\nPor favor, me conte com detalhes o que você gostaria de denunciar.\n\nPor favor, inclua todas as informações que considerar relevantes para que possamos verificar a denúncia de forma eficiente 👀",
    askForSource:
        "A publicação que você está denunciando possui um link? Se sim, por favor, envie-o para nós. Se você não tem um link ou prefere não compartilhar, responda 'Não'.",
    noTextMessageAskForSource:
        "Desculpe, só podemos processar mensagens de texto. Por favor, envie sua mensagem em formato de texto para que possamos entender e verificar sua denúncia de forma eficiente.\n\nA publicação que você está denunciando possui um link? Se sim, por favor, envie-o para nós. Se você não tem um link ou prefere não compartilhar, responda 'Não'.",
    askForPublicationDate:
        "Por favor, informe a data em que você viu ou leu a publicação. Se você não tem essa informação ou prefere não compartilhar, responda 'Não'.",
    noTextMessageAskForPublicationDate:
        "Desculpe, só podemos processar mensagens de texto. Por favor, envie sua mensagem em formato de texto para que possamos entender e verificar sua denúncia de forma eficiente.\n\nPor favor, informe a data em que você viu ou leu a publicação. Se você não tem essa informação ou prefere não compartilhar, responda 'Não'.",
    askForHeardFrom:
        "Você pode nos dizer onde encontrou ou recebeu a publicação? Se preferir não fornecer essa informação, responda 'Não'.",
    noTextMessageAskForHeardFrom:
        "Desculpe, só podemos processar mensagens de texto. Por favor, envie sua mensagem em formato de texto para que possamos entender e verificar sua denúncia de forma eficiente.\n\nVocê pode nos dizer onde encontrou ou recebeu a publicação? Se preferir não fornecer essa informação, responda 'Não'.",
    askForEmail:
        "Para que possamos enviar a verificação, por favor, forneça seu e-mail abaixo. Se você prefere não deixar seu e-mail ou não deseja receber a verificação, responda 'Não'.",
    noTextMessageAskForEmail:
        "Desculpe, só podemos processar mensagens de texto. Por favor, envie sua mensagem em formato de texto para que possamos entender e verificar sua denúncia de forma eficiente.\n\nPara que possamos enviar a verificação, por favor, forneça seu e-mail abaixo. Se você prefere não deixar seu e-mail ou não deseja receber a verificação, responda 'Não'.",
    thanks: "Muito obrigada por sua contribuição!\n\nSua informação será analisada pela nossa equipe ✅Para saber mais, visite nosso site: https://aletheiafact.org.\n\nDeseja relatar outra denúncia? Responda SIM para continuar.",
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

export const sendNoTextMessageNoMessage = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.noTextMessageNoMessage,
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

export const askForSource = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.askForSource,
});

export const sendNoTextMessageAskForSource = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.noTextMessageAskForSource,
});

export const askForPublicationDate = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.askForPublicationDate,
});

export const sendNoTextMessageAskForPublicationDate = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.noTextMessageAskForPublicationDate,
});

export const askForHeardFrom = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.askForHeardFrom,
});

export const sendNoTextMessageAskForHeardFrom = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.noTextMessageAskForHeardFrom,
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

export const saveSource = assign<ChatBotContext, SourceEvent>({
    source: (context, event) => event.source,
});

export const saveEmptySource = assign<ChatBotContext>({
    source: () => "",
});

export const savePublicationDate = assign<ChatBotContext, PublicationDateEvent>(
    {
        publicationDate: (context, event) => event.publicationDate,
    }
);

export const saveEmptyPublicationDate = assign<ChatBotContext>({
    publicationDate: () => "",
});

export const saveHeardFrom = assign<ChatBotContext, HeardFromEvent>({
    heardFrom: (context, event) => event.heardFrom,
});

export const saveEmptyHeardFrom = assign<ChatBotContext>({
    heardFrom: () => "",
});

export const saveEmail = assign<ChatBotContext, EmailEvent>({
    email: (context, event) => event.email,
});

export const saveEmptyEmail = assign<ChatBotContext>({
    email: () => "",
});

export const setResponseMessage = assign<ChatBotContext>({
    responseMessage: (context) => context.responseMessage,
});

export const sendThanks = assign<ChatBotContext>({
    responseMessage: () => MESSAGES.thanks,
});
