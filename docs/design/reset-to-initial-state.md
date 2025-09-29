# Reset to Initial State - Technical Design Document

## Issue: #1991
**Title**: Allow fact-checkers to reset report to initial state at any stage

## Executive Summary
This design document outlines the implementation of a "Reset to Initial State" feature that allows authorized users (fact-checkers and admins) to reset a report back to its initial state from any stage of the fact-checking workflow.

## Architecture Overview

### Current Workflow States
Based on the codebase analysis, the system uses the following workflow states (from `ReviewTaskStates` enum):
- `unassigned` - Initial state
- `assigned` - Assigned to fact-checker
- `reported` - Report created
- `selectReviewer` - Selecting reviewer
- `selectCrossChecker` - Selecting cross-checker
- `crossChecking` - Under cross-checking
- `submitted` - Submitted for review
- `rejected` - Rejected
- `published` - Published
- `rejectedRequest` - Request rejected
- `assignedRequest` - Request assigned

### State Machine Integration
The system uses XState for workflow management with events defined in `ReviewTaskEvents`:
- Current reset-related event: `ReviewTaskEvents.reset = "RESET"`
- The reset functionality will leverage this existing event structure

## Technical Design

### 1. Backend Implementation

#### 1.1 API Endpoint
```typescript
// review-task.controller.ts
@ApiTags("review-task")
@Put("api/reviewtask/:data_hash/reset")
@Header("Cache-Control", "no-cache")
async resetToInitialState(
    @Param("data_hash") data_hash: string,
    @Body() body: { reason: string, confirmationToken?: string }
) {
    // Validate user permissions
    // Log the reset action
    // Execute state reset
    return this.reviewTaskService.resetToInitialState(data_hash, body);
}
```

#### 1.2 Service Layer
```typescript
// review-task.service.ts
async resetToInitialState(
    data_hash: string,
    resetData: { reason: string, confirmationToken?: string }
): Promise<ReviewTaskDocument> {
    const reviewTask = await this.getReviewTaskByDataHash(data_hash);
    
    if (!reviewTask) {
        throw new NotFoundException('Review task not found');
    }
    
    // Validate permissions
    await this.validateResetPermission(reviewTask);
    
    // Create audit log entry
    await this.createResetAuditLog(reviewTask, resetData.reason);
    
    // Reset the state machine
    const resetMachine = {
        ...reviewTask.machine,
        value: ReviewTaskStates.assigned,
        context: {
            ...reviewTask.machine.context,
            reviewData: {
                ...reviewTask.machine.context.reviewData,
                // Clear review-specific data while preserving assignment
                report: null,
                classification: null,
                summary: null,
                questions: [],
                sources: [],
                crossCheckerId: null,
                reviewerId: null,
                comments: [],
                resetHistory: [
                    ...(reviewTask.machine.context.reviewData.resetHistory || []),
                    {
                        fromState: reviewTask.machine.value,
                        resetBy: this.req.user._id,
                        resetAt: new Date(),
                        reason: resetData.reason
                    }
                ]
            }
        }
    };
    
    // Update the review task
    const updatedTask = await this.ReviewTaskModel.findOneAndUpdate(
        { data_hash },
        { 
            machine: resetMachine,
            $inc: { __v: 1 }
        },
        { new: true }
    );
    
    // Emit state change event
    await this.stateEventService.create({
        targetId: reviewTask._id,
        targetModel: TypeModel.ReviewTask,
        eventType: 'RESET_TO_INITIAL',
        previousState: reviewTask.machine.value,
        newState: ReviewTaskStates.assigned,
        userId: this.req.user._id
    });
    
    // Send notifications
    await this.notificationService.notifyReset(reviewTask, resetData.reason);
    
    return updatedTask;
}

private async validateResetPermission(reviewTask: ReviewTaskDocument): Promise<void> {
    const user = this.req.user;
    const userRole = user.role;
    const isAssignedUser = reviewTask.machine.context.reviewData.usersId.includes(user._id);
    
    // Allow reset if:
    // 1. User is Admin or SuperAdmin
    // 2. User is the assigned fact-checker
    if (userRole !== Roles.Admin && 
        userRole !== Roles.SuperAdmin && 
        !isAssignedUser) {
        throw new ForbiddenException('You do not have permission to reset this task');
    }
}
```

#### 1.3 Audit Logging
```typescript
// history.service.ts enhancement
async createResetAuditLog(
    reviewTask: ReviewTaskDocument,
    reason: string
): Promise<void> {
    await this.create({
        targetId: reviewTask._id,
        targetModel: TargetModel.ReviewTask,
        type: HistoryType.Reset,
        user: this.req.user._id,
        details: {
            previousState: reviewTask.machine.value,
            newState: ReviewTaskStates.assigned,
            reason,
            timestamp: new Date(),
            reviewData: reviewTask.machine.context.reviewData // Archive current data
        }
    });
}
```

### 2. Frontend Implementation

#### 2.1 UI Component Integration
The reset button will be integrated into the existing `ReviewTaskAdminToolBar` component:

```typescript
// ReviewTaskAdminToolBar.tsx
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

const ReviewTaskAdminToolBar = () => {
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [resetReason, setResetReason] = useState("");
    const [isResetting, setIsResetting] = useState(false);
    
    const { machineService, reviewTask } = useContext(ReviewTaskMachineContext);
    const currentUser = useAppSelector(state => state.user);
    
    // Check if user can reset
    const canReset = useMemo(() => {
        const isAdmin = [Roles.Admin, Roles.SuperAdmin].includes(currentUser.role);
        const isAssignedFactChecker = reviewTask?.machine?.context?.reviewData?.usersId?.includes(currentUser._id);
        
        return isAdmin || isAssignedFactChecker;
    }, [currentUser, reviewTask]);
    
    const handleResetClick = () => {
        setResetDialogOpen(true);
    };
    
    const handleConfirmReset = async () => {
        if (!resetReason.trim()) {
            // Show error
            return;
        }
        
        setIsResetting(true);
        try {
            await ReviewTaskApi.resetToInitialState(
                reviewTask.data_hash,
                { reason: resetReason }
            );
            
            // Refresh the page or update state
            machineService.send(ReviewTaskEvents.reset);
            
            // Show success notification
            toast.success("Report reset to initial state successfully");
            
            setResetDialogOpen(false);
            setResetReason("");
        } catch (error) {
            toast.error("Failed to reset report");
        } finally {
            setIsResetting(false);
        }
    };
    
    return (
        <>
            <Grid container justifyContent="center" style={{ background: colors.lightNeutral }}>
                <Grid item xs={11} lg={9}>
                    <AdminToolBarStyle
                        namespace={nameSpace}
                        position="static"
                        style={{ boxShadow: "none", background: colors.lightNeutral }}
                    >
                        <Toolbar className="toolbar">
                            <div className="toolbar-item">
                                <IconButton onClick={handleReassignUser}>
                                    <ManageAccountsIcon />
                                </IconButton>
                            </div>
                            {canReset && (
                                <div className="toolbar-item">
                                    <Tooltip title="Reset to Initial State">
                                        <IconButton 
                                            onClick={handleResetClick}
                                            color="warning"
                                        >
                                            <RestartAltIcon />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                            )}
                        </Toolbar>
                    </AdminToolBarStyle>
                </Grid>
            </Grid>
            
            {/* Reset Confirmation Dialog */}
            <Dialog 
                open={resetDialogOpen} 
                onClose={() => setResetDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    Reset Report to Initial State
                </DialogTitle>
                <DialogContent>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action will reset the report to its initial state. 
                        All progress will be lost but the history will be preserved.
                    </Alert>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Reason for Reset (Required)"
                        value={resetReason}
                        onChange={(e) => setResetReason(e.target.value)}
                        placeholder="Please provide a reason for resetting this report..."
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setResetDialogOpen(false)}
                        disabled={isResetting}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmReset}
                        color="warning"
                        variant="contained"
                        disabled={!resetReason.trim() || isResetting}
                    >
                        {isResetting ? "Resetting..." : "Confirm Reset"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};
```

#### 2.2 API Client
```typescript
// api/reviewTaskApi.ts
class ReviewTaskApi {
    // ... existing methods
    
    static async resetToInitialState(
        dataHash: string,
        data: { reason: string }
    ): Promise<ReviewTask> {
        const response = await apiClient.put(
            `${API_URL}/reviewtask/${dataHash}/reset`,
            data
        );
        return response.data;
    }
}
```

### 3. Database Schema Updates

Add reset history tracking to the ReviewTask schema:

```typescript
// review-task.schema.ts
const ReviewTaskSchema = new Schema({
    // ... existing fields
    machine: {
        // ... existing machine fields
        context: {
            reviewData: {
                // ... existing reviewData fields
                resetHistory: [{
                    fromState: String,
                    resetBy: { type: Schema.Types.ObjectId, ref: 'User' },
                    resetAt: Date,
                    reason: String
                }]
            }
        }
    }
});
```

### 4. State Machine Updates

Update the XState machine configuration to handle reset:

```typescript
// reviewTask.machine.ts
const reviewTaskMachine = createMachine({
    // ... existing configuration
    on: {
        [ReviewTaskEvents.reset]: {
            target: ReviewTaskStates.assigned,
            actions: [
                'clearReviewData',
                'logResetAction',
                'notifyReset'
            ]
        }
    }
});
```

## Security Considerations

1. **Permission Validation**: 
   - Only admins and assigned fact-checkers can reset
   - Server-side validation of permissions
   
2. **Audit Trail**:
   - All reset actions are logged with user, timestamp, and reason
   - Previous data is archived before reset
   
3. **Confirmation Flow**:
   - Required reason field
   - Warning dialog to prevent accidental resets
   
4. **Data Preservation**:
   - Reset history is maintained
   - Original assignment is preserved
   - Full audit trail available for review

## Testing Strategy

### Unit Tests
```typescript
describe('ReviewTaskService', () => {
    describe('resetToInitialState', () => {
        it('should reset task to assigned state');
        it('should preserve assignment information');
        it('should create audit log entry');
        it('should throw ForbiddenException for unauthorized users');
        it('should require reason for reset');
    });
});
```

### E2E Tests
```typescript
describe('Reset to Initial State', () => {
    it('should show reset button for admins');
    it('should show reset button for assigned fact-checker');
    it('should hide reset button for other users');
    it('should require confirmation and reason');
    it('should successfully reset and refresh state');
});
```

## Migration Strategy

1. **Database Migration**: Add `resetHistory` field to existing documents
2. **Feature Flag**: Use feature flag for gradual rollout
3. **Backwards Compatibility**: Ensure old reports work without reset history

## Monitoring & Analytics

Track the following metrics:
- Number of resets per day/week
- Most common reset reasons
- States from which resets occur most frequently
- Time between assignment and reset

## Timeline

- **Phase 1** (Week 1): Backend implementation and testing
- **Phase 2** (Week 2): Frontend implementation and integration
- **Phase 3** (Week 3): Testing, bug fixes, and documentation
- **Phase 4** (Week 4): Deployment and monitoring

## Acceptance Criteria

✅ Reset button visible in toolbar for authorized users
✅ Confirmation dialog with required reason field
✅ State successfully resets to "assigned"
✅ Audit log entry created for each reset
✅ Notifications sent to relevant users
✅ Reset history maintained in database
✅ Previous data archived before reset
✅ Permission validation working correctly
✅ All tests passing
✅ Documentation updated