const fullVerificationRequest = {
    content: "Verification Request Content",
    reportType: "Discurso",
    impactArea: "Ambientalismo",
    heardFrom: "Verification Request heardFrom",
    source: "wikimedia.org",
    email: "test-cypress@aletheiafact.org",
    data_hash: "7908c206338ec42bacb83f256d6b484f",
};

const minimumVerificationRequest = {
    content: "Verification Request Content minimium",
    data_hash: "f2a562ab2f47f8a878cf92326c81fca8"
}

const regexVerificationRequestPage = /\/verification-request\/[\w-]+$/
const updatedSource = "www.wikidata.org"

export { fullVerificationRequest, regexVerificationRequestPage, updatedSource, minimumVerificationRequest }
