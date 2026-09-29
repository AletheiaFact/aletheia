const fullVerificationRequest = {
    content: "Verification Request Content",
    reportType: "Discurso",
    impactArea: "Ciência e Tecnologia",
    topic: "Socialismo",
    heardFrom: "Verification Request heardFrom",
    source: "wikimedia.org",
    email: "test-cypress@aletheiafact.org",
};

const minimumContent = "Verification Request Content minimium"

const regexVerificationRequestPage = /\/verification-request\/[\w-]+$/
const updatedSource = "www.wikidata.org"

export { fullVerificationRequest, regexVerificationRequestPage, updatedSource, minimumContent }
