const fullVerificationRequest = {
    content: "Verification Request Content",
    reportType: "Discurso",
    impactArea: "Ambientalismo",
    heardFrom: "Verification Request heardFrom",
    source: "wikimedia.org",
    email: "test-cypress@aletheiafact.org",
};
const regexVerificationRequestPage = /\/verification-request\/[\w-]+$/
const updatedSource = "www.wikidata.org"

export { fullVerificationRequest, regexVerificationRequestPage, updatedSource }
