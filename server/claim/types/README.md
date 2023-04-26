# Claim Types

AletheiaFact.org support multiple types of claims, some of them can be a sub-set of another claim type. Currently the supported types are:
- Speech
- Paragraph
- Sentence
- Image
- Debate

## The Claim schema specification
Every type of claim should follow an specific schema in order to comply with the Claim specification:

```typescript
interface ClaimSpec {
    /**
     * The type of the claim as an string. It must be a supported type.
     */
    type: string;
    /**
     * An uuid string used to uniquely identify the claim in the database
     */
    data_hash: string;
    /**
     * A generic key value to store important props for the claim
     */
    props: object;
    /**
     * Any structed data that allows the platform to retrieve a kind of media
     */ 
    content: any;
}
```

**Important Note:** A claim may or may not have extra properties in case they are needed to build indexes for performance reasons, but the minimal schema should still be maintained as previously shown.

## Textual media
**Important note:** Textual media uses the text parser that transform a single string into a structured data that will be used to create each claim type.

### Speech
A speech is an aggregation of paragraphs.

### Paragraph
A paragraph is an aggregation of sentences.

### Sentence
A sentence defined as a string of characters.

### Debates
Debates is an aggregation of speeches and can be live or ended. The live information is defined as prop `isLive` in the debate schema.

## Graphic media

### Images
Images are not stored in the database, instead we make use of AWS S3 buckets and store the information on how to access them.