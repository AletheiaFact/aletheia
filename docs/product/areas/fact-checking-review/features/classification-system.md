# Classification System

## Overview
The Classification System provides standardized ratings for fact-checked claims, ensuring consistency and clarity in verification results.

## Classification Categories

### Primary Classifications
- **True** - Factually accurate
- **False** - Factually inaccurate
- **Misleading** - Partially true but deceptive
- **Unverifiable** - Cannot be verified
- **Out of Context** - True but misrepresented
- **Satire** - Intentional satire/parody

### Additional Ratings
- **Mostly True** - Accurate with minor errors
- **Mostly False** - Inaccurate with some truth
- **Half True** - Mix of true and false
- **Not Applicable** - Not a factual claim

## Classification Process

### Evidence Analysis
1. Gather all relevant evidence
2. Verify source credibility
3. Cross-reference information
4. Identify factual claims
5. Compare with evidence

### Rating Decision
1. Evaluate accuracy percentage
2. Consider context and intent
3. Apply classification criteria
4. Document reasoning
5. Provide confidence level

## Classification Criteria

### True Rating
- 95-100% factually accurate
- Supported by credible sources
- Context preserved
- No misleading elements

### False Rating
- 0-5% factually accurate
- Contradicted by evidence
- Demonstrably incorrect
- Clear falsehood

### Misleading Rating
- Facts used deceptively
- Important context omitted
- Statistics misrepresented
- Cherry-picked data

## Visual Indicators

### Color Coding
- **Green** - True
- **Red** - False
- **Orange** - Misleading
- **Gray** - Unverifiable
- **Yellow** - Partially true

### Icons
- ✓ Checkmark for true
- ✗ X mark for false
- ⚠ Warning for misleading
- ? Question mark for unverifiable

## Confidence Levels

### Rating Confidence
- **High** - Strong evidence
- **Medium** - Adequate evidence
- **Low** - Limited evidence
- **Preliminary** - Under review

## Appeals Process

### Challenging Classifications
1. Submit appeal with evidence
2. Review by senior fact-checker
3. Re-evaluation if warranted
4. Final decision
5. Public correction if needed

## Technical Implementation
- **Component**: `ReviewClassification.tsx`
- **Component**: `ClassificationText.tsx`
- **Database Field**: `classification`
- **API**: Classification endpoint