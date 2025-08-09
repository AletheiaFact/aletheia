# Full-Text Search

## Overview
Full-text search enables comprehensive searching across all textual content in the platform using MongoDB Atlas Search's powerful indexing and query capabilities.

## Search Features

### Text Analysis
- Tokenization
- Stemming
- Stop word removal
- Synonym expansion
- Language detection

### Query Types
- Simple text queries
- Phrase queries
- Wildcard queries
- Fuzzy matching
- Regular expressions

## Indexing Strategy

### Index Configuration
- Dynamic field mapping
- Custom analyzers
- Language-specific processing
- Field boosting
- Index optimization

### Indexed Fields
- Claim content
- Review summaries
- Source titles
- Personality names
- Topic labels
- User profiles

## Search Algorithms

### Scoring Methods
- TF-IDF scoring
- BM25 algorithm
- Field weights
- Recency boost
- Popularity factors

### Relevance Tuning
- Query-time boosting
- Field prioritization
- Custom scoring functions
- Result re-ranking

## Query Processing

### Query Pipeline
1. Query parsing
2. Spell correction
3. Synonym expansion
4. Query execution
5. Result ranking
6. Facet generation

### Optimization
- Query caching
- Result pagination
- Lazy loading
- Partial matching

## Multi-language Support

### Supported Languages
- Portuguese (PT)
- English (EN)
- Auto-detection
- Cross-language search

### Language Processing
- Language-specific analyzers
- Accent folding
- Case normalization
- Character normalization

## Performance
- Index size optimization
- Query performance tuning
- Caching strategies
- Load distribution

## Technical Details
- **Search Engine**: MongoDB Atlas Search
- **Index Type**: Lucene-based
- **Update Frequency**: Near real-time
- **API Endpoint**: `/api/search/full-text`